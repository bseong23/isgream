import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VerifyEmailForm from "../../components/account/VerifyEmailForm";
import axios from "axios";

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email ?? ""; // ✅ 상태 제거, 바로 사용

  const [timer, setTimer] = useState(180);
  const [errorMessage, setErrorMessage] = useState("");

  // 타이머 설정
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // 이메일 인증 요청 처리
  const handleVerifyEmail = async (code: string) => {
    try {
      const response = await axios.post("/users/verify-email", { email, code });

      if (response.data.success) {
        navigate("/reset-password", { state: { email } });
      } else {
        setErrorMessage("인증 코드가 일치하지 않습니다.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "이메일 인증 중 오류가 발생했습니다.");
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full px-6 py-10">
      <h1 className="text-lg font-bold mb-6">이메일 인증</h1>
      <p className="text-gray-700">
        남은 시간: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
      </p>
      <VerifyEmailForm onSubmit={handleVerifyEmail} />
      {errorMessage && <p className="mt-4 text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default VerifyEmailPage;
