export type DrawingType = "house" | "tree" | "male" | "female"; // 🔥 "male", "female" 추가

export interface UploadDrawingParams {
  file: FormData;
  time: string;
  childId: number;
  type: DrawingType;
  index: number;
}

export interface UploadDrawingResponse {
  code: "S0000" | "E7003" | "E4002";
  message: string;
  data?: {
    testId: number;
  };
}
export interface GetTestListResponse {
  code: 'S0000' | 'E4001';
    message: string;
    data: {
        date: string;
        id: string;
        status: string;
        testType: string;
    }[]
}
