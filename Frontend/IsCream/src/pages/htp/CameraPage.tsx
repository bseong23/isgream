import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CameraPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 이전 페이지가 `PhotoCapturePage.tsx`인지 확인
  const fromPhotoCapture = location.state?.fromPhotoCapture || false;

  // 📷 카메라 자동 실행
  React.useEffect(() => {
    startCamera();
  }, []);

  // 📷 카메라 켜기
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("카메라 접근 실패:", error);
    }
  };

  // 📸 사진 촬영
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 300, 200);
        const imageData = canvasRef.current.toDataURL("image/png");

        // ✅ 이전 페이지가 PhotoCapturePage라면 거기로 다시 이동
        if (fromPhotoCapture) {
          navigate("/photo-capture", { state: { capturedImage: imageData } });
        } else {
          navigate("/ai-analysis", { state: { capturedImage: imageData } });
        }
      }
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">사진 촬영</h1>

      <div className="relative w-80 h-60">
        <video ref={videoRef} autoPlay className="w-full h-full" />
        <canvas ref={canvasRef} className="hidden w-full h-full" />
      </div>

      {/* 🎨 버튼 그룹 */}
      <div className="w-full flex justify-around py-4">
        <button
          onClick={capturePhoto}
          className="px-6 py-3 bg-green-600 text-white rounded-lg"
        >
          촬영하기
        </button>
        <button
          onClick={() => navigate("/photo-capture")}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default CameraPage;
