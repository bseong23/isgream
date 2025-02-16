import { api } from "../utils/common/axiosInstance";
import { UploadDrawingResponse } from "../types/htp";

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
