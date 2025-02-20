import React, { useRef, useState, useEffect } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import characterImage from "../../../assets/image/character2.png"; // 캐릭터 이미지 import
import { useUploadDrawing } from "../../../hooks/htp/useUploadDrawing";
import { DrawingType, UploadDrawingResponse } from "../../../types/htp";
import { createUploadFormData } from "../../../utils/common/formDataHelper"; // ✅ FormData 변환 함수 임포트
import { useNavigate } from "react-router-dom"; // 추가된 부분

interface Canvas2Props {
  type: DrawingType;
  gender?: "male" | "female";
  index: number;
  childId: number;
  onSaveComplete: (data: UploadDrawingResponse) => void;
  onSaveStart: () => void;
}

const Canvas2: React.FC<Canvas2Props> = ({
  type,
  gender,
  index,
  childId,
  onSaveComplete,
  onSaveStart
}) => {
  const navigate = useNavigate(); // 추가된 부분
  const canvasRef = useRef<ReactSketchCanvasRef | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const { mutate: uploadDrawing } = useUploadDrawing();

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleSave = async () => {
    if (!canvasRef.current || !startTime) return;

    // 저장 시작 시 로딩 상태 활성화
    onSaveStart();

    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    const dataUrl = await canvasRef.current.exportImage("png");
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], `drawing_${type}_${index}.png`, {
      type: "image/png"
    });

    const formData = createUploadFormData({
      file,
      time: timeTaken,
      childId,
      type,
      index,
      gender
    });

    console.log("📤 전송할 FormData:", formData);

    uploadDrawing(formData, {
      onSuccess: (apiResponse) => {
        console.log("✅ 저장 성공! API 응답:", apiResponse);

        if (!apiResponse || !apiResponse.data) {
          console.error("❌ API 응답 데이터가 올바르지 않습니다!", apiResponse);
          alert("분석 결과를 불러올 수 없습니다.");
          return;
        }

        onSaveComplete({
          data: {
            result: apiResponse.data.result ?? "",
            houseDrawingUrl: apiResponse.data.houseDrawingUrl ?? "",
            treeDrawingUrl: apiResponse.data.treeDrawingUrl ?? "",
            maleDrawingUrl: apiResponse.data.maleDrawingUrl ?? "",
            femaleDrawingUrl: apiResponse.data.femaleDrawingUrl ?? ""
          }
        });
      },
      onError: (error) => {
        console.error("❌ 저장 오류 발생:", error);
        alert("저장 실패! 다시 시도해주세요.");
      }
    });
  };

  const handleGoBack = () => {
    navigate("/ai-analysis"); // 뒤로가기 버튼 클릭 시 /ai-analysis로 이동
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#EAF8E6] overflow-hidden">
      <div className="w-[95%] h-[90%] mt-[2.5%] bg-white border-[1.5px] border-gray-400 border-opacity-50 rounded-lg p-2">
        <ReactSketchCanvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%" }}
          strokeWidth={4}
          strokeColor="black"
        />
      </div>

      <div className="w-full max-w-lg flex justify-between items-center mt-4 p-4">
        <button
          onClick={handleGoBack}
          className="w-[30%] h-[50px] bg-blue-400 text-white font-semibold rounded-lg text-lg shadow-md"
        >
          그만하기
        </button>
        <button
          onClick={handleClear}
          className="w-[30%] h-[50px] bg-green-600 text-white font-semibold rounded-lg text-lg shadow-md"
        >
          다시 그리기
        </button>
        <button
          onClick={handleSave}
          className="w-[30%] h-[50px] bg-green-600 text-white font-semibold rounded-lg text-lg shadow-md"
        >
          검사 완료
        </button>
      </div>

      <img
        src={characterImage}
        alt="캐릭터"
        className="absolute right-4 bottom-15 w-24 h-auto"
      />
    </div>
  );
};

export default Canvas2;
