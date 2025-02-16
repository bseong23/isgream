export interface Child {
  childId: number;
  nickname: string;
  birthDate: string;
  gender: "M" | "F";
}

export interface ApiResponse {
  code: string;
  message?: string;
}