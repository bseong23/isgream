import { api } from "../utils/common/axiosInstance";

// interface GetResultToPdfResponse {
//     code: 'S0000' | 'E4001';
//     message: string;
//     data: {
//         url: string;
//     }
// }

export const pdfApi = {
    // HTP 검사 pdf 추출
    async pdfHTP(testId: number): Promise<Blob> {
        try {
          const response = await api.get(`/htp-tests/${testId}/pdf`,{
            responseType: 'blob'
          });
    
          return response.data;
          // if (response.data.code === "S0000") {
          //   console.log("HTP 검사 다운로드 완료", response);
            
          // }
          // throw new Error(response.data.message || "HTP 검사 결과 PDF 추출 실패");
        } catch (error) {
          console.error("HTP 검사 결과 PDF 추출 실패:", error);
          throw error;
        }
    },

    // PAT  검사 pdf 추출
    async pdfPat(testId: number): Promise<Blob> {
        try {
          const response = await api.get(`/pat-tests/${testId}/pdf`,{
            responseType: 'blob'
          });
          return response.data;
    
          // if (response.data.code === "S0000") {
          //   console.log("PAT 검사 다운로드 완료", response);
          // }
          // throw new Error(response.data.message || "PAT 검사 결과 PDF 추출 실패");
        } catch (error) {
          console.error("PAT 검사 결과 PDF 추출 실패:", error);
          throw error;
        }
    },

    // Big five 검사 pdf 추출
    async pdfBigFive(testId: number): Promise<Blob> {
        try {
          const response = await api.get(`/big-five-tests/${testId}/pdf`,{
            responseType: 'blob'
          });
          return response.data;
    
          // if (response.data.code === "S0000") {
          //   console.log("Big five  검사 다운로드 완료", response);
          // }
          // throw new Error(response.data.message || "Big five 검사 결과 PDF 추출 실패");
        } catch (error) {
          console.error("Big five 검사 결과 PDF 추출 실패:", error);
          throw error;
        }
    }

}