import { api } from '../utils/common/axiosInstance';

export interface HTPTestResult {
  testId: number;
  title: string;
  date: string;
  pdf: string | null;
  result: string; // 분석된 검사 결과 (JSON으로 파싱 필요)
}

export interface APIResponse {
  code: string;
  message: string;
  data: HTPTestResult;
}

// 📌 HTP 검사 결과 조회 API
export const getHTPTestResult = async (testId: number): Promise<HTPTestResult> => {
  console.log("📌 getHTPTestResult 실행됨, 요청할 testId:", testId);

  if (!testId) {
    console.error("❌ testId가 제공되지 않음. API 호출 중단!");
    throw new Error("Invalid test ID: testId is undefined or null");
  }

  try {
    console.log("📡 API 요청 직전:", `/htp-tests/${testId}`);
    const response = await api.get(`/htp-tests/${testId}`);

    console.log("✅ API 응답 도착:", response);

    if (!response.data || !response.data.data) {
      throw new Error("❌ API 응답 형식이 올바르지 않습니다.");
    }

    return response.data.data;
  } catch (error) {
    console.error("❌ API 요청 실패:", error);
    throw error;
  }
};
