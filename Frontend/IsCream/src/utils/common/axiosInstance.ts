// utils/common/axiosInstance.ts
import axios from "axios";
import { queryClient } from "./queryClient";

const { VITE_BASE_API } = import.meta.env;

export const api = axios.create({
  baseURL: VITE_BASE_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// 요청 전에 토큰을 헤더에 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      // Authorization 대신 access 헤더로 변경
      config.headers["access"] = token;
    } else {
      console.log("No token found in localStorage");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터는 간단하게 유지
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      queryClient.setQueryData(["auth"], { isAuthenticated: false });

      console.log("Response data:", error.response.data);
    }
    return Promise.reject(error);
  }
);
