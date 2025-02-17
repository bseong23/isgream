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
  onSaveComplete: () => void;
}

const Camera2: React.FC<Camera2Props> = ({ type, gender, index, childId, onSaveComplete }) => {
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
      onSuccess: () => {
        console.log("✅ 저장 성공!");
        onSaveComplete();
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
        <Webcam ref={webcamRef} screenshotFormat="image/png" className="w-[50%] h-[75%] bg-black " />
      ) : (
        <img src={capturedImage} alt="Captured" className="w-[50%] h-[75%] object-contain" />
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

export default Camera2;