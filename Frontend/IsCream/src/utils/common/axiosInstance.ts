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

// access 토큰 갱신 함수
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${VITE_BASE_API}/auth/refresh`,
      {},
      { withCredentials: true } // refresh 토큰이 쿠키에 있으므로
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

export const api = axios.create({
  baseURL: VITE_BASE_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

let isLoggingOut = false;
let isTokenExpired = false;
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

api.interceptors.request.use(
  async (config) => {
    const currentPath = window.location.pathname;
    const isPublicRequest = isPublicPath(currentPath);

    if ((isTokenExpired || isLoggingOut) && !isPublicRequest) {
      return Promise.reject(new Error("인증이 만료되었습니다."));
    }

    const token = localStorage.getItem("accessToken");
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
            // refresh 토큰도 만료된 경우
            isTokenExpired = true;
            localStorage.removeItem("accessToken");
            queryClient.setQueryData(["auth"], { isAuthenticated: false });
            window.location.href = "/login";
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

    if (error.config?.url === "/users/logout") {
      return Promise.reject(error);
    }

    // access 토큰이 만료된 경우
    if (
      error.response?.status === 401 &&
      !isLoggingOut &&
      !isTokenExpired &&
      originalRequest
    ) {
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

    // refresh 토큰도 만료된 경우
    const currentPath = window.location.pathname;
    if (!isPublicPath(currentPath)) {
      isLoggingOut = true;
      isTokenExpired = true;
      localStorage.removeItem("accessToken");
      if (api.defaults.headers.common) {
        delete api.defaults.headers.common["access"];
      }
      queryClient.setQueryData(["auth"], { isAuthenticated: false });
      window.location.href = "/login";

      setTimeout(() => {
        isLoggingOut = false;
      }, 1000);
    }

    return Promise.reject(error);
  }
);
