import axios from "axios";
import { queryClient } from "./queryClient";

const { VITE_BASE_API } = import.meta.env;

// 공개 접근 가능한 경로 목록
const PUBLIC_PATHS = [
  "/", // 메인 페이지
  "/login", // 로그인 페이지
  "/signup", // 회원가입 페이지
  "/board", // 게시판 목록
  "/board/detail" // 게시글 상세
  // 필요한 public path 추가
];

// 현재 경로가 public인지 확인하는 함수
const isPublicPath = (path: string) => {
  return PUBLIC_PATHS.some((publicPath) => path.startsWith(publicPath));
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

api.interceptors.request.use(
  (config) => {
    const currentPath = window.location.pathname;

    // 토큰이 필요한 API 요청인지 확인
    const isPublicRequest = isPublicPath(currentPath);

    // 로그아웃 중이거나 토큰이 만료된 경우, public 경로가 아닌 경우만 요청 취소
    if ((isTokenExpired || isLoggingOut) && !isPublicRequest) {
      return Promise.reject(new Error("인증이 만료되었습니다."));
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["access"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 로그아웃 API 호출시에는 401 에러를 무시
    if (error.config.url === "/users/logout") {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !isLoggingOut && !isTokenExpired) {
      const currentPath = window.location.pathname;

      // public 경로가 아닌 경우에만 로그아웃 처리
      if (!isPublicPath(currentPath)) {
        isLoggingOut = true;
        isTokenExpired = true;
        localStorage.removeItem("accessToken");
        delete api.defaults.headers.common["access"];
        queryClient.setQueryData(["auth"], { isAuthenticated: false });

        // public 경로가 아닌 경우에만 로그인 페이지로 리다이렉트
        window.location.href = "/login";

        setTimeout(() => {
          isLoggingOut = false;
        }, 1000);
      }
    }
    return Promise.reject(error);
  }
);
