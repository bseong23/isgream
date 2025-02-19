import axios, { AxiosError } from "axios";
import { queryClient } from "./queryClient";

const { VITE_BASE_API } = import.meta.env;

interface DecodedToken {
  exp: number;
  iat: number;
}

const PUBLIC_PATHS = ["/", "/login", "/signup", "/board", "/board/detail"];

const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64)) as DecodedToken;
  } catch {
    return null;
  }
};

const isTokenValid = (token: string): boolean => {
  const decodedToken = decodeToken(token);
  if (!decodedToken) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp > currentTime;
};

const isPublicPath = (path: string): boolean => {
  return PUBLIC_PATHS.some((publicPath) => path.startsWith(publicPath));
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

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

  // Public 페이지에서는 로그아웃 처리만 하고 리다이렉트는 하지 않음
  if (isPublicPath(currentPath)) {
    isRefreshing = false;
    refreshSubscribers = [];
    localStorage.clear();

    if (api.defaults.headers.common) {
      delete api.defaults.headers.common["access"];
    }

    queryClient.setQueryData(["auth"], { isAuthenticated: false });
    queryClient.clear();
    return;
  }

  // Private 페이지에서만 전체 로그아웃 처리 및 리다이렉트
  isRefreshing = false;
  refreshSubscribers = [];
  localStorage.clear();

  if (api.defaults.headers.common) {
    delete api.defaults.headers.common["access"];
  }

  queryClient.setQueryData(["auth"], { isAuthenticated: false });
  queryClient.clear();

  if (currentPath !== "/login") {
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
