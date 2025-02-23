import { api } from "../utils/common/axiosInstance";
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  LogoutResponse
} from "../types/auth";
import { ERROR_CODES } from "../types/auth";
import { AxiosError } from "axios";
import { resetChild } from "../store/slices/childSlice";
import { clearAccessToken } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { useFCM } from "./notification/useFCM";

interface User {
  id?: string;
  name?: string;
}

interface AuthHook {
  isAuthenticated: boolean;
  user?: User;
  login: (loginData: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<LogoutResponse>;
  signUp: (signUpData: SignUpRequest) => Promise<SignUpResponse>;
}

export const useAuth = (): AuthHook => {
  const dispatch = useDispatch();
  const { deleteToken } = useFCM();
  const isAuthenticated = !!localStorage.getItem("accessToken");

  const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/users/login", loginData);

    if (response.data.code === "S0000") {
      const accessToken = response.headers["access"];
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        api.defaults.headers.common["access"] = `Bearer ${accessToken}`;
      } else {
        console.error("Access token이 응답 헤더에 없습니다.");
      }
    }

    return response.data;
  };

  const signUp = async (signUpData: SignUpRequest): Promise<SignUpResponse> => {
    const response = await api.post<SignUpResponse>("/users/join", signUpData);
    return response.data;
  };

  const logout = async (): Promise<LogoutResponse> => {
    try {
      // 1. 먼저 로그아웃 API 호출
      const response = await api.post<LogoutResponse>("/users/logout");

      if (response.data.code === ERROR_CODES.SUCCESS) {
        // 2. 로그아웃이 성공하면 FCM 토큰 삭제 시도
        try {
          await deleteToken();
        } catch (fcmError) {
          console.error("FCM 토큰 삭제 실패:", fcmError);
          // FCM 토큰 삭제 실패는 크리티컬하지 않으므로 무시
        }

        // 3. 나머지 정리 작업
        localStorage.removeItem("accessToken");
        delete api.defaults.headers.common["access"];

        dispatch(resetChild());
        dispatch(clearAccessToken());
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return error.response.data as LogoutResponse;
      }
      return {
        code: ERROR_CODES.USER_NOT_FOUND,
        message: "로그아웃 중 오류가 발생했습니다."
      };
    }
  };

  return {
    isAuthenticated,
    login,
    logout,
    signUp
  };
};
