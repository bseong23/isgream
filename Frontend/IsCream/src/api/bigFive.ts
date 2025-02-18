// src/api/bigFiveApi.ts
import { api } from "../utils/common/axiosInstance";
import {
  BigFiveQuestionsResponse,
  BigFiveTestResultRequest,
  BigFiveTestResultResponse,
  BigFiveRecentResultResponse,
  GetTestListResponse
} from "../types/bigfive";

export const bigFiveApi = {
  // 질문 목록 조회
  async getQuestionList(): Promise<BigFiveQuestionsResponse> {
    try {
      const response = await api.get("/big-five-tests/questions");

      if (response.data.code === "S0000") {
        return response.data;
      }
      throw new Error(response.data.message || "문제 목록 조회 실패");
    } catch (error) {
      console.error("문제 목록 조회 실패:", error);
      throw error;
    }
  },

  // 검사 결과 제출
  async submitTestResult(
    resultData: BigFiveTestResultRequest
  ): Promise<BigFiveTestResultResponse> {
    try {
      const response = await api.post("/big-five-tests", resultData);

      if (response.data.code === "S0000") {
        return response.data;
      }
      throw new Error(response.data.message || "검사 결과 제출 실패");
    } catch (error) {
      console.error("검사 결과 제출 실패:", error);
      throw error;
    }
  },

  // 최근 검사 결과 조회
  async getRecentResult(childId: number): Promise<BigFiveRecentResultResponse> {
    try {
      const response = await api.get(`/big-five-tests/recent/${childId}`);

      if (response.data.code === "S0000") {
        return response.data;
      }
      throw new Error(response.data.message || "최근 검사 결과 조회 실패");
    } catch (error) {
      console.error("최근 검사 결과 조회 실패:", error);
      throw error;
    }
  },

  // PAT 검사 결과 목록 조회
  async getResultList(
    startDate: string,
    endDate: string
  ): Promise<GetTestListResponse> {
    try {
      const response = await api.get(
        `/big-five-tests?startDate=${startDate}&endDate=${endDate}`
      );

      if (response.data.code === "S0000") {
        return response.data;
      }
      throw new Error(response.data.message || "BFI 검사 목록 조회 실패");
    } catch (error) {
      console.error("BFI 검사 결과 목록 조회 실패", error);
      throw error;
    }
  }
};
