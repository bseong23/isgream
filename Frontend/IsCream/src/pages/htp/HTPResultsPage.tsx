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
    <div className="w-screen h-screen flex flex-col items-center bg-white overflow-auto p-4">
      {parsedResults.length > 0 ? (
        <>
          <div className="relative w-full max-w-md">
            {parsedResults[currentIndex].imageUrl && (
              <img
                src={parsedResults[currentIndex].imageUrl}
                alt={parsedResults[currentIndex].type}
                className="w-full h-64 object-contain rounded-lg shadow-md transition-all duration-300 ease-in-out"
              />
            )}

            {parsedResults.length > 1 && (
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 transition"
                onClick={prevSlide}
              >
                ◀
              </button>
            )}

            {parsedResults.length > 1 && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 transition"
                onClick={nextSlide}
              >
                ▶
              </button>
            )}
          </div>

          <h2 className="text-xl font-semibold text-center mt-4">
            {parsedResults[currentIndex].type}
          </h2>

          <div className="w-[90%] max-w-md mt-2 p-5 bg-gray-100 border rounded-lg shadow-sm">
            <p className="text-gray-800 whitespace-pre-line leading-relaxed">
              {parsedResults[currentIndex].analysis}
            </p>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10">검사 결과가 없습니다.</p>
      )}

      <button
        className="w-[90%] max-w-md mt-6 p-3 bg-red-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-red-600 transition"
        onClick={handleRetry}
      >
        다시하기
      </button>

      <button
        className="w-[90%] max-w-md mt-4 p-3 bg-blue-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-600 transition"
        onClick={handleGoHome}
      >
        홈으로
      </button>
    </div>
  );
}
