import React, { useState, useCallback, useMemo } from "react";
import CameraIntro from "../../components/htp/camera/CameraIntro";
import Camera from "../../components/htp/camera/Camera";
import Camera2 from "../../components/htp/camera/Camera2";
import GenderSelectionModal from "../../components/htp/draw/GenderSelectionModal";
import HTPResultPage from "../../pages/htp/HTPResultsPage";
import { useChild } from "../../hooks/child/useChild";
import LoadingGIF from "../../assets/loading.gif";

// 로딩 스피너 컴포넌트
const LoadingSpinner = () => (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
    <div className="bg-white backdrop-blur-md p-8 rounded-2xl flex flex-col items-center">
      <img
        src={LoadingGIF} // gif 파일 경로를 여기에 넣으세요
        alt="로딩 중"
        className="w-32 h-32 object-contain" // gif 크기 조절
      />
      <p className="text-lg font-semibold text-gray-700 mt-4">
        AI가 분석 중 입니다.
      </p>
      <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요!</p>
    </div>
  </div>
);

type PhotoType = "house" | "tree" | "male" | "female";

const CameraPage: React.FC = () => {
  const [step, setStep] = useState<"intro" | "camera" | "gender" | "result">(
    "intro"
  );
  const [currentType, setCurrentType] = useState<PhotoType>("house");
  const [firstGender, setFirstGender] = useState<"male" | "female" | null>(
    null
  );
  const [index, setIndex] = useState(1);
  const [resultData, setResultData] = useState<Record<
    string,
    undefined
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

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

  const handleSelectGender = useCallback(
    (selectedGender: "male" | "female") => {
      setFirstGender(selectedGender);
      setCurrentType(selectedGender);
      setStep("camera");
    },
    []
  );

  const handleSaveComplete = useCallback(
    (data) => {
      setIsLoading(false); // 로딩 상태 해제

      if (!data || Object.keys(data).length === 0) {
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
        setResultData(data);
        setStep("result");
      }
    },
    [currentType, firstGender]
  );

  // 저장 시작 시 로딩 상태를 설정하는 핸들러
  const handleSaveStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-100 overflow-hidden fixed top-0 left-0">
      {step === "intro" && (
        <CameraIntro type={currentType} onStart={handleStartCamera} />
      )}
      {step === "camera" &&
        (currentType === "house" ? (
          <Camera
            type={currentType}
            index={index}
            childId={childId}
            onSaveComplete={handleSaveComplete}
            onSaveStart={handleSaveStart}
          />
        ) : (
          <Camera2
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

      {/* 로딩 스피너 */}
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default React.memo(CameraPage);
