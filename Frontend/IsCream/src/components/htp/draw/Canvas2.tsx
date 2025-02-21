import React, { useRef, useState, useEffect } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import characterImage from "../../../assets/image/character2.png";
import { useUploadDrawing } from "../../../hooks/htp/useUploadDrawing";
import { DrawingType, UploadDrawingResponse } from "../../../types/htp";
import { createUploadFormData } from "../../../utils/common/formDataHelper";
import { useNavigate } from "react-router-dom";

const AUDIO_URLS = [
  "https://a407-20250124.s3.ap-northeast-2.amazonaws.com/audio/htp_2.mp3",
  "https://a407-20250124.s3.ap-northeast-2.amazonaws.com/audio/htp_2-1.mp3",
  "https://a407-20250124.s3.ap-northeast-2.amazonaws.com/audio/htp_3.mp3",
  "https://a407-20250124.s3.ap-northeast-2.amazonaws.com/audio/htp_3-1.mp3",
  "https://a407-20250124.s3.ap-northeast-2.amazonaws.com/audio/htp_4.mp3",
  "https://a407-20250124.s3.ap-northeast-2.amazonaws.com/audio/htp_4-1.mp3"
];

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
  const navigate = useNavigate();
  const canvasRef = useRef<ReactSketchCanvasRef | null>(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [startTime, setStartTime] = useState<number | null>(null);
  const { mutate: uploadDrawing } = useUploadDrawing();
  const [isSaving, setIsSaving] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  console.log(isAudioPlaying);

  const playAudio = (isEntryAudio: boolean): void => {
    const audioIndex = (index - 2) * 2 + (isEntryAudio ? 0 : 1);
    setIsAudioPlaying(true);

    console.log(`index: ${index}, audioIndex: ${audioIndex}`);
    console.log(`선택된 오디오 URL: ${AUDIO_URLS[audioIndex]}`);

    audioRef.current.src = AUDIO_URLS[audioIndex];

    const onEnded = () => {
      audioRef.current.removeEventListener("ended", onEnded);
      audioRef.current.removeEventListener("error", onError);
      setIsAudioPlaying(false);
    };

    const onError = (error: any) => {
      console.error("오디오 재생 실패:", error);
      audioRef.current.removeEventListener("ended", onEnded);
      audioRef.current.removeEventListener("error", onError);
      setIsAudioPlaying(false);
    };

    audioRef.current.addEventListener("ended", onEnded);
    audioRef.current.addEventListener("error", onError);

    audioRef.current.play().catch(onError);
  };

  useEffect(() => {
    setStartTime(Date.now());
    playAudio(true);

    return () => {
      audioRef.current.pause();
      audioRef.current.src = "";
    };
  }, []);

  const handleGoBack = () => {
    if (isNavigating || isSaving) return;
    setIsNavigating(true);
    navigate("/ai-analysis");
  };

  const handleClear = () => {
    if (isSaving) return;
    canvasRef.current?.clearCanvas();
  };

  const handleSave = async () => {
    if (!canvasRef.current || !startTime || isSaving) return;

    setIsSaving(true);

    try {
      // 마지막 단계(index가 4)일 때 오디오 재생 - 저장 요청과 병렬로 실행
      if (index === 4) {
        playAudio(false);
      }

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
            console.error(
              "❌ API 응답 데이터가 올바르지 않습니다!",
              apiResponse
            );
            alert("분석 결과를 불러올 수 없습니다.");
            setIsSaving(false);
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
          setIsSaving(false);
        }
      });
    } catch (error) {
      console.error("❌ 저장 처리 중 오류 발생:", error);
      alert("저장 처리 중 오류가 발생했습니다.");
      setIsSaving(false);
    }
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
          disabled={isNavigating || isSaving}
          className={`w-[30%] h-[50px] ${
            isNavigating || isSaving ? "bg-gray-400" : "bg-blue-400"
          } text-white font-semibold rounded-lg text-lg shadow-md`}
        >
          그만하기
        </button>
        <button
          onClick={handleClear}
          disabled={isSaving}
          className={`w-[30%] h-[50px] ${
            isSaving ? "bg-gray-400" : "bg-green-600"
          } text-white font-semibold rounded-lg text-lg shadow-md`}
        >
          다시 그리기
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-[30%] h-[50px] ${
            isSaving ? "bg-gray-400" : "bg-green-600"
          } text-white font-semibold rounded-lg text-lg shadow-md`}
        >
          {isSaving ? "저장 중..." : "검사 완료"}
        </button>
      </div>

      <img
        src={characterImage}
        alt="캐릭터"
        className="absolute right-4 bottom-15 max-w-[50px] h-auto"
      />
    </div>
  );
};

export default Canvas2;
