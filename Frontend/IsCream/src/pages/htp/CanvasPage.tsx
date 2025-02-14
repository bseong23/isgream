import React, { useState, useEffect, useCallback, useMemo } from "react";
import DrawingIntro from "../../components/htp/draw/DrawingIntro";
import Canvas from "../../components/htp/draw/Canvas";
import Canvas2 from "../../components/htp/draw/Canvas2";
import GenderSelectionModal from "../../components/htp/draw/GenderSelectionModal";
import { useChild } from "../../hooks/child/useChild";
import { useNavigate } from "react-router-dom";

type DrawingType = "house" | "tree" | "male" | "female";

const CanvasPage: React.FC = () => {
  const [step, setStep] = useState<"intro" | "drawing" | "gender">("intro");
  const [currentType, setCurrentType] = useState<DrawingType>("house");
  const [firstGender, setFirstGender] = useState<"male" | "female" | null>(null);
  const [index, setIndex] = useState(1);
  const navigate = useNavigate();

  const { selectedChild } = useChild(useCallback(() => {}, []));
  const childId = useMemo(() => selectedChild?.childId || 0, [selectedChild]);

  useEffect(() => {
    console.log("🔥 현재 단계:", step, "| 현재 그림:", currentType, "| 현재 index:", index, "| 첫 성별:", firstGender);
  }, [step, currentType, index, firstGender]);

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

  const handleSaveComplete = useCallback(() => {
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
      console.log("✅ 모든 그림 완료!");
      navigate("/htp-results");
    }
  }, [currentType, firstGender, navigate]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-100 overflow-hidden fixed top-0 left-0">
      {step === "intro" && <DrawingIntro type={currentType} onStart={handleStartDrawing} />}
      {step === "drawing" && (
        currentType === "house" ? (
          <Canvas
            type={currentType}
            index={index}
            childId={childId}
            onSaveComplete={handleSaveComplete}
          />
        ) : (
          <Canvas2
            type={currentType}
            index={index}
            childId={childId}
            onSaveComplete={handleSaveComplete}
          />
        )
      )}
      {step === "gender" && (
        <GenderSelectionModal
          onSelectGender={handleSelectGender}
          onClose={() => setStep("intro")}
        />
      )}
    </div>
  );
};

export default React.memo(CanvasPage);
