import { useLocation, useNavigate } from "react-router-dom";
import ResetPasswordForm from "../../components/account/ResetPasswordForm";
import { api } from "../../utils/common/axiosInstance"; // 기존 api 인스턴스 가져오기
import { useEffect, useState } from "react";

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // 이메일 정보 확인 및 설정
    if (!location.state?.email) {
      alert("이메일 정보가 없습니다. 비밀번호 찾기 페이지로 이동합니다.");
      navigate("/find-password");
    } else {
      setEmail(location.state.email);
    }
  }, [location, navigate]);

  const handleResetPassword = async (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 기존 api 인스턴스 사용하여 비밀번호 변경 요청
      const response = await api.post("/users/password", {
        email,
        newPassword: password
      });

      if (response.data.code === "S0000") {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        navigate("/login");
      } else {
        setError(response.data.message || "비밀번호 변경 실패. 다시 시도해주세요.");
      }
    } catch (error: any) {
      console.error("비밀번호 변경 오류:", error);
      
      // 오류 메시지 처리
      if (error.response) {
        setError(error.response.data?.message || "비밀번호 변경 중 오류가 발생했습니다.");
      } else if (error.request) {
        setError("서버 응답이 없습니다. 네트워크 연결을 확인하세요.");
      } else {
        setError("비밀번호 변경 요청 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">비밀번호 재설정</h2>
      {email ? (
        <>
          <p className="mb-4 text-center text-gray-600">
            {email} 계정의 비밀번호를 재설정합니다.
          </p>
          <ResetPasswordForm onSubmit={handleResetPassword} />
          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        </>
      ) : (
        <p className="text-center text-red-500">이메일 정보를 불러오는 중...</p>
      )}
    </div>
  );
};

export default ResetPasswordPage;