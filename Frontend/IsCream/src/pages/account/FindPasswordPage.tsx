import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FindPasswordForm from "../../components/account/FindPasswordForm";
import { api } from "../../utils/common/axiosInstance";

const FindPasswordPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  // 🔥 useEffect로 `handleFindPassword` 함수 상태 확인
  useEffect(() => {
    console.log("📢 FindPasswordPage 렌더링됨");
    console.log("📢 현재 handleFindPassword:", handleFindPassword);
  }, []);

  // 🔹 비밀번호 찾기 API 요청
  const handleFindPassword = async (formData: {
    email: string;
    name: string;
    phone: string;
  }): Promise<boolean> => {
    console.log("🔥 handleFindPassword 실행됨!", formData);
    try {
      const apiRequestData = {
        email: formData.email,
        username: formData.name,
        phone: formData.phone,
      };

      console.log("요청된 URL:", `${api.defaults.baseURL}/users/info/check`);
      console.log("요청 데이터:", apiRequestData);

      const response = await api.post("/users/info/check", apiRequestData);
      console.log("서버 응답:", response.data);

      if (response.data.code === "S0000") {
        console.log("비밀번호 찾기 성공");
        navigate("/reset-password", { state: { email: formData.email } });
        return true;
      } else {
        console.log("비밀번호 찾기 실패:", response.data.message);
        setErrorMessage(response.data.message || "입력한 정보가 일치하지 않습니다.");
        return false;
      }
    } catch (error: any) {
      console.error("비밀번호 찾기 오류:", error);
      setErrorMessage("서버 오류가 발생했습니다.");
      return false;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">비밀번호 찾기</h2>
      <FindPasswordForm onSubmit={handleFindPassword} />
      {errorMessage && <p className="mt-4 text-red-500 text-center">{errorMessage}</p>}
    </div>
  );
};

export default FindPasswordPage;
