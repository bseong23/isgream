import { api } from "../utils/common/axiosInstance";
import {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  EmailCheckResponse,
  NicknameCheckResponse,
  LogoutResponse,
  ERROR_CODES
} from "../types/auth";
import { AxiosError } from "axios";

export const login = async (
  loginData: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/users/login", loginData);

    const accessToken = response.headers["access"];
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data as LoginResponse;
    }
    return {
      code: ERROR_CODES.SYSTEM_ERROR,
      message: "로그인 중 오류가 발생했습니다."
    };
  }
};

export const logout = async (): Promise<LogoutResponse> => {
  try {
    const response = await api.post<LogoutResponse>("/users/logout");

    if (response.data.code === ERROR_CODES.SUCCESS) {
      // 로그아웃 성공 시 로컬 스토리지의 토큰 제거
      localStorage.removeItem("accessToken");
      // axios 인스턴스의 헤더에서 Authorization 제거
      delete api.defaults.headers.common["Authorization"];
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

export const signUp = async (
  signUpData: SignUpRequest
): Promise<SignUpResponse> => {
  try {
    const response = await api.post<SignUpResponse>("/users/join", signUpData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data as SignUpResponse;
    }
    return {
      code: ERROR_CODES.SIGNUP_ERROR,
      message: "회원가입 중 오류가 발생했습니다."
    };
  }
};

export const checkEmailDuplicate = async (
  email: string
): Promise<EmailCheckResponse> => {
  try {
    const response = await api.post<EmailCheckResponse>("/users/email/check", {
      email
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data as EmailCheckResponse;
    }
    return {
      code: ERROR_CODES.EMAIL_DUPLICATE,
      message: "이메일 중복 확인 중 오류가 발생했습니다."
    };
  }
};

export const checkNicknameDuplicate = async (
  nickname: string
): Promise<NicknameCheckResponse> => {
  try {
    const response = await api.post<NicknameCheckResponse>(
      "/users/nickname/check",
      {
        nickname
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data as NicknameCheckResponse;
    }
    return {
      code: ERROR_CODES.NICKNAME_DUPLICATE,
      message: "닉네임 중복 확인 중 오류가 발생했습니다."
    };
  }
};
