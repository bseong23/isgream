import React, { useState, useEffect, useCallback, useMemo } from "react";
import DrawingIntro from "../../components/htp/draw/DrawingIntro";
import Canvas from "../../components/htp/draw/Canvas";
import Canvas2 from "../../components/htp/draw/Canvas2";
import GenderSelectionModal from "../../components/htp/draw/GenderSelectionModal";
import { useChild } from "../../hooks/child/useChild";
import HTPResultPage from "../../pages/htp/HTPResultsPage"; // ✅ 결과 페이지 추가

type DrawingType = "house" | "tree" | "male" | "female";

const CanvasPage: React.FC = () => {
  const [step, setStep] = useState<"intro" | "drawing" | "gender" | "result">("intro");
  const [currentType, setCurrentType] = useState<DrawingType>("house");
  const [firstGender, setFirstGender] = useState<"male" | "female" | null>(null);
  const [index, setIndex] = useState(1);
  const [resultData, setResultData] = useState<Record<string, any> | null>(null); // ✅ resultData 타입 변경 (string → object)

  const { selectedChild } = useChild(useCallback(() => {}, []));
  const childId = useMemo(() => selectedChild?.childId || 0, [selectedChild]);

  const handleStartDrawing = useCallback(() => {
    if (currentType === "male" || currentType === "female") {
      if (!firstGender) {
        setStep("gender");
      } else {
        setStep("drawing");
      }
    } else {
      setStep("drawing");
    }
  }, [currentType, firstGender]);

  const handleSelectGender = useCallback((selectedGender: "male" | "female") => {
    setFirstGender(selectedGender);
    setCurrentType(selectedGender);
    setStep("drawing");
  }, []);

  const handleSaveComplete = useCallback((data: any) => {
    console.log("📌 handleSaveComplete 호출됨! 전달된 데이터:", data);

    if (!data || Object.keys(data).length === 0) {
      console.error("❌ handleSaveComplete에서 받은 데이터가 올바르지 않습니다!", data);
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

      setResultData(data); // ✅ 검사 결과 저장
      setStep("result"); // ✅ 검사 결과 페이지로 변경
    }
    
  }, [currentType, firstGender]);

  useEffect(() => {
    console.log("📌 CanvasPage 렌더링됨! 현재 단계:", step);
    console.log("📌 현재 resultData 값:", resultData);
  }, [step, resultData]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-100 overflow-hidden fixed top-0 left-0">
      {step === "intro" && <DrawingIntro type={currentType} onStart={handleStartDrawing} />}
      {step === "drawing" && (
        currentType === "house" ? (
          <Canvas
            type={currentType}
            index={index}
            childId={childId}
            onSaveComplete={handleSaveComplete} // ✅ 정상적으로 데이터 전달 확인
          />
        ) : (
          <Canvas2
            type={currentType}
            index={index}
            childId={childId}
            onSaveComplete={handleSaveComplete} // ✅ 정상적으로 데이터 전달 확인
          />
        )
      )}
      {step === "gender" && (
        <GenderSelectionModal
          onSelectGender={handleSelectGender}
          onClose={() => setStep("intro")}
        />
      )}

      {/* ✅ 검사 결과 표시 (페이지 이동 없이 렌더링) */}
      {step === "result" && resultData ? (
        <>
          {console.log("✅ HTPResultPage 렌더링 준비 완료!")}
          <HTPResultPage resultData={resultData} />
        </>
      ) : (
        step === "result" && <p className="text-center text-gray-500">검사 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default React.memo(CanvasPage);
