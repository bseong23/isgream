import React from "react";
import document_icon from "../../assets/icons/document_icon.png";
import clock_icon from "../../assets/icons/clock_icon.png";
import pen_icon from "../../assets/icons/edit-pen.png";
import user_icon from "../../assets/icons/user_icon.png";
import character from "../../assets/image/character.png";
import bigfiveImage from "../../assets/image/big-o.png";
import LongButton from "../button/LongButton";

interface PATExamCardProps {
  title?: string;
  characterImage?: string;
  posterImage?: string;
  examTime?: string;
  resultPeriod?: string;
  examTarget?: string;
  onStartExam?: () => void;
  showButton?: boolean; // 버튼 표시 여부를 제어하는 prop 추가
}

const PATExamCard: React.FC<PATExamCardProps> = ({
  title = "Big5 성격검사",
  characterImage = character,
  posterImage = bigfiveImage,
  examTime = "최대 10분",
  resultPeriod = "검사 종료일부터 1년",
  examTarget = "자녀",
  onStartExam,
  showButton = true // 기본값은 true로 설정
}) => {
  return (
    <>
      <div className="w-[100%] h-max-[150px]">
        <img src={posterImage} alt="포스터" className="mx-auto" />
      </div>
      <div className="p-3 rounded-xl mx-auto">
        {/* 검사 정보 리스트 */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <img src={characterImage} alt="캐릭터" className="scale-100" />
            <h1 className="text-2xl">{title}</h1>
          </div>

          <div className="flex items-center">
            <div className="w-6 h-6 mr-3">
              <img src={pen_icon} alt="검사 구성" />
            </div>
            <span className="text-gray-600 flex-1">검사 구성</span>
            <span className="text-gray-800">설문 작성</span>
          </div>

          <div className="flex items-center">
            <div className="w-6 h-6 mr-3">
              <img src={clock_icon} alt="검사 시간" />
            </div>
            <span className="text-gray-600 flex-1">소요 시간</span>
            <span className="text-gray-800">{examTime}</span>
          </div>

          <div className="flex items-center">
            <div className="w-6 h-6 mr-3">
              <img src={document_icon} alt="검사지 보존 기간" />
            </div>
            <span className="text-gray-600 flex-1">결과지 보존 기간</span>
            <span className="text-gray-800">{resultPeriod}</span>
          </div>

          <div className="flex items-center">
            <div className="w-6 h-6 mr-3">
              <img src={user_icon} alt="검사 대상" />
            </div>
            <span className="text-gray-600 flex-1">검사 대상</span>
            <span className="text-gray-800">{examTarget}</span>
          </div>
        </div>

        {/* 버튼 (showButton이 true일 때만 표시) */}
        {showButton && <LongButton onClick={onStartExam}>검사 시작</LongButton>}
      </div>
    </>
  );
};

export default PATExamCard;
