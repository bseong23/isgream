import React from "react";
import { useNavigate } from "react-router-dom";
import characterImage from "../../assets/image/character.png";
import parentingIntroImage from "../../assets/image/PAT검사.png";
import PATExamCard from "../../components/card/TestExamCard";

const ParentingIntroPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartExam = () => {
    navigate("/parenting-test");
  };

  return (
    <div className="w-full max-w-[706px] mx-auto">
      <PATExamCard
        title="부모 양육 태도 검사"
        characterImage={characterImage}
        posterImage={parentingIntroImage}
        examTime="최대 15분"
        resultPeriod="검사 종료일부터 1년"
        examTarget="부모"
        onStartExam={handleStartExam}
      />
    </div>
  );
};

export default ParentingIntroPage;
