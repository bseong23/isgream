import React from "react";
import { useNavigate } from "react-router-dom";
import characterImage from "../../assets/image/character.png";
import htpIntroImage from "../../assets/image/htp_intro.png";
import PATExamCard from "../../components/card/TestExamCard";

const HTPAnalysisPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[706px] mx-auto">
      {/* PATExamCard 컴포넌트 사용 (버튼 숨김) */}
      <PATExamCard
        title="HTP-그림으로 보는 심리검사"
        characterImage={characterImage}
        posterImage={htpIntroImage}
        examTime="최대 60분"
        resultPeriod="검사 후 1년"
        examTarget="자녀"
        showButton={false} // 기본 버튼 숨김
      />

      {/* HTP 전용 버튼 그룹 */}
      <div className="flex justify-between gap-4 px-3 mb-4">
        <button
          className="flex-1 h-[50px] bg-[#009E28] text-white rounded-lg text-lg shadow-md"
          onClick={() => navigate("/photo-capture")}
        >
          사진 촬영
        </button>
        <button
          className="flex-1 h-[50px] bg-[#009E28] text-white rounded-lg text-lg shadow-md"
          onClick={() => navigate("/htp")}
        >
          직접 그리기
        </button>
      </div>
    </div>
  );
};

export default HTPAnalysisPage;
