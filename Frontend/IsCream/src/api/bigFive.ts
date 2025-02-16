import { api } from "../utils/common/axiosInstance";

interface GetQuestionListResponse {
    code: 'S0000' | 'E4001';
    message: string;
    data: {
        question: string;
        questionType: string;
    }[]
}

interface PostTestResultRequest {
    conscientiousness: number;
    agreeableness: number;
    emotionalStability: number;
    extraversion: number;
    openness: number;
}

interface GetRecentTestResponse {
    code: 'S0000' | 'E4001';
    message: string;
    data: {
        date: string;
        conscientiousness: number;
        agreeableness: number;
        emotionalStability: number;
        extraversion: number;
        openness: number;
    }
}

interface GetTestListResponse {
    code: 'S0000' | 'E4001';
    message: string;
    data: {
        date: string;
        conscientiousness: number;
        agreeableness: number;
        emotionalStability: number;
        extraversion: number;
        openness: number;
    }[]
}

export const bigFiveApi = {
    // bigFive 질문 목록 조회
    async getQuestionList(): Promise<GetQuestionListResponse> {
        try {
          const response = await api.get("/big-five-tests/questions");
    
          if (response.data.code === "S0000") {
            return response.data;
          }
          throw new Error(response.data.message || "PAT 검사 질문 목록 조회 실패");
        } catch (error) {
          console.error("PAT 검사 질문 목록 조회 실패:", error);
          throw error;
        }
    },

    // bigFive 검사 결과 제출
    async postTest(): Promise<PostTestResultRequest> {
        try{
            const response = await api.post("/big-five-tests");

            if(response.data.code === "S0000"){
                return response.data;
            }
            throw new Error(response.data.message || "bigFive 검사 결과 제출 실패");
        }catch (error) {
            console.error("bigFive 검사 결과 제출 실패", error);
            throw error;
        }
    },

    // bigFive 검사 결과 조회 (1개)
    async getRecentResult() : Promise<GetRecentTestResponse> {
        try{
            const response = await api.get("/big-five-tests/recent")

            if(response.data.code === "S0000"){
                console.log(response.data.data);
                
                return response.data;
            }
            throw new Error(response.data.message || "bigFive 검사 조회 실패");
        }catch (error) {
            console.error("bigFive 검사 결과 조회 실패", error);
            throw error;
        }
    },

    // bigFive 검사 결과 목록 조회
    async getResultList() : Promise<GetTestListResponse> {
        try{
            const response = await api.get("/big-five-tests")

            if(response.data.code === "S0000"){
                return response.data;
            }
            throw new Error(response.data.message || "bigFive 검사 목록 조회 실패");
        }catch (error) {
            console.error("bigFive 검사 결과 목록 조회 실패", error);
            throw error;
        }
    }


}