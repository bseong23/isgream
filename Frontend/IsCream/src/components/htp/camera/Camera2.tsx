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
  onSaveComplete: (data: any) => void;
  onSaveStart: () => void;
}

const Camera2: React.FC<Camera2Props> = ({
  type,
  gender,
  index,
  childId,
  onSaveComplete,
  onSaveStart
}) => {
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
      alert("시간을 입력해주세요!");
      return;
    }
    if (!capturedImage || !manualTime) return;

    onSaveStart(); // 저장 시작 시 로딩 표시

    const response = await fetch(capturedImage);
    const blob = await response.blob();
    const file = new File([blob], `photo_${type}_${index}.png`, {
      type: "image/png"
    });

    const formData = createUploadFormData({
      file,
      time: manualTime,
      childId,
      type,
      index,
      gender
    });

    uploadPhoto(formData, {
      onSuccess: (apiResponse) => {
        if (!apiResponse || !apiResponse.data) {
          console.error("❌ API 응답 데이터가 올바르지 않습니다!", apiResponse);
          alert("분석 결과를 불러올 수 없습니다.");
          return;
        }

        const {
          houseDrawingUrl,
          treeDrawingUrl,
          maleDrawingUrl,
          femaleDrawingUrl,
          result
        } = apiResponse.data;

        const analysisData = {
          data: {
            result,
            houseDrawingUrl,
            treeDrawingUrl,
            maleDrawingUrl,
            femaleDrawingUrl
          }
        };

        onSaveComplete(analysisData);
      },
      onError: (error) => {
        console.error("❌ 저장 오류 발생:", error);
        alert("저장 실패! 다시 시도해주세요.");
      }
    });
  };

  return (
    <div className="fixed inset-0 flex flex-col pb-20 mt-15 items-center justify-start bg-gray-50 px-4 py-6 gap-6 overflow-y-auto">
      {/* 카메라/이미지 영역 */}
      <div className="w-full max-w-xl aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-lg">
        {!capturedImage ? (
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/png"
            className="w-full h-full object-cover"
            videoConstraints={{
              facingMode: "environment",
              aspectRatio: 3 / 4
            }}
          />
        ) : (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-contain bg-black"
          />
        )}
      </div>

      {/* 시간 입력 */}
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-center gap-4">
        <label className="text-gray-700 font-medium">소요 시간 (초)</label>
        <input
          type="number"
          value={manualTime}
          onChange={(e) => setManualTime(e.target.value)}
          className="flex-1 w-full sm:w-48 border border-gray-300 px-4 py-3 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="예: 300"
          min="0"
        />
      </div>

      {/* 버튼 그룹 */}
      <div className="w-full max-w-xl flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={handleCapture}
          className="w-full h-14 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          촬영하기
        </button>
        <button
          onClick={handleSave}
          className="w-full h-14 bg-green-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          저장하기
        </button>
      </div>
    </div>
  );
};

export default Camera2;
