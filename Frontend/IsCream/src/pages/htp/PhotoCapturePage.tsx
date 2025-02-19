import React, { useState, useCallback, useMemo } from "react";
import CameraIntro from "../../components/htp/camera/CameraIntro";
import Camera from "../../components/htp/camera/Camera";
import Camera2 from "../../components/htp/camera/Camera2";
import GenderSelectionModal from "../../components/htp/draw/GenderSelectionModal";
import HTPResultPage from "../../pages/htp/HTPResultsPage"; // ✅ 결과 페이지 추가
import { useChild } from "../../hooks/child/useChild";

type PhotoType = "house" | "tree" | "male" | "female";

const CameraPage: React.FC = () => {
  const [step, setStep] = useState<"intro" | "camera" | "gender" | "result">("intro");
  const [currentType, setCurrentType] = useState<PhotoType>("house");
  const [firstGender, setFirstGender] = useState<"male" | "female" | null>(null);
  const [index, setIndex] = useState(1);
  const [resultData, setResultData] = useState<string | null>(null); // ✅ 검사 결과 상태 추가

  const { selectedChild } = useChild(useCallback(() => {}, []));
  const childId = useMemo(() => selectedChild?.childId || 0, [selectedChild]);

  const handleStartCamera = useCallback(() => {
    if (currentType === "male" || currentType === "female") {
      if (!firstGender) {
        setStep("gender");
      } else {
        setStep("camera");
      }
    } else {
      setStep("camera");
    }
  }, [currentType, firstGender]);

  const handleSelectGender = useCallback((selectedGender: "male" | "female") => {
    setFirstGender(selectedGender);
    setCurrentType(selectedGender);
    setStep("camera");
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

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-100 overflow-hidden fixed top-0 left-0">
      {step === "intro" && <CameraIntro type={currentType} onStart={handleStartCamera} />}
      {step === "camera" && (
        currentType === "house" ? (
          <Camera
            type={currentType}
            index={index}
            childId={childId}
            onSaveComplete={handleSaveComplete}
          />
        ) : (
          <Camera2
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

      {/* ✅ 검사 결과 표시 (페이지 이동 없이 렌더링) */}
      {step === "result" && resultData && <HTPResultPage resultData={resultData} />}
    </div>
  );
};

export default React.memo(CameraPage);
