import TestExamCard from "../card/TestExamCard";
import { useNavigate } from "react-router-dom";

const BigFive = () => {
  const navigate = useNavigate();

  const handleStartExam = () => {
    // Big5 성격검사 시작 페이지로 이동
    navigate("/big-five/question");
  };
  return (
    <div className="max-w-[706px] mx-auto">
      <TestExamCard onStartExam={handleStartExam} />
    </div>
  );
};

export default BigFive;
