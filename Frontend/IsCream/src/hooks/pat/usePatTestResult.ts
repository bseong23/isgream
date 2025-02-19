import { useState, useEffect } from "react";
import { api } from "../../utils/common/axiosInstance";

interface TestResult {
  testDate: string;
  scoreA: number;
  scoreB: number;
  scoreC: number;
  result: string;
}

interface ApiResponse {
  code: "S0000" | "E4001";
  message: string;
  data: TestResult;
}

const usePatTestResult = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get<ApiResponse>("/pat-tests/recent");

        if (response.data.code === "S0000") {
          console.log("✅ 최신 검사 결과:", response.data.data); // 핵심 데이터만 출력
          setData(response.data);
        } else {
          throw new Error(response.data.message || "검사 결과 조회 실패");
        }
      } catch (err) {
        console.error("❌ 검사 결과 조회 실패:", err);
        setError("검사 결과를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  return { data, loading, error };
};

export default usePatTestResult;
