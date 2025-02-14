import { useMutation } from "@tanstack/react-query";
import { uploadDrawing } from "../../api/htp";
import { UploadDrawingResponse } from "../../types/htp";

export const useUploadDrawing = () => {
  return useMutation<UploadDrawingResponse, Error, FormData>({
    mutationFn: uploadDrawing,
    onSuccess: () => {
      console.log("✅ 그림 저장 완료!");
    },
    onError: (error) => {
      console.error("❌ 그림 저장 실패:", error);
      alert("저장 실패! 다시 시도해주세요.");
    },
  });
};
