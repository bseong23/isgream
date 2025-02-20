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
        src={LoadingGIF}
        alt="로딩 중"
        className="w-32 h-32 object-contain"
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
  const [isLoading, setIsLoading] = useState(false);
  const [showOppositeGenderModal, setShowOppositeGenderModal] = useState(false);

  const { selectedChild } = useChild(useCallback(() => {}, []));
  const childId = useMemo(() => selectedChild?.childId || 0, [selectedChild]);

  const handleStartCamera = useCallback(() => {
    if (currentType === "male" || currentType === "female") {
      if (!firstGender) {
        setStep("gender");
      } else {
        if (index === 4) {
          setShowOppositeGenderModal(true);
        } else {
          setStep("camera");
        }
      }
    } else {
      setStep("camera");
    }
  }, [currentType, firstGender, index]);

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
      setIsLoading(false);

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

  const handleSaveStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleOppositeGenderContinue = () => {
    setShowOppositeGenderModal(false);
    setStep("camera");
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-white overflow-hidden fixed top-0 left-0">
      {/* 반대 성별 모달 */}
      {showOppositeGenderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">추가 분석</h2>
            <p>
              {firstGender === "male"
                ? "여성 사진을 찍어보세요"
                : "남성 사진을 찍어보세요"}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleOppositeGenderContinue}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

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

      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default React.memo(CameraPage);
