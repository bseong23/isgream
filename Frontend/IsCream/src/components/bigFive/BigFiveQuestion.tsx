import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBigFiveTest } from "../../hooks/bigfive/useBigFiveTest";
import confetti from "canvas-confetti";
import AudioQuestionPlayer from "./AudioQuestionPlayer";

// 초록 공룡 컴포넌트
const Dinosaur = () => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 100 100"
    className="absolute transform transition-all duration-1000"
  >
    <path
      d="M60,45 C70,40 75,30 75,25 C75,15 65,10 60,15 C55,5 40,5 35,15 C25,10 15,20 20,30 C10,35 10,50 20,55 C15,65 20,75 30,75 C35,85 50,85 55,75 C65,80 75,70 70,60 C80,55 75,45 60,45"
      fill="#4CAF50"
      stroke="#2E7D32"
      strokeWidth="3"
    />
    <circle cx="45" cy="35" r="3" fill="#2E7D32" />
  </svg>
);

// 주황 공룡 컴포넌트
const TRex = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 100 100"
    className="absolute transform transition-all duration-1000"
  >
    <path
      d="M80,50 C85,45 85,35 80,30 C75,25 65,25 60,30 C55,20 45,15 35,20 C25,15 15,20 15,30 C10,35 10,45 15,50 C10,55 15,65 25,65 C30,75 45,75 50,65 C60,70 70,65 70,55 C80,55 80,50 80,50"
      fill="#FF9800"
      stroke="#F57C00"
      strokeWidth="3"
    />
    <circle cx="35" cy="35" r="3" fill="#F57C00" />
  </svg>
);

// interface BigFiveQuestion {
//   question: string;
//   questionType: string;
// }

const BigFiveQuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const { questions, loading, error, fetchQuestions, submitTestResult } =
    useBigFiveTest();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // 폭죽 효과 함수
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

    fire(0.25, {
      spread: 26,
      startVelocity: 55
    });

    fire(0.2, {
      spread: 60
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45
    });
  };

  const handleAnswer = (score: number) => {
    if (questions && questions.length > 0) {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentQuestionIndex].question]: score
      }));

      triggerConfetti();

      // 공룡들 리액션
      const dinos = document.querySelectorAll(
        ".dino-1, .dino-2, .dino-3, .dino-4"
      );
      dinos.forEach((dino) => {
        dino.classList.add("dino-happy");
        setTimeout(() => {
          dino.classList.remove("dino-happy");
        }, 1000);
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentQuestionIndex((prev) => prev - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleSubmitExam = () => {
    const calculateResults = () => {
      const categoryScores: { [key: string]: number[] } = {
        Openness: [],
        Conscientiousness: [],
        Extraversion: [],
        Agreeableness: [],
        Neuroticism: []
      };

      Object.entries(answers).forEach(([question, score]) => {
        const categoryMapping: { [key: string]: keyof typeof categoryScores } =
          {
            OPENNESS: "Openness",
            CONSCIENTIOUSNESS: "Conscientiousness",
            EXTRAVERSION: "Extraversion",
            AGREEABLENESS: "Agreeableness",
            NEUROTICISM: "Neuroticism"
          };

        const currentQuestion = questions?.find((q) => q.question === question);
        if (currentQuestion && currentQuestion.questionType) {
          const category =
            categoryMapping[currentQuestion.questionType.toUpperCase()];
          if (category) {
            categoryScores[category].push(score);
          }
        }
      });

      const calculateCategoryAverage = (scores: number[]) => {
        return scores.length > 0
          ? scores.reduce((sum, score) => sum + score, 0) / scores.length
          : 0;
      };

      return {
        openness: calculateCategoryAverage(categoryScores.Openness),
        conscientiousness: calculateCategoryAverage(
          categoryScores.Conscientiousness
        ),
        extraversion: calculateCategoryAverage(categoryScores.Extraversion),
        agreeableness: calculateCategoryAverage(categoryScores.Agreeableness),
        emotionalStability: calculateCategoryAverage(categoryScores.Neuroticism)
      };
    };

    const examResults = calculateResults();

    const submitResults = async () => {
      try {
        const response = await submitTestResult(examResults);
        triggerConfetti();
        setTimeout(() => {
          navigate("/big-five/result", {
            state: { results: response?.data || examResults }
          });
        }, 1000);
      } catch (error) {
        console.error("검사 결과 제출 실패", error);
      }
    };

    submitResults();
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

  if (!questions || questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-700">불러올 질문이 없습니다.</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasCurrentAnswer = answers[currentQuestion.question] !== undefined;

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-hidden">
      {/* 배경 데코레이션과 공룡들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="dino-1 absolute left-[10%] top-[20%]">
          <Dinosaur />
        </div>
        <div className="dino-2 absolute right-[15%] bottom-[25%]">
          <TRex />
        </div>
        <div className="dino-3 absolute left-[20%] bottom-[15%]">
          <Dinosaur />
        </div>
        <div className="dino-4 absolute right-[25%] top-[15%]">
          <TRex />
        </div>
      </div>

      <div className="h-full flex items-center justify-center">
        <div
          className={`bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl mx-4 transform transition-all duration-500 ${
            isAnimating ? "scale-95 opacity-80" : "scale-100 opacity-100"
          }`}
        >
          <AudioQuestionPlayer questionIndex={currentQuestionIndex} />
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Big5 성격검사
          </h1>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-700 h-3 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center font-medium">
              {currentQuestionIndex + 1} / {questions.length}
            </p>
          </div>

          <div className="mb-6 transform transition-all duration-500">
            <p className="text-xl font-medium mb-6 text-center text-gray-700">
              {currentQuestion.question}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => handleAnswer(score)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    answers[currentQuestion.question] === score
                      ? "bg-green-100 border-2 border-green-500 text-green-700 scale-105 shadow-md"
                      : "bg-gray-50 border border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                  }`}
                >
                  {score === 1 && "아니!!"}
                  {score === 2 && "아닐껄!?"}
                  {score === 3 && "아마도?"}
                  {score === 4 && "그럴껄?"}
                  {score === 5 && "당연하지!"}
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
                  onClick={handleSubmitExam}
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

      {/* 공룡 애니메이션을 위한 스타일 */}
      <style>{`
        @keyframes walk {
          0%,
          100% {
            transform: translateX(0) scaleX(1);
          }
          25% {
            transform: translateX(20px) scaleX(1);
          }
          50% {
            transform: translateX(40px) scaleX(-1);
          }
          75% {
            transform: translateX(20px) scaleX(-1);
          }
        }

        @keyframes happy {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .dino-1 {
          animation: walk 8s infinite;
        }
        .dino-2 {
          animation: walk 10s infinite reverse;
        }
        .dino-3 {
          animation: walk 12s infinite;
        }
        .dino-4 {
          animation: walk 9s infinite reverse;
        }

        .dino-happy {
          animation: happy 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default BigFiveQuestionPage;
