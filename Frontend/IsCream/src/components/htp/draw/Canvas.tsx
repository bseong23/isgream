import React, { useRef, useState, useEffect } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import characterImage from "../../../assets/image/character2.png";
import { useUploadDrawing } from "../../../hooks/htp/useUploadDrawing";
import { DrawingType, UploadDrawingResponse } from "../../../types/htp";
import { createUploadFormData } from "../../../utils/common/formDataHelper";
import { useNavigate } from "react-router-dom";

// 오디오 URL 상수 (순서 중요)
const AUDIO_URLS = [
  "https://a407-20250124.s3.ap-northeast-2.amazonaws.com/audio/htp_1.mp3",
  "https://a407-20250124.s3.ap-northeast-2.amazonaws.com/audio/htp_1-1.mp3"
];

interface CanvasProps {
  type: DrawingType;
  gender?: "male" | "female";
  index: number;
  childId: number;
  onSaveComplete: (data: UploadDrawingResponse) => void;
  onSaveStart: () => void;
}

const Canvas: React.FC<CanvasProps> = ({
  type,
  gender,
  index,
  childId,
  onSaveComplete,
  onSaveStart
}) => {
  const navigate = useNavigate();
  const canvasRef = useRef<ReactSketchCanvasRef | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const { mutate: uploadDrawing } = useUploadDrawing();

  // 오디오 재생 함수 (첫 번째 또는 두 번째 오디오)
  const playAudio = (isEntryAudio: boolean): Promise<void> => {
    return new Promise((resolve) => {
      const audioIndex = isEntryAudio ? 0 : 1;
      if (audioRef.current) {
        audioRef.current.src = AUDIO_URLS[audioIndex];

        // 오디오 재생 완료 이벤트 리스너 추가
        const onEnded = () => {
          audioRef.current?.removeEventListener("ended", onEnded);
          resolve();
        };

        audioRef.current.addEventListener("ended", onEnded);

        audioRef.current.play().catch((error) => {
          console.error("오디오 재생 실패:", error);
          resolve(); // 재생 실패해도 진행
        });
      } else {
        resolve(); // audioRef가 없으면 즉시 resolve
      }
    });
  };

  useEffect(() => {
    setStartTime(Date.now());

    // 오디오 요소 생성
    audioRef.current = new Audio();

    // 페이지 진입 시 첫 번째 오디오(htp_1.mp3) 재생
    playAudio(true);
  }, []);

  const handleGoBack = () => {
    navigate("/ai-analysis");
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleSave = async () => {
    if (!canvasRef.current || !startTime) return;

    // 검사 완료 시 두 번째 오디오(htp_1_1.mp3) 재생하고 완료 대기
    await playAudio(false);

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

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-[#EAF8E6] overflow-hidden">
        <div
          className={`flex w-full h-full px-2 ${
            type === "house" ? "flex-row" : "flex-col"
          } justify-between items-center relative`}
        >
          {/* 그림판 */}
          <div className="border-[1.5px] border-gray-400 border-opacity-50 rounded-[15px] overflow-hidden w-[90%] h-[95%] my-auto">
            <ReactSketchCanvas
              ref={canvasRef}
              style={{ width: "100%", height: "100%" }}
              strokeWidth={4}
              strokeColor="black"
            />
          </div>

          {/* 버튼 + 캐릭터 컨테이너 */}
          <div className="flex flex-col items-center justify-between h-[90%] w-[12%] ml-2 my-auto">
            <div className="flex flex-col justify-between gap-2 w-full">
              <button
                onClick={handleSave}
                className="w-full h-[50px] bg-green-600 text-white font-semibold cursor-pointer rounded-lg text-md shadow-md"
              >
                검사 완료
              </button>
              <button
                onClick={handleClear}
                className="w-full h-[50px] bg-green-600 text-white font-semibold cursor-pointer rounded-lg text-md shadow-md"
              >
                다시 그리기
              </button>
              <button
                onClick={handleGoBack}
                className="w-full h-[50px] bg-blue-400 text-white font-semibold cursor-pointer rounded-lg text-md shadow-md"
              >
                그만하기
              </button>
            </div>

            {/* 캐릭터 */}
            <div className="flex justify-center w-full">
              <img
                src={characterImage}
                alt="캐릭터"
                className="w-full max-w-[80px] h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Canvas;
