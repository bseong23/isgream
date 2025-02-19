import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 페이지 이동을 위해 추가

interface TestResult {
  type: string; // 검사 유형 (예: House, Tree, Male, Female)
  analysis: string; // 검사 결과
  imageUrl?: string; // 그림 이미지 URL
}

export default function HTPResultPage({ resultData }: { resultData?: Record<string, any> }) {
  console.log("✅ HTPResultPage.tsx 렌더링됨!");
  const navigate = useNavigate(); // ✅ 페이지 이동 함수 추가
  const [parsedResults, setParsedResults] = useState<TestResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // 슬라이드 인덱스 관리

  useEffect(() => {
    console.log("📌 원본 데이터 (resultData):", resultData);
    console.log("📌 resultData 타입:", typeof resultData);

    if (!resultData || !resultData.data || !resultData.data.result) {
      console.error("❌ resultData가 없거나 데이터가 비어 있습니다!", resultData);
      return;
    }

    const { houseDrawingUrl, treeDrawingUrl, maleDrawingUrl, femaleDrawingUrl, result } = resultData.data;
    
    console.log("📌 검사 결과 원본 데이터:", result);

    // ✅ JSON이 아니라면 변환하지 않고 그대로 사용
    const text = typeof result === "string" ? result.replace(/\\n/g, "\n").replace(/^"|"$/g, "") : result;

    // 2️⃣ '----' 기준으로 섹션 분리
    const sections = text.split("----").map((section) =>
      section
        .trim()
        .split("\n")
        .filter((line) => line.length > 0) // 빈 줄 제거
    );

    console.log("📌 분리된 섹션:", sections);

    // 3️⃣ 검사 유형 및 결과 추출
    const processedResults: TestResult[] = sections.map((lines) => {
      let type = "";
      let analysis = "";

      lines.forEach((line) => {
        if (line.includes("검사 유형:")) {
          type = line.replace("검사 유형:", "").trim();
        } else if (!line.includes("검사 순서:") && !line.includes("검사 시간:")) {
          analysis += line + "\n"; // 검사 순서와 검사 시간을 제외한 나머지 텍스트만 저장
        }
      });

      return {
        type,
        analysis: analysis.trim(),
        imageUrl:
          type === "House" ? houseDrawingUrl :
          type === "Tree" ? treeDrawingUrl :
          type === "Male" ? maleDrawingUrl :
          type === "Female" ? femaleDrawingUrl :
          undefined,
      };
    }).filter((result) => result.type && result.analysis); // 빈 데이터 제거

    console.log("📌 처리된 검사 결과:", processedResults);
    setParsedResults(processedResults);
  }, [resultData]);

  // ✅ 슬라이드 기능
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? parsedResults.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === parsedResults.length - 1 ? 0 : prev + 1));
  };

  // ✅ "다시하기" 버튼 클릭 시 /ai-analysis로 이동
  const handleRetry = () => {
    navigate("/ai-analysis");
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-white overflow-auto p-4">
      {parsedResults.length > 0 ? (
        <>
          {/* 🎨 슬라이드 배너 */}
          <div className="relative w-full max-w-md">
            {/* 🔹 이미지 표시 */}
            {parsedResults[currentIndex].imageUrl && (
              <img
                src={parsedResults[currentIndex].imageUrl}
                alt={parsedResults[currentIndex].type}
                className="w-full h-64 object-contain rounded-lg shadow-md transition-all duration-300 ease-in-out"
              />
            )}

            {/* ◀ 왼쪽 버튼 */}
            {parsedResults.length > 1 && (
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 transition"
                onClick={prevSlide}
              >
                ◀
              </button>
            )}

            {/* ▶ 오른쪽 버튼 */}
            {parsedResults.length > 1 && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 transition"
                onClick={nextSlide}
              >
                ▶
              </button>
            )}
          </div>

          {/* 🔹 검사 유형 */}
          <h2 className="text-xl font-semibold text-center mt-4">
            {parsedResults[currentIndex].type}
          </h2>

          {/* 🔹 검사 결과 박스 */}
          <div className="w-[90%] max-w-md mt-2 p-5 bg-gray-100 border rounded-lg shadow-sm">
            <p className="text-gray-800 whitespace-pre-line leading-relaxed">
              {parsedResults[currentIndex].analysis}
            </p>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10">검사 결과가 없습니다.</p>
      )}

      {/* ✅ "다시하기" 버튼 */}
      <button
        className="w-[90%] max-w-md mt-6 p-3 bg-red-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-red-600 transition"
        onClick={handleRetry}
      >
        다시하기
      </button>
    </div>
  );
}
