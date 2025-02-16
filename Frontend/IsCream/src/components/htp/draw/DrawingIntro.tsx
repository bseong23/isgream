import React from "react";
import houseImage from "../../../assets/image/house.png";
import treeImage from "../../../assets/image/tree.png";
import personImage from "../../../assets/image/person.png";
import characterImage from "../../../assets/image/character2.png";

interface DrawingIntroProps {
  type: "house" | "tree" | "male" | "female";
  onStart: () => void;
}

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
    "✅ <span class='text-green-600 font-bold'>사람</span>을 떠올리며 그려주세요!",
    "✅ 도구를 이용하지 않고 <span class='text-green-600 font-bold'>손가락</span>만 사용해 주세요!",
    "✅ <span class='text-green-600 font-bold'>검은색</span>만 사용할거에요!",
    "✅ 그림 실력을 검사하는 것이 아니에요!",
    "✅ 즐거운 마음으로 그림을 그려 주세요!"
  ]
};

const DRAWING_IMAGES: Record<"house" | "tree" | "person", string> = {
  house: houseImage,
  tree: treeImage,
  person: personImage,
};

const DrawingIntro: React.FC<DrawingIntroProps> = ({ type, onStart }) => {
  // 🏷 `male`과 `female`은 `person`과 동일하게 처리
  const displayType = type === "male" || type === "female" ? "person" : type;

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-white px-4">
      {/* 🏷 제목 (고정 없이 자연스럽게 배치) */}
      <h1 className="text-3xl font-bold text-green-700 mt-6 mb-4">
        {type === "house"
          ? "집 (HOUSE)"
          : type === "tree"
          ? "나무 (TREE)"
          : "사람 (PERSON)"} {/* 🔥 남성/여성 상관없이 '사람 (PERSON)'으로 고정 */}
      </h1>

      {/* 💡 내용 박스 */}
      <div className="w-full max-w-lg bg-[#EAF8E6] p-6 rounded-[15px] shadow-md flex flex-col items-center border border-green-300">
        {/* ✨ 그림 이미지 (크기를 더 키움) */}
        <img src={DRAWING_IMAGES[displayType]} alt={type} className="h-[250px] object-contain mb-4" />

        {/* 🔹 가이드 텍스트 */}
        <div className="text-lg text-gray-700 text-left mb-6 w-full">
          {DRAWING_GUIDE[displayType].map((guide, index) => (
            <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: guide }}></p>
          ))}
        </div>
      </div>

      {/* 🎨 그림 시작 버튼 */}
      <div className="relative mt-6 flex justify-center w-full max-w-lg">
        <button
          onClick={onStart}
          className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-green-700"
        >
          그림 시작하기
        </button>
        <img
          src={characterImage}
          alt="캐릭터"
          className="absolute right-[-10px] bottom-0 w-28 h-auto"
        />
      </div>
    </div>
  );
};

export default DrawingIntro;
