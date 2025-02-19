import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import usePatTestQuestions from "../../hooks/pat/usePatTestQuestions";
import { api } from "../../utils/common/axiosInstance";
import confetti from "canvas-confetti";

const ParentingTestPage: React.FC = () => {
  const { questions, loading, error } = usePatTestQuestions();
  const navigate = useNavigate();
  const questionList = useMemo(() => questions?.data ?? [], [questions]);

  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [allAnswered, setAllAnswered] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (questionList.length > 0) {
      setSelectedAnswers(new Array(questionList.length).fill(0));
    }
  }, [questionList]);

  useEffect(() => {
    setAllAnswered(
      selectedAnswers.length === questionList.length &&
        !selectedAnswers.includes(0)
    );
  }, [selectedAnswers, questionList.length]);

  const triggerConfetti = () => {
    const count = 30;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 999
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerIndex + 1;
      return newAnswers;
    });
    triggerConfetti();
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentQuestionIndex((prev) => prev - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionList.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;

    try {
      const scoreA = selectedAnswers.filter((ans) => ans === 1).length;
      const scoreB = selectedAnswers.filter((ans) => ans === 2).length;
      const scoreC = selectedAnswers.filter((ans) => ans === 3).length;

      await api.post("/pat-tests", { scoreA, scoreB, scoreC });
      triggerConfetti();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/pat-test-result");
    } catch (error) {
      console.error("제출 중 오류 발생:", error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-green-700">질문을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-red-600">에러: {error}</div>
      </div>
    );
  }

  if (!questionList || questionList.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-700">불러올 질문이 없습니다.</div>
      </div>
    );
  }

  const currentQuestion = questionList[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questionList.length - 1;
  const hasCurrentAnswer = selectedAnswers[currentQuestionIndex] !== 0;

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-hidden">
      <div className="h-full flex items-center justify-center">
        <div
          className={`bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl mx-4 transform transition-all duration-500 ${
            isAnimating ? "scale-95 opacity-80" : "scale-100 opacity-100"
          }`}
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            👨‍👩‍👧‍👦 부모 양육 태도 검사
          </h1>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-700 h-3 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${((currentQuestionIndex + 1) / questionList.length) * 100}%`
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center font-medium">
              {currentQuestionIndex + 1} / {questionList.length}
            </p>
          </div>

          <div className="mb-6 transform transition-all duration-500">
            <p className="text-xl font-medium mb-6 text-center text-gray-700">
              {currentQuestion.question}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {[
                currentQuestion.answer1,
                currentQuestion.answer2,
                currentQuestion.answer3
              ].map((answer, answerIndex) => (
                <button
                  key={answerIndex}
                  onClick={() =>
                    handleSelectAnswer(currentQuestionIndex, answerIndex)
                  }
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    selectedAnswers[currentQuestionIndex] === answerIndex + 1
                      ? "bg-green-100 border-2 border-green-500 text-green-700 scale-105 shadow-md"
                      : "bg-gray-50 border border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                  }`}
                >
                  {answer}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 || isAnimating}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  currentQuestionIndex === 0 || isAnimating
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-md"
                }`}
              >
                이전
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={!hasCurrentAnswer || isAnimating}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                    hasCurrentAnswer && !isAnimating
                      ? "bg-green-700 text-white hover:bg-green-800 shadow-md"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  제출하기
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!hasCurrentAnswer || isAnimating}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                    hasCurrentAnswer && !isAnimating
                      ? "bg-green-700 text-white hover:bg-green-800 shadow-md"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  다음
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentingTestPage;
