import React, { useRef, useState, useEffect } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import characterImage from "../../../assets/image/character2.png";
import { useUploadDrawing } from "../../../hooks/htp/useUploadDrawing";
import { DrawingType } from "../../../types/htp";
import { createUploadFormData } from "../../../utils/common/formDataHelper";

interface CanvasProps {
  type: DrawingType;
  gender?: "male" | "female";
  index: number;
  childId: number;
  onSaveComplete: (data: string) => void; // ✅ 데이터 전달하도록 변경
}

const HEADER_HEIGHT = 60; // 헤더 높이 (px)

const Canvas: React.FC<CanvasProps> = ({ type, gender, index, childId, onSaveComplete }) => {
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
  
    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    const dataUrl = await canvasRef.current.exportImage("png");
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], `drawing_${type}_${index}.png`, { type: "image/png" });
  
    const formData = createUploadFormData({ file, time: timeTaken, childId, type, index, gender });
  
    console.log("📤 전송할 FormData:", formData);
  
    uploadDrawing(formData, {
      onSuccess: (apiResponse) => {
        console.log("✅ 저장 성공! API 응답:", apiResponse);
  
        if (!apiResponse || !apiResponse.data) {
          console.error("❌ API 응답 데이터가 올바르지 않습니다!", apiResponse);
          alert("분석 결과를 불러올 수 없습니다.");
          return;
        }
  
        // ✅ API 응답에서 result 값 가져오기
        const { houseDrawingUrl, treeDrawingUrl, maleDrawingUrl, femaleDrawingUrl, result } = apiResponse.data;

  
        // ✅ API 응답 데이터를 JSON 형태로 부모 컴포넌트로 전달
        const analysisData = {
          data: {
            result,
            houseDrawingUrl,
            treeDrawingUrl,
            maleDrawingUrl,
            femaleDrawingUrl,
          },
        };
  
        console.log("📌 Canvas.tsx에서 onSaveComplete 호출됨:", analysisData);
  
        if (!onSaveComplete) {
          console.error("❌ onSaveComplete 함수가 존재하지 않습니다!");
          return;
        }
  
        onSaveComplete(analysisData); // ✅ 부모 컴포넌트(CanvasPage.tsx)로 API 응답 데이터 전달
      },
      onError: (error) => {
        console.error("❌ 저장 오류 발생:", error);
        alert("저장 실패! 다시 시도해주세요.");
      },
    });
  };
  

  

  return (
    <div
      className="fixed inset-x-0 top-[60px] flex justify-center items-center bg-[#EAF8E6] overflow-hidden"
      style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
    >
      <div className={`flex w-[95%] h-[95%] ${type === "house" ? "flex-row" : "flex-col"} justify-between items-center relative`}>
        {/* 🎨 그림판 */}
        <div className="border-[1.5px] border-gray-400 border-opacity-50 rounded-[15px] overflow-hidden w-[88%] h-full">
          <ReactSketchCanvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%" }}
            strokeWidth={4}
            strokeColor="black"
          />
        </div>

        {/* 🛠 버튼 + 캐릭터 컨테이너 */}
        <div className="flex flex-col items-center justify-between h-full w-[12%] ml-4">
          {/* 버튼 그룹 */}
          <div className="flex flex-col gap-4 w-full">
            <button
              onClick={handleClear}
              className="w-full h-[40px] bg-green-600 text-white font-semibold rounded-lg text-sm shadow-md"
            >
              다시
            </button>
            <button
              onClick={handleSave}
              className="w-full h-[40px] bg-green-600 text-white font-semibold rounded-lg text-sm shadow-md"
            >
              저장
            </button>
          </div>

          {/* 🐻 캐릭터 (하단 정렬) */}
          <div className="flex justify-center w-full">
            <img
              src={characterImage}
              alt="캐릭터"
              className="w-[160px] h-auto mb-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
