import { useState, useEffect } from "react";
import { getHTPTestResult, HTPTestResult } from "../../api/htpApi";

function useHtpTest(htpTestId?: string) {
  const [data, setData] = useState<HTPTestResult | null>(null); // ✅ data를 명확히 정의
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔍 useHtpTest 실행됨, htpTestId:", htpTestId);

    if (!htpTestId) {
      console.error("🚨 HTP Test ID가 없습니다. API 호출 중단!");
      setLoading(false);
      setError("HTP Test ID가 제공되지 않았습니다.");
      return;
    }

    const testIdNumber = Number(htpTestId);
    if (isNaN(testIdNumber)) {
      console.error("🚨 잘못된 HTP Test ID:", htpTestId);
      setLoading(false);
      setError("잘못된 HTP Test ID입니다.");
      return;
    }

    console.log("✅ API 호출 시작: getHTPTestResult(", testIdNumber, ")");

    getHTPTestResult(testIdNumber)
      .then((result) => {
        console.log("✅ API 응답 데이터:", result);
        setData(result); // ✅ 명확한 타입을 가지므로 문제 없음
      })
      .catch((err: unknown) => {
        console.error("❌ API 요청 실패:", err);

        let errorMessage = "알 수 없는 오류가 발생했습니다.";
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "string") {
          errorMessage = err;
        }

        setError(errorMessage);
      })
      .finally(() => setLoading(false));
  }, [htpTestId]);

  return { data, loading, error };
}

export default useHtpTest;
