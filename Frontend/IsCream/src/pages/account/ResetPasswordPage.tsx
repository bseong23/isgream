import { useLocation, useNavigate } from "react-router-dom";
import ResetPasswordForm from "../../components/account/ResetPasswordForm";
import axios from "axios";

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const handleResetPassword = async (password: string) => {
    try {
      const response = await axios.post("/users/password", { email, newPassword: password });

      if (response.data.code === "S0000") {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        navigate("/login");
      } else {
        alert("비밀번호 변경 실패. 다시 시도해주세요.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다.");
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full px-6 py-10">
      <h1 className="text-lg font-bold mb-6">비밀번호 재설정</h1>
      <ResetPasswordForm onSubmit={handleResetPassword} />
    </div>
  );
};

export default ResetPasswordPage;