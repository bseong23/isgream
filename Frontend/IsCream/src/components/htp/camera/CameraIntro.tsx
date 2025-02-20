import React from "react";
import { useNavigate } from "react-router-dom";
import houseImage from "../../../assets/image/house.png";
import treeImage from "../../../assets/image/tree.png";
import personImage from "../../../assets/image/person.png";

interface CameraIntroProps {
  type: "house" | "tree" | "male" | "female";
  onStart: () => void;
}

const CAMERA_GUIDE: Record<"house" | "tree" | "person", string[]> = {
  house: [
    "✅ 그림을 <span class='text-green-600 font-bold'>가로</span>로 그려주세요!",
    "✅ <span class='text-green-600 font-bold'>검은색</span>펜만 사용할거에요!",
    "✅ 그림을 그릴때는 시간을 재주세요!",
    "✅ 그림 실력을 검사하는 것이 아니에요!",
    "✅ 즐거운 마음으로 그림을 그려 주세요!"
  ],
  tree: [
    "✅ 그림을 <span class='text-green-600 font-bold'>세로</span>로 그려주세요!",
    "✅ <span class='text-green-600 font-bold'>검은색</span>펜만 사용할거에요!",
    "✅ 그림을 그릴때는 시간을 재주세요!",
    "✅ 그림 실력을 검사하는 것이 아니에요!",
    "✅ 즐거운 마음으로 그림을 그려 주세요!"
  ],
  person: [
    "✅ 그림을 <span class='text-green-600 font-bold'>세로</span>로 그려주세요!",
    "✅ <span class='text-green-600 font-bold'>검은색</span>펜만 사용할거에요!",
    "✅ 그림을 그릴때는 시간을 재주세요!",
    "✅ 그림 실력을 검사하는 것이 아니에요!",
    "✅ 즐거운 마음으로 그림을 그려 주세요!"
  ]
};

const CAMERA_IMAGES: Record<"house" | "tree" | "person", string> = {
  house: houseImage,
  tree: treeImage,
  person: personImage
};

const CameraIntro: React.FC<CameraIntroProps> = ({ type, onStart }) => {
  const navigate = useNavigate();
  const displayType = type === "male" || type === "female" ? "person" : type;

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center w-full bg-white px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        {type === "house"
          ? "집 (HOUSE)"
          : type === "tree"
            ? "나무 (TREE)"
            : "사람 (PERSON)"}
      </h1>

      <div className="w-full max-w-lg bg-[#ebffe5] p-6 rounded-[15px] shadow-md flex flex-col items-center border border-green-300">
        <img
          src={CAMERA_IMAGES[displayType]}
          alt={type}
          className="h-[250px] object-contain mb-4"
        />

        <div className="text-lg text-gray-700 text-left mb-6 w-full">
          {CAMERA_GUIDE[displayType].map((guide, index) => (
            <p
              key={index}
              className="mb-2"
              dangerouslySetInnerHTML={{ __html: guide }}
            ></p>
          ))}
        </div>
      </div>

      <div className="relative mt-6 flex justify-center w-full max-w-lg mb-8">
        <button
          onClick={handleGoBack}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-gray-600 mr-4 w-[150px]"
        >
          뒤로가기
        </button>
        <button
          onClick={onStart}
          className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-green-700 w-[150px]"
        >
          촬영 시작하기
        </button>
      </div>
    </div>
  );
};

export default CameraIntro;
