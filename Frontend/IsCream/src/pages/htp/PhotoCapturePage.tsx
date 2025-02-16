import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import houseImage from "../../assets/image/house.png";
import treeImage from "../../assets/image/tree.png";
import personImage from "../../assets/image/person.png";
import characterImage from "../../assets/image/character2.png";

const DRAWING_IMAGES: Record<string, string> = {
  house: houseImage,
  tree: treeImage,
  male: personImage,
  female: personImage,
};

const DRAWING_GUIDE: Record<"house" | "tree" | "person", string[]> = {
  house: [
    "✅ 휴대폰을 <span class='text-green-600 font-bold'>가로</span>로 두고 그림을 그려주세요!",
    "✅ 도구를 이용하지 않고 <span class='text-green-600 font-bold'>손가락</span>만 사용해 주세요!",
    "✅ <span class='text-green-600 font-bold'>검은색</span>만 사용할거에요!",
    "✅ 그림 실력을 검사하는 것이 아니에요!",
    "✅ 즐거운 마음으로 그림을 그려 주세요!"
  ],
  tree: [
    "✅ 휴대폰을 <span class='text-green-600 font-bold'>세로</span>로 두고 그림을 그려주세요!",
    "✅ 도구를 이용하지 않고 <span class='text-green-600 font-bold'>손가락</span>만 사용해 주세요!",
    "✅ <span class='text-green-600 font-bold'>검은색</span>만 사용할거에요!",
    "✅ 그림 실력을 검사하는 것이 아니에요!",
    "✅ 즐거운 마음으로 그림을 그려 주세요!"
  ],
  person: [
    "✅ <span class='text-green-600 font-bold'>사람</span>을 떠올리며 촬영해주세요!",
    "✅ 도구를 이용하지 않고 <span class='text-green-600 font-bold'>손가락</span>만 사용해 주세요!",
    "✅ <span class='text-green-600 font-bold'>검은색</span>만 사용할거에요!",
    "✅ 그림 실력을 검사하는 것이 아니에요!",
    "✅ 즐거운 마음으로 그림을 그려 주세요!"
  ]
};

const PhotoCapturePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<"house" | "tree" | "male" | "female">("house");
  const [capturedImage, setCapturedImage] = useState<string>(DRAWING_IMAGES["house"]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [childId] = useState<number>(123);

  useEffect(() => {
    if (location.state?.capturedImage) {
      setCapturedImage(location.state.capturedImage);
    }
  }, [location.state?.capturedImage]);

  const handleSave = async () => {
    if (capturedImage === DRAWING_IMAGES[currentStep]) {
      alert("촬영된 사진이 없습니다. 사진을 촬영해주세요!");
      return;
    }

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    const blob = await fetch(capturedImage).then(res => res.blob());
    const file = new File([blob], `drawing_${currentStep}.png`, { type: "image/png" });

    const formData = new FormData();
    formData.append("htp[chidiId]", String(childId));
    formData.append("htp[type]", currentStep === "male" || currentStep === "female" ? currentStep : currentStep);
    formData.append("htp[index]", String(getStepIndex(currentStep)));
    formData.append("htp[time]", elapsedTime);
    formData.append("file", file);

    console.log("📤 API 요청 데이터:", { chidiId: childId, type: currentStep, index: getStepIndex(currentStep), time: elapsedTime });
    console.log("file:", file);

    try {
      const response = await fetch("/htp-tests/img", { method: "POST", body: formData });

      if (response.ok) {
        console.log("✅ API 요청 성공");
        moveToNextStep();
      } else {
        console.error("❌ API 요청 실패");
        alert("저장 실패! 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("❌ 업로드 오류:", error);
      alert("네트워크 오류 발생! 다시 시도해주세요.");
    }
  };

  const moveToNextStep = () => {
    if (currentStep === "house") {
      setCurrentStep("tree");
      setCapturedImage(DRAWING_IMAGES["tree"]);
      setStartTime(Date.now());
    } else if (currentStep === "tree") {
      setCurrentStep("male");
      setCapturedImage(DRAWING_IMAGES["male"]);
      setStartTime(Date.now());
    } else if (currentStep === "male") {
      setCurrentStep("female");
      setCapturedImage(DRAWING_IMAGES["female"]);
      setStartTime(Date.now());
    } else {
      navigate("/htp-results");
    }
  };

  const getStepIndex = (step: "house" | "tree" | "male" | "female") => {
    return step === "house" ? 1 : step === "tree" ? 2 : step === "male" ? 3 : 4;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-h-screen bg-white px-4 pt-20  overflow-hidden">
  {/* 🏷 제목 */}
  <h1 className="text-3xl font-bold text-green-700 mt-4 mb-4 text-center">
    {currentStep === "house" ? "집 (HOUSE)" : currentStep === "tree" ? "나무 (TREE)" : "사람 (PERSON)"}
  </h1>

  {/* 💡 내용 박스 */}
  <div className="w-full max-w-lg bg-[#EAF8E6] p-4 rounded-[15px] shadow-md flex flex-col items-center border border-green-300">
    {/* ✨ 그림 이미지 */}
    <img src={capturedImage} alt="Captured" className="h-[220px] object-contain mb-4" />

    {/* 🔹 가이드 텍스트 */}
    <div className="text-lg text-gray-700 text-left mb-4 w-full">
      {DRAWING_GUIDE[currentStep === "male" || currentStep === "female" ? "person" : currentStep].map((guide, index) => (
        <p key={index} className="mb-1" dangerouslySetInnerHTML={{ __html: guide }}></p>
      ))}
    </div>
  </div>

  {/* 🎨 버튼 (촬영하기 & 저장하기) */}
  <div className="relative mt-4 flex justify-center gap-3 w-full max-w-lg">
    <button onClick={() => navigate("/camera", { state: { fromPhotoCapture: true } })} className="bg-green-600 text-white px-5 py-3 rounded-lg text-lg shadow-md hover:bg-green-700 w-1/2">
      촬영하기
    </button>
    <button onClick={handleSave} className="bg-green-600 text-white px-5 py-3 rounded-lg text-lg shadow-md hover:bg-green-700 w-1/2">
      저장하기
    </button>
  </div>

  {/* 🐻 캐릭터 (고정 위치) */}
  <img
    src={characterImage}
    alt="캐릭터"
    className="absolute bottom-60 right-5 w-24 h-auto"
  />
</div>
  );
};

export default PhotoCapturePage;