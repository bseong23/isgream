import React from "react";
import houseImage from "../../../assets/image/house.png";
import treeImage from "../../../assets/image/tree.png";
import personImage from "../../../assets/image/person.png";
// import characterImage from "../../../assets/image/character2.png";

interface DrawingIntroProps {
  type: "house" | "tree" | "male" | "female";
  onStart: () => void;
}

const DRAWING_GUIDE: Record<"house" | "tree" | "person", string[]> = {
  house: [
    "✅ 휴대폰을 <span class='text-green-600 font-bold text-4xl'>가로</span>로 두고 그림을 그려주세요!",
    "✅ <span class='text-green-600 font-bold'>검은색</span>만 사용할거에요!",
    "✅ 그림 실력을 검사하는 것이 아니에요!",
    "✅ 즐거운 마음으로 그림을 그려 주세요!"
  ],
  tree: [
    "✅ 휴대폰을 <span class='text-green-600 font-bold'>세로</span>로 두고 그림을 그려주세요!",
    "✅ <span class='text-green-600 font-bold'>검은색</span>만 사용할거에요!",
    "✅ 그림 실력을 검사하는 것이 아니에요!",
    "✅ 즐거운 마음으로 그림을 그려 주세요!"
  ],
  person: [
    "✅ <span class='text-green-600 font-bold'>사람</span>을 떠올리며 그려주세요!",
    "✅ <span class='text-green-600 font-bold'>검은색</span>만 사용할거에요!",
    "✅ 그림 실력을 검사하는 것이 아니에요!",
    "✅ 즐거운 마음으로 그림을 그려 주세요!"
  ]
};

const DRAWING_IMAGES: Record<"house" | "tree" | "person", string> = {
  house: houseImage,
  tree: treeImage,
  person: personImage
};

const DrawingIntro: React.FC<DrawingIntroProps> = ({ type, onStart }) => {
  const displayType = type === "male" || type === "female" ? "person" : type;

  return (
    <div className="flex flex-col items-center justify-center w-full bg-white px-4 py-1">
      {/* 제목 */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-700 mb-1 md:mb-12">
        {type === "house"
          ? "집 (HOUSE)"
          : type === "tree"
            ? "나무 (TREE)"
            : "사람 (PERSON)"}
      </h1>

      {/* 내용 박스 */}
      <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl bg-[#EAF8E6] p-6 md:p-8 lg:p-10 rounded-[20px] shadow-lg flex flex-col items-center border-2 border-green-300">
        {/* 그림 이미지 */}
        <div className="w-full flex justify-center mb-6 md:mb-8">
          <img
            src={DRAWING_IMAGES[displayType]}
            alt={type}
            className="h-[250px] md:h-[300px] lg:h-[350px] object-contain 
                       transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* 가이드 텍스트 */}
        <div className="text-lg md:text-xl lg:text-2xl text-gray-700 text-left w-full space-y-4">
          {DRAWING_GUIDE[displayType].map((guide, index) => (
            <p
              key={index}
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: guide }}
            />
          ))}
        </div>
      </div>

      {/* 그림 시작 버튼 영역 */}
      <div className="relative mt-8 md:mt-10 flex justify-center w-full max-w-xl md:max-w-2xl lg:max-w-3xl">
        <button
          onClick={onStart}
          className="bg-green-600 text-white px-8 py-4 rounded-xl text-xl md:text-2xl font-bold
                     shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
        >
          그림 시작하기
        </button>
        {/* <img
          src={characterImage}
          alt="캐릭터"
          className="absolute right-0 bottom-0 w-28 md:w-32 lg:w-36 h-auto
                     transform translate-x-1/2 hover:scale-110 transition-transform duration-200"
        /> */}
      </div>
    </div>
  );
};

export default DrawingIntro;
