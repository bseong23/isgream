export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  code:
    | "S0000"
    | "E6001"
    | "E5011"
    | "E5012"
    | "E3001"
    | "E3002"
    | "E3003"
    | "E3004";
  message: string;
}

export interface LogoutResponse {
  code: "S0000" | "E3003";
  message: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  nickname: string;
  phone: string;
  relation: string;
  birthDate: string;
}

export interface SignUpResponse {
  code: "S0000" | "E5005";
  message: string;
}

export interface EmailCheckRequest {
  email: string;
}

export interface EmailCheckResponse {
  code: "S0000" | "E5001";
  message: string;
}

export interface NicknameCheckRequest {
  nickname: string;
}

export interface NicknameCheckResponse {
  code: "S0000" | "E5002";
  message: string;
}

export const ERROR_CODES = {
  // 공통 성공 코드
  SUCCESS: "S0000",

  // 로그인 관련 에러 코드
  INVALID_REQUEST: "E6001",
  SYSTEM_ERROR: "E5011",
  DB_ERROR: "E5012",
  INVALID_EMAIL: "E3001",
  INVALID_PASSWORD: "E3002",
  USER_NOT_FOUND: "E3003",
  AUTH_FAILED: "E3004",

  // 회원가입 관련 에러 코드
  SIGNUP_ERROR: "E5005",

  // 중복 체크 관련 에러 코드
  EMAIL_DUPLICATE: "E5001",
  NICKNAME_DUPLICATE: "E5002"
} as const;
