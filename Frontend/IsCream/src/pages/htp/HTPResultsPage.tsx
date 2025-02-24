import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingGIF from "../../assets/loading.gif";

interface TestResult {
  type: string;
  analysis: string;
  imageUrl?: string;
}

export default function HTPResultPage({
  resultData
}: {
  resultData?: Record<string, any>;
}) {
  const navigate = useNavigate();
  const [parsedResults, setParsedResults] = useState<TestResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("📌 원본 데이터 (resultData):", resultData);

    if (!resultData || !resultData.data || !resultData.data.result) {
      console.error(
        "❌ resultData가 없거나 데이터가 비어 있습니다!",
        resultData
      );
      setIsLoading(false);
      return;
    }

    try {
      const {
        houseDrawingUrl,
        treeDrawingUrl,
        maleDrawingUrl,
        femaleDrawingUrl,
        result
      } = resultData.data;
      const text =
        typeof result === "string"
          ? result.replace(/\\n/g, "\n").replace(/^"|"$/g, "")
          : result;

      const sections = text.split("----").map((section) =>
        section
          .trim()
          .split("\n")
          .filter((line) => line.length > 0)
      );

      const processedResults: TestResult[] = sections
        .map((lines) => {
          let type = "";
          let analysis = "";

          lines.forEach((line) => {
            if (line.includes("검사 유형:")) {
              type = line.replace("검사 유형:", "").trim();
            } else if (
              !line.includes("검사 순서:") &&
              !line.includes("검사 시간:")
            ) {
              analysis += line + "\n";
            }
          });

          return {
            type,
            analysis: analysis.trim(),
            imageUrl:
              type === "House"
                ? houseDrawingUrl
                : type === "Tree"
                  ? treeDrawingUrl
                  : type === "Male"
                    ? maleDrawingUrl
                    : type === "Female"
                      ? femaleDrawingUrl
                      : undefined
          };
        })
        .filter((result) => result.type && result.analysis);

      setParsedResults(processedResults);
    } catch (error) {
      console.error("❌ 결과 처리 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  }, [resultData]);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? parsedResults.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === parsedResults.length - 1 ? 0 : prev + 1
    );
  };

  const handleRetry = () => {
    navigate("/ai-analysis");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white backdrop-blur-md p-8 rounded-2xl flex flex-col items-center">
          <img
            src={LoadingGIF}
            alt="로딩 중"
            className="w-32 h-32 object-contain"
          />
          <p className="text-lg font-semibold text-gray-700 mt-4">
            분석 결과를 불러오는 중
          </p>
          <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full -mt-15 -mb-30 pb-0 flex flex-col items-center bg-white px-4">
      {parsedResults.length > 0 ? (
        <div className="w-full max-w-xl space-y-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
              <p>
                <span className="text-pink-200 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  아
                </span>
                <span className="text-blue-200 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  이
                </span>
                <span className="text-yellow-200 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  's
                </span>
                <span className="text-pink-200 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  그
                </span>
                <span className="text-blue-200 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  림
                </span>
                과 같이
              </p>
              <p>아이의 심리를 깊이 들여다봐요</p>
            </h1>
          </div>

          {/* 헤더 섹션 */}
          <div className="flex items-center justify-center space-x-6">
            {parsedResults.length > 1 && (
              <button
                className="text-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                onClick={prevSlide}
              >
                <span className="text-xl">◀</span>
              </button>
            )}
            <p className="text-lg md:text-xl text-gray-700 font-semibold">
              {parsedResults[currentIndex].type} 검사 결과
            </p>
            {parsedResults.length > 1 && (
              <button
                className="text-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                onClick={nextSlide}
              >
                <span className="text-xl">▶</span>
              </button>
            )}
          </div>

          {/* 이미지 섹션 */}
          <div className="relative aspect-square flex items-center justify-center">
            {parsedResults[currentIndex].imageUrl && (
              <div className="w-full border-2 border-[#BEBEBE] max-w-md">
                <img
                  src={parsedResults[currentIndex].imageUrl}
                  alt={parsedResults[currentIndex].type}
                  className="w-full h-full object-contain rounded-xl shadow-lg transition-all duration-300 ease-in-out"
                />
              </div>
            )}
          </div>

          {/* 분석 리포트 섹션 */}
          <div className="rounded-xl p-6 md:p-8 border border-[#BEBEBE]">
            <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4">
              심리 분석 리포트
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
              {parsedResults[currentIndex].analysis}
            </p>
          </div>

          {/* 액션 버튼 섹션 */}
          <div className="grid grid-cols-2 gap-4">
            <button
              className="w-full p-3 bg-blue-400 text-white font-semibold rounded-[15px] shadow-md hover:bg-blue-500 transition"
              onClick={handleRetry}
            >
              다시하기
            </button>
            <button
              className="w-full p-3 bg-green-600 text-white font-semibold rounded-[15px] shadow-md hover:bg-green-700 transition"
              onClick={handleGoHome}
            >
              홈으로
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">검사 결과가 없습니다.</p>
      )}
    </div>
  );
}
