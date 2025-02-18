import React, { useState, useEffect, useMemo } from "react";
import usePatTestQuestions from "../../hooks/pat/usePatTestQuestions";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/common/axiosInstance";

const ParentingTest: React.FC = () => {
  const { questions, loading, error } = usePatTestQuestions();
  const navigate = useNavigate();

  // ✅ Ensure `questionList` is stable
  const questionList = useMemo(() => questions?.data ?? [], [questions]);

  // ✅ 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(true);

  // ✅ 사용자가 선택한 답변 저장 (초기값: 질문 개수에 맞게 0으로 설정)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  // ✅ 결과 제출 로딩 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ 모든 질문 응답 여부 상태
  const [allAnswered, setAllAnswered] = useState(false);

  // ✅ 질문이 로드된 후 selectedAnswers 배열 초기화
  useEffect(() => {
    if (questionList.length > 0) {
      setSelectedAnswers(new Array(questionList.length).fill(0));
    }
  }, [questionList]);

  // ✅ 모든 질문이 응답되었는지 체크하는 useEffect
  useEffect(() => {
    setAllAnswered(selectedAnswers.length === questionList.length && !selectedAnswers.includes(0));
  }, [selectedAnswers, questionList.length]);

  // ✅ 답변 선택 핸들러
  const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerIndex + 1;
      return newAnswers;
    });
  };

  // ✅ 검사 결과 제출
  const handleSubmit = async () => {
    if (!allAnswered) return;
    setIsSubmitting(true);

    console.log("📡 검사 결과 준비 중...");
    console.log("선택된 답변:", selectedAnswers);

    const scoreA = selectedAnswers.filter((ans) => ans === 1).length;
    const scoreB = selectedAnswers.filter((ans) => ans === 2).length;
    const scoreC = selectedAnswers.filter((ans) => ans === 3).length;

    console.log("요청 데이터:", { scoreA, scoreB, scoreC });

    try {
      console.log("📡 검사 결과 전송 중...");
      await api.post("/pat-tests", { scoreA, scoreB, scoreC });

      console.log("✅ 검사 결과 서버 반영 완료");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ✅ 검사 결과 페이지로 이동
      navigate("/pat-test-result");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500 font-semibold">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md relative">
      {/* ✅ 모달 창 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-md">
            <h2 className="text-lg font-bold mb-2">부모 양육 태도 검사 안내</h2>
            <p className="text-gray-600">
            이 검사는 자녀와의 관계에서 어떤 유형의 부모인지를 알아보기 위한 것입니다. 

            자녀와 어떻게 상호 작용하는지가 자녀들의 현재 및 미래의 삶에 영향을 줄 수 있습니다.

            자녀의 현재와 미래에 관심이 있다면, 당신이 부모로서 어떤 유형인지 한번 확인해 보시고 자녀들에게 도움이 되었으면 합니다.

            이 검사는 Goyetche(2000)가 Baumrind의 부모의 양육태도 유형에 관한 이론(1991)에 입각해서 제작한 검사를 우리 실정에 맞게 수정, 보완한 것입니다.
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              시작하기
            </button>
          </div>
        </div>
      )}

      {/* ✅ 질문 목록 */}
      <h1 className="text-2xl font-bold text-center mb-6">👨‍👩‍👧‍👦 부모 양육 태도 검사</h1>

      <div className="space-y-6">
        {questionList.map((q, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-100 hover:bg-gray-200 transition">
            <p className="font-semibold text-lg mb-2">{index + 1}. {q.question}</p>
            <ul className="space-y-2">
              {[q.answer1, q.answer2, q.answer3].map((answer, answerIndex) => (
                <li 
                  key={answerIndex} 
                  className={`p-2 border rounded-md cursor-pointer transition ${
                    selectedAnswers[index] === answerIndex + 1 ? "bg-blue-500 text-white scale-100" : "bg-white hover:bg-blue-100"
                  }`}
                  onClick={() => handleSelectAnswer(index, answerIndex)}
                  style={{ transition: "transform 0.1s ease-in-out" }}
                >
                  {answer}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ✅ 결과 제출 버튼 (모든 질문 응답해야 활성화) */}
      <button
        className={`w-full mt-6 p-3 font-regular rounded-md transition ${
          allAnswered
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
        onClick={handleSubmit}
        disabled={!allAnswered || isSubmitting}
      >
        {isSubmitting ? "제출 중..." : "결과 제출"}
      </button>
    </div>
  );
};

export default ParentingTest;
