import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FindPasswordForm from "../../components/account/FindPasswordForm";
import axios from "axios";

const FindPasswordPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * 비밀번호 찾기 처리 함수
   * 사용자가 입력한 이메일, 이름, 전화번호 정보를 서버에 보내 본인 확인을 진행함
   * 본인 확인이 성공하면 이메일 인증 단계로 이동
   * 실패하면 오류 메시지를 표시함
   */
  const handleFindPassword = async (formData: {
    email: string;
    name: string;
    phone: string;
  }): Promise<boolean> => {
    try {
      const response = await axios.post("/users/find-password", formData);

      // 본인 확인 성공 시 이메일 인증 페이지로 이동
      if (response.data.success) {
        navigate("/verify-email", { state: { email: formData.email } });
      } else {
        setErrorMessage("입력한 정보가 일치하지 않습니다.");
      }
    } catch (error: unknown) {
      // API 요청 중 발생한 오류 처리
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            "비밀번호 찾기 요청 중 오류가 발생했습니다."
        );
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "비밀번호 찾기 요청 중 알 수 없는 오류가 발생했습니다."
        );
      }
    }
    return true;
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full px-6 py-10">
      {/* 비밀번호 찾기 폼 렌더링 */}
      <FindPasswordForm onSubmit={handleFindPassword} />

      {/* 오류 발생 시 메시지 표시 */}
      {errorMessage && (
        <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default FindPasswordPage;
