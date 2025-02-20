import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useUploadDrawing } from "../../../hooks/htp/useUploadDrawing";
import { DrawingType } from "../../../types/htp";
import { createUploadFormData } from "../../../utils/common/formDataHelper";
import { useNavigate } from "react-router-dom"; // 추가된 부분

interface CameraProps {
  type: DrawingType;
  gender?: "male" | "female";
  index: number;
  childId: number;
  onSaveComplete: (data: any) => void;
  onSaveStart: () => void;
}

const Camera: React.FC<CameraProps> = ({
  type,
  gender,
  index,
  childId,
  onSaveComplete,
  onSaveStart
}) => {
  const navigate = useNavigate();
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

  const handleGoBack = () => {
    navigate("/ai-analysis"); // 추가된 부분: 뒤로가기 버튼 클릭 시 /ai-analysis로 이동
  };

  return (
    <div className="flex flex-col -mt-20 items-center bg-gray-50 px-4 py-6 md:px-8">
      <div className="inline-flex items-center">
        <span className="text-5xl my-5">집</span>
        <span className="text-3xl my-5">🏠</span>
      </div>
      {/* 카메라/이미지 영역 */}
      <div className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-lg mb-8">
        {!capturedImage ? (
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/png"
            className="w-full h-full object-contain"
            videoConstraints={{
              facingMode: "environment",
              aspectRatio: 9 / 16, // 비율 강제
            }}
          />
        ) : (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* 컨트롤 영역 */}
      <div className="w-full max-w-2xl flex flex-col items-center space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <label className="text-gray-700 font-medium whitespace-nowrap">
            소요 시간 (초)
          </label>
          <input
            type="number"
            value={manualTime}
            onChange={(e) => setManualTime(e.target.value)}
            className="flex-1 border border-gray-300 px-4 py-2 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="예: 300"
            min="0"
          />
        </div>
        {/* 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button
            onClick={handleCapture}
            className="w-full sm:w-48 h-14 bg-green-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            촬영하기
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:w-48 h-14 bg-green-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            저장하기
          </button>
          <button
            onClick={handleGoBack}
            className="w-full sm:w-48 h-14 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            검사 그만하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Camera;
