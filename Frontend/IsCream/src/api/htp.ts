import { api } from "../utils/common/axiosInstance";
import { UploadDrawingResponse, GetTestListResponse } from "../types/htp";

export const uploadDrawing = async (formData: FormData): Promise<UploadDrawingResponse> => {
  try {
    const response = await api.post<UploadDrawingResponse>("/htp-tests/img", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("✅ 업로드 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ 업로드 오류:", error);
    throw error;
  }
};

export const htpGetResultList = async(startDate: string, endDate: string): Promise<GetTestListResponse> => {
  try{
    const response = await api.get(`/htp-tests?startDate=${startDate}&endDate=${endDate}`,)
    
    console.log("HTP검사: ", response.data);
    
    if(response.data.code === "S0000"){
        return response.data;
    }
    throw new Error(response.data.message || "HTP 검사 목록 조회 실패");
}catch (error) {
    console.error("HTP 검사 목록 조회 실패", error);
    throw error;
}
}
