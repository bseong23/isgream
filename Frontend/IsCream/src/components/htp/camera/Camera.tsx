import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useUploadDrawing } from "../../../hooks/htp/useUploadDrawing";
import { DrawingType } from "../../../types/htp";
import { createUploadFormData } from "../../../utils/common/formDataHelper";

interface Camera2Props {
  type: DrawingType;
  gender?: "male" | "female";
  index: number;
  childId: number;
  onSaveComplete: (data: any) => void; // ✅ 매개변수 추가
}

const Camera: React.FC<CameraProps> = ({ type, gender, index, childId, onSaveComplete }) => {
  const webcamRef = useRef<Webcam | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [manualTime, setManualTime] = useState<string>("");
  const { mutate: uploadPhoto } = useUploadDrawing();

  const handleCapture = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    setCapturedImage(imageSrc);
  };

  const handleSave = async () => {
    if (!manualTime) {
      alert('시간을 입력해주세요!');
      return;
    }
    if (!capturedImage || !manualTime) return;
    const response = await fetch(capturedImage);
    const blob = await response.blob();
    const file = new File([blob], `photo_${type}_${index}.png`, { type: "image/png" });
    
    const formData = createUploadFormData({ file, time: manualTime, childId, type, index, gender });

    uploadPhoto(formData, {
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
    <div className="fixed inset-0 flex flex-col items-center bg-gray-100 overflow-hidden">
      {!capturedImage ? (
        <Webcam ref={webcamRef} screenshotFormat="image/png" className="w-[75%] h-[50%] bg-black " />
      ) : (
        <img src={capturedImage} alt="Captured" className="w-[75%] h-[50%] object-contain" />
      )}

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleCapture}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md"
        >
          촬영하기
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md"
        >
          저장하기
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <label className="text-gray-700 mb-2">걸린 시간(초) 입력:</label>
        <input
          type="text"
          value={manualTime}
          onChange={(e) => setManualTime(e.target.value)}
          className="border border-gray-400 px-2 py-1 rounded-md w-20 text-center"
          placeholder="직접 입력"
        />
      </div>
    </div>
  );
};

export default Camera;
