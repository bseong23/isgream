import { api } from "../utils/common/axiosInstance";
import { ChatbotResponse } from "../types/chatbot";
import { AxiosError } from "axios";

export const chatbot = {
  async sendQuery(question: string): Promise<ChatbotResponse> {
    try {
      const response = await api.post<ChatbotResponse>("/chatbot", null, {
        params: { question }
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("챗봇 API 에러:", error);

        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "챗봇 서비스 연결 중 오류가 발생했습니다."
        );
      }

      // 예상치 못한 다른 유형의 에러 처리
      throw error;
    }
  }
};
