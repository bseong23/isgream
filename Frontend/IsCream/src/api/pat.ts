import { api } from "../utils/common/axiosInstance";

interface GetQuestionListResponse {
    code: 'S0000' | 'E4001';
    message: string;
    data: {
        question: string;
        answer1: string;
        answer2: string;
        answer3: string;
    }[]
}

interface PostUserInfoRequest {
    scoreA: number;
    scoreB: number;
    scoreC: number;
}

interface GetRecentTestResponse {
    code: 'S0000' | 'E4001';
    message: string;
    data: {
        testDate: string;
        scoreA: number;
        scoreB: number;
        scoreC: number;
        result: string;
    }
}

interface GetTestListResponse {
    code: 'S0000' | 'E4001';
    message: string;
    data: {
        testDate: string;
        scoreA: number;
        scoreB: number;
        scoreC: number;
        result: string;
    }[]
}


export const patApi = {
    // PAT 질문 목록 조회
    async getQuestionList(): Promise<GetQuestionListResponse> {
        try {
          const response = await api.get("/pat-tests/questions");
    
          if (response.data.code === "S0000") {
            return response.data;
          }
          throw new Error(response.data.message || "PAT 검사 질문 목록 조회 실패");
        } catch (error) {
          console.error("PAT 검사 질문 목록 조회 실패:", error);
          throw error;
        }
    },

    // PAT 검사 결과 제출
    async postTest(): Promise<PostUserInfoRequest> {
        try{
            const response = await api.post("/pat-tests");

            if(response.data.code === "S0000"){
                return response.data;
            }
            throw new Error(response.data.message || "PAT 검사 결과 제출 실패");
        }catch (error) {
            console.error("검사 결과 제출 실패", error);
            throw error;
        }
    },

    // PAT 검사 결과 조회 (1개)
    async getRecentResult() : Promise<GetRecentTestResponse> {
        try{
            const response = await api.get("/pat-tests/recent")

            if(response.data.code === "S0000"){
                console.log(response.data.data);
                
                return response.data;
            }
            throw new Error(response.data.message || "PAT 검사 조회 실패");
        }catch (error) {
            console.error("검사 결과 조회 실패", error);
            throw error;
        }
    },

    // PAT 검사 결과 목록 조회
    async getResultList() : Promise<GetTestListResponse> {
        try{
            const response = await api.get("/pat-tests")

            if(response.data.code === "S0000"){
                return response.data;
            }
            throw new Error(response.data.message || "PAT 검사 목록 조회 실패");
        }catch (error) {
            console.error("검사 결과 목록 조회 실패", error);
            throw error;
        }
    }


}