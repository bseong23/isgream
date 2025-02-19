import axios, { AxiosError } from "axios";
import { queryClient } from "./queryClient";

const { VITE_BASE_API } = import.meta.env;

interface DecodedToken {
  exp: number;
  iat: number;
}

const PUBLIC_PATHS = ["/", "/login", "/signup", "/board", "/board/detail"];
const MAX_RETRY_COUNT = 3;
let retryCount = 0;
let tokenCheckInterval: number | null = null;

const isPublicPath = (path: string): boolean => {
  return PUBLIC_PATHS.some((publicPath) => path.startsWith(publicPath));
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 토큰 만료 체크 함수
const tokenExpirationCheck = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedToken = JSON.parse(window.atob(base64)) as DecodedToken;

    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp <= currentTime) {
      handleLogout();
    }
  } catch {
    handleLogout();
  }
};

// 토큰 유효성 검사
const isTokenValid = (token: string): boolean => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedToken = JSON.parse(window.atob(base64)) as DecodedToken;

    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp > currentTime;
  } catch {
    return false;
  }
};

// 리프레시 후 실행할 콜백 등록
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// 리프레시 후 대기 중인 요청들 실행
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// access 토큰 갱신 함수
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${VITE_BASE_API}/auth/refresh`,
      {},
      { withCredentials: true }
    );

    const newAccessToken = response.data.accessToken;
    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
      retryCount = 0; // 새 토큰을 받으면 재시도 횟수 초기화
      return newAccessToken;
    }
    return null;
  } catch (error) {
    console.error("Refresh token is invalid:", error);
    return null;
  }
};

// 로그아웃 처리 함수
const handleLogout = () => {
  const currentPath = window.location.pathname;

  // 모든 상태 초기화
  isRefreshing = false;
  refreshSubscribers = [];
  retryCount = 0;

  // localStorage 초기화
  localStorage.removeItem("accessToken");

  // API 헤더 초기화
  if (api.defaults.headers.common) {
    delete api.defaults.headers.common["access"];
  }

  // 쿼리 캐시 초기화
  queryClient.setQueryData(["auth"], { isAuthenticated: false });
  queryClient.clear();

  // 토큰 체크 인터벌 제거
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
    tokenCheckInterval = null;
  }

  // Public 페이지가 아닐 경우에만 리다이렉트
  if (!isPublicPath(currentPath) && currentPath !== "/login") {
    window.location.href = "/login";
  }
};

export const api = axios.create({
  baseURL: VITE_BASE_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// 기존 인터벌 제거 및 새로운 인터벌 설정
if (tokenCheckInterval) {
  clearInterval(tokenCheckInterval);
}
tokenCheckInterval = window.setInterval(tokenExpirationCheck, 60000);

// 초기 토큰 체크 실행
tokenExpirationCheck();

api.interceptors.request.use(
  async (config) => {
    const currentPath = window.location.pathname;
    const isPublicRequest = isPublicPath(currentPath);

    const token = localStorage.getItem("accessToken");
    if (!token && !isPublicRequest) {
      handleLogout();
      return Promise.reject(new Error("인증이 필요합니다."));
    }

    if (token) {
      if (!isPublicRequest && !isTokenValid(token)) {
        if (retryCount >= MAX_RETRY_COUNT) {
          handleLogout();
          return Promise.reject(new Error("최대 재시도 횟수를 초과했습니다."));
        }

        if (!isRefreshing) {
          isRefreshing = true;
          const newToken = await refreshAccessToken();
          isRefreshing = false;

          if (newToken) {
            onRefreshed(newToken);
            if (config.headers) {
              config.headers["access"] = newToken;
            }
            return config;
          } else {
            handleLogout();
            return Promise.reject(new Error("인증이 만료되었습니다."));
          }
        } else {
          // 다른 요청이 리프레시 중인 경우
          return new Promise((resolve) => {
            addRefreshSubscriber((token: string) => {
              if (config.headers) {
                config.headers["access"] = token;
              }
              resolve(config);
            });
          });
        }
      }
      if (config.headers) {
        config.headers["access"] = token;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const currentPath = window.location.pathname;

    if (error.config?.url === "/users/logout") {
      return Promise.reject(error);
    }

    // Public 페이지에서는 401 에러를 그대로 전파
    if (isPublicPath(currentPath)) {
      return Promise.reject(error);
    }

    // Private 페이지에서만 토큰 갱신 시도
    if (error.response?.status === 401 && originalRequest) {
      if (retryCount >= MAX_RETRY_COUNT) {
        handleLogout();
        return Promise.reject(new Error("최대 재시도 횟수를 초과했습니다."));
      }

      retryCount++;

      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;

        if (newToken) {
          // 원래 요청 재시도
          if (originalRequest.headers) {
            originalRequest.headers["access"] = newToken;
          }
          return api(originalRequest);
        } else {
          handleLogout();
          return Promise.reject(new Error("인증이 만료되었습니다."));
        }
      }

      // 다른 요청이 리프레시 중인 경우
      return new Promise((resolve) => {
        addRefreshSubscriber((token: string) => {
          if (originalRequest.headers) {
            originalRequest.headers["access"] = token;
          }
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);
