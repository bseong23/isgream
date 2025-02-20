import React, { useState, useCallback, useMemo } from "react";
import DrawingIntro from "../../components/htp/draw/DrawingIntro";
import Canvas from "../../components/htp/draw/Canvas";
import Canvas2 from "../../components/htp/draw/Canvas2";
import GenderSelectionModal from "../../components/htp/draw/GenderSelectionModal";
import { useChild } from "../../hooks/child/useChild";
import HTPResultPage from "../../pages/htp/HTPResultsPage";
import { UploadDrawingResponse } from "../../types/htp";
import LoadingGIF from "../../assets/loading.gif";

type DrawingType = "house" | "tree" | "male" | "female";

const CanvasPage: React.FC = () => {
  const [step, setStep] = useState<"intro" | "drawing" | "gender" | "result">(
    "intro"
  );
  const [currentType, setCurrentType] = useState<DrawingType>("house");
  const [firstGender, setFirstGender] = useState<"male" | "female" | null>(
    null
  );
  const [index, setIndex] = useState(1);
  const [resultData, setResultData] = useState<UploadDrawingResponse | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showOppositeGenderModal, setShowOppositeGenderModal] = useState(false);

  const { selectedChild } = useChild(useCallback(() => {}, []));
  const childId = useMemo(() => selectedChild?.childId || 0, [selectedChild]);

  const handleStartDrawing = useCallback(() => {
    if (currentType === "male" || currentType === "female") {
      if (!firstGender) {
        setStep("gender");
      } else {
        if (index === 4) {
          setShowOppositeGenderModal(true);
        } else {
          setStep("drawing");
        }
      }
    } else {
      setStep("drawing");
    }
  }, [currentType, firstGender, index]);

  const handleSelectGender = useCallback(
    (selectedGender: "male" | "female") => {
      setFirstGender(selectedGender);
      setCurrentType(selectedGender);
      setStep("drawing");
    },
    []
  );

  const handleSaveComplete = useCallback(
    (data: UploadDrawingResponse) => {
      console.log("📌 handleSaveComplete 호출됨! 전달된 데이터:", data);
      setIsAnalyzing(false);

      if (!data?.data || Object.keys(data.data).length === 0) {
        console.error(
          "❌ handleSaveComplete에서 받은 데이터가 올바르지 않습니다!",
          data
        );
        return;
      }

      if (currentType === "house") {
        setCurrentType("tree");
        setIndex(2);
        setStep("intro");
      } else if (currentType === "tree") {
        setCurrentType("male");
        setIndex(3);
        setStep("intro");
      } else if (currentType === firstGender) {
        setCurrentType(firstGender === "male" ? "female" : "male");
        setIndex(4);
        setStep("intro");
      } else {
        console.log("✅ 모든 그림 완료! 결과 표시 중...");
        setResultData({
          data: {
            houseDrawingUrl: data.data?.houseDrawingUrl ?? "",
            treeDrawingUrl: data.data?.treeDrawingUrl ?? "",
            maleDrawingUrl: data.data?.maleDrawingUrl ?? "",
            femaleDrawingUrl: data.data?.femaleDrawingUrl ?? "",
            result: data.data?.result ?? ""
          }
        });
        setStep("result");
      }
    },
    [currentType, firstGender]
  );

  const handleSaveStart = useCallback(() => {
    setIsAnalyzing(true);
  }, []);

  const handleOppositeGenderContinue = () => {
    setShowOppositeGenderModal(false);
    setStep("drawing");
  };

  return (
    <div className="relative w-full flex flex-col items-center bg-white pb-20">
      {/* 반대 성별 모달 */}
      {showOppositeGenderModal && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white border-[#333333] px-10 py-7 rounded-[15px]">
            <h2 className="text-xl font-bold mb-4">추가 분석</h2>
            <p>
              {firstGender === "male"
                ? "여성 그림을 그려보세요"
                : "남성 그림을 그려보세요"}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-green-700 text-white rounded-[15px]"
                onClick={handleOppositeGenderContinue}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "intro" && (
        <DrawingIntro type={currentType} onStart={handleStartDrawing} />
      )}
      {step === "drawing" &&
        (currentType === "house" ? (
          <Canvas
            type={currentType}
            index={index}
            childId={childId}
            onSaveComplete={handleSaveComplete}
            onSaveStart={handleSaveStart}
          />
        ) : (
          <Canvas2
            type={currentType}
            index={index}
            childId={childId}
            onSaveComplete={handleSaveComplete}
            onSaveStart={handleSaveStart}
          />
        ))}
      {step === "gender" && (
        <GenderSelectionModal
          onSelectGender={handleSelectGender}
          onClose={() => setStep("intro")}
        />
      )}
      {step === "result" && resultData && (
        <HTPResultPage resultData={resultData} />
      )}

      {/* AI 분석 중 로딩 스피너 */}
      {isAnalyzing && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white backdrop-blur-md p-8 rounded-2xl flex flex-col items-center">
            <img
              src={LoadingGIF}
              alt="로딩 중"
              className="w-32 h-32 object-contain"
            />
            <p className="text-lg font-semibold text-gray-700 mt-4">
              AI가 그림을 분석하고 있어요
            </p>
            <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CanvasPage);
