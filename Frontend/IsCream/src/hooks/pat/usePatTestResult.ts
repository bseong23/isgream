import { useEffect, useState } from "react";
import { api } from "../../utils/common/axiosInstance"; // ✅ axiosInstance 사용

// ✅ 검사 결과 타입 정의
interface PatTestResult {
  scoreA: number;
  scoreB: number;
  scoreC: number;
  type: string; // 예: "권위적 부모", "방임적 부모"
  description: string; // 유형 설명
}

// ✅ 최신 검사 결과 가져오는 커스텀 훅
const usePatTestResult = () => {
  const [result, setResult] = useState<PatTestResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        console.log("🚀 Fetching latest PAT test result...");
        const response = await api.get<PatTestResult>("/pat-tests/recent"); // ✅ 최신 결과 가져오기
        console.log("📡 Fetched result:", response.data);
        setResult(response.data);
      } catch (err) {
        console.error("❌ Error fetching test result:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  return { result, loading, error };
};

export default usePatTestResult;
