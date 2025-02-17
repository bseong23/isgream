import React, { useState, useEffect, useCallback, useMemo } from "react";
import CameraIntro from "../../components/htp/camera/CameraIntro";
import Camera from "../../components/htp/camera/Camera";
import Camera2 from "../../components/htp/camera/Camera2";
import GenderSelectionModal from "../../components/htp/draw/GenderSelectionModal";
import { useChild } from "../../hooks/child/useChild";
import { useNavigate } from "react-router-dom";

type PhotoType = "house" | "tree" | "male" | "female";

const CameraPage: React.FC = () => {
  const [step, setStep] = useState<"intro" | "camera" | "gender">("intro");
  const [currentType, setCurrentType] = useState<PhotoType>("house");
  const [firstGender, setFirstGender] = useState<"male" | "female" | null>(null);
  const [index, setIndex] = useState(1);
  const [htpTestId, setHtpTestId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { selectedChild } = useChild(useCallback(() => {}, []));
  const childId = useMemo(() => selectedChild?.childId || 0, [selectedChild]);

  useEffect(() => {
    console.log("📸 현재 단계:", step, "| 현재 촬영 대상:", currentType, "| 현재 index:", index, "| 첫 성별:", firstGender);
  }, [step, currentType, index, firstGender]);

  // ✅ 페이지 로드 시 localStorage에서 htpTestId 복구
  useEffect(() => {
    const storedHtpTestId = localStorage.getItem("htpTestId");
    if (storedHtpTestId) {
      setHtpTestId(storedHtpTestId);
    } else {
      // API에서 새로운 htpTestId 요청
      const fetchTestId = async () => {
        try {
          const response = await fetch("/api/htp-tests/start", { method: "POST" });
          const result = await response.json();
          setHtpTestId(result.htpTestId);
          localStorage.setItem("htpTestId", result.htpTestId); // ✅ 저장
        } catch (error) {
          console.error("Error fetching HTP Test ID:", error);
        }
      };
      fetchTestId();
    }
  }, []);

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
      console.log("✅ 모든 촬영 완료!");
      if (htpTestId) {
        navigate(`/htp-results/${htpTestId}`);
      } else {
        console.error("❌ htpTestId가 없음! localStorage에서 복구 시도");
        const storedHtpTestId = localStorage.getItem("htpTestId");
        if (storedHtpTestId) {
          navigate(`/htp-results/${storedHtpTestId}`);
        } else {
          console.error("🚨 htpTestId를 찾을 수 없음!");
        }
      }
    }
  }, [currentType, firstGender, navigate, htpTestId]);

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
    </div>
  );
};

export default React.memo(CameraPage);