import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface HTPResult {
  type: "house" | "tree" | "male" | "female";
  imageUrl: string; // 검사한 이미지 URL
  reportText: string; // 결과 해석
}

const HTPResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<HTPResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 📌 백엔드에서 결과 데이터를 가져오기
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("/htp-tests/result", { method: "GET" });
        const data: HTPResult[] = await response.json();
        setResults(data);
      } catch (error) {
        console.error("결과 데이터를 불러오지 못했습니다.", error);
      }
    };

    fetchResults();
  }, []);

  // 🔄 이전 검사 결과 보기
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 🔄 다음 검사 결과 보기
  const handleNext = () => {
    if (currentIndex < results.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // ✅ 모든 결과를 확인한 후에는 홈으로 이동
  const handleConfirm = () => {
    navigate("/");
  };

  if (results.length === 0) {
    return <div className="text-center py-10">결과를 불러오는 중...</div>;
  }

  const currentResult = results[currentIndex];

  return (
    <div className="w-full flex flex-col bg-white items-center px-4">
      {/* 🔷 헤더 */}
      <div className="w-full max-w-[706px] mx-auto flex items-center justify-between px-4 bg-white h-[60px]">
        <h1 className="text-lg font-bold">심리검사</h1>
      </div>

      {/* 🖼 검사한 그림 */}
      <div className="w-full max-w-[706px] mx-auto flex items-center justify-between mt-4">
        {currentIndex > 0 && (
          <button onClick={handlePrev} className="text-2xl">
            ◀
          </button>
        )}
        <img
          src={currentResult.imageUrl}
          alt={currentResult.type}
          className="w-full max-w-[400px] border rounded-lg shadow-md"
        />
        {currentIndex < results.length - 1 && (
          <button onClick={handleNext} className="text-2xl">
            ▶
          </button>
        )}
      </div>

      {/* 📝 검사 결과 해석 */}
      <div className="w-full max-w-[706px] mx-auto bg-gray-100 rounded-lg p-4 mt-4">
        <h2 className="text-lg font-bold text-center">HTP 검사 보고서</h2>
        <p className="text-gray-700 mt-2">{currentResult.reportText}</p>
      </div>

      {/* 🎨 확인 버튼 */}
      {currentIndex === results.length - 1 && (
        <button
          className="w-[45%] h-[50px] bg-green-600 text-white rounded-lg text-lg shadow-md mt-4"
          onClick={handleConfirm}
        >
          확인
        </button>
      )}
    </div>
  );
};

export default HTPResultsPage;
