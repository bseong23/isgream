import { useState } from "react";
import { api } from "../utils/common/axiosInstance"; // ✅ axios 인스턴스 사용

const useWithdraw = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withdraw = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/users/withdraw"); // ✅ axios 인스턴스 사용

      if (response.data.code === "S0000") {
        alert("회원 탈퇴가 완료되었습니다.");
        localStorage.removeItem("accessToken"); // ✅ 토큰 삭제
        window.location.href = "/login"; // ✅ 로그인 페이지로 이동
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "탈퇴 실패");
    } finally {
      setLoading(false);
    }
  };

  return { withdraw, loading, error };
};

export default useWithdraw;
