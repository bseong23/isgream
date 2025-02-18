import React from "react";

const DRAWING_GUIDE: Record<"house" | "tree" | "person", string[]> = {
  house: [
    "✅ 종이를 <span class='text-green-600 font-bold'>가로</span>로 두고 그림을 그려주세요!",
    "✅ 사진은 <span class='text-green-600 font-bold'>가로</span>로 찍어주세요!",
    "✅ <span class='text-green-600 font-bold'>검은색</span>펜만 사용할 거예요!",
    "✅ 그림 실력을 검사하는 것이 아니에요!",
    "✅ 즐거운 마음으로 그림을 그려 주세요!"
  ],
  tree: [
    "✅ 휴대폰을 <span class='text-green-600 font-bold'>세로</span>로 두고 그림을 그려주세요!",
    "✅ 도구를 이용하지 않고 <span class='text-green-600 font-bold'>손가락</span>만 사용해 주세요!",
    "✅ <span class='text-green-600 font-bold'>검은색</span>만 사용할 거예요!",
    "✅ 그림 실력을 검사하는 것이 아니에요!",
    "✅ 즐거운 마음으로 그림을 그려 주세요!"
  ],
  person: [
    "✅ <span class='text-green-600 font-bold'>사람</span>을 떠올리며 촬영해주세요!",
    "✅ 도구를 이용하지 않고 <span class='text-green-600 font-bold'>손가락</span>만 사용해 주세요!",
    "✅ <span class='text-green-600 font-bold'>검은색</span>만 사용할 거예요!",
    "✅ 그림 실력을 검사하는 것이 아니에요!",
    "✅ 즐거운 마음으로 그림을 그려 주세요!"
  ]
};

interface DrawingGuideProps {
  step: "house" | "tree" | "male" | "female";
}

const DrawingGuide: React.FC<DrawingGuideProps> = ({ step }) => {
  const guide = step === "male" || step === "female" ? DRAWING_GUIDE["person"] : DRAWING_GUIDE[step];

  return (
    <div className="text-lg text-gray-700 text-left w-full">
      {guide.map((line, index) => (
        <p key={index} className="mb-1" dangerouslySetInnerHTML={{ __html: line }}></p>
      ))}
    </div>
  );
};

export default DrawingGuide;
