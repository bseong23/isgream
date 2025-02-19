import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import FindPasswordForm from "../../components/account/FindPasswordForm";
import { api } from "../../utils/common/axiosInstance"; // 기존 api 인스턴스 가져오기

const FindPasswordPage = () => {
  // const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleFindPassword = async (formData: {
    email: string;
    name: string;
    phone: string;
  }): Promise<boolean> => {
    console.log("비밀번호 찾기 요청 시작:", formData);
    try {
      // Form sends 'name' but API expects 'username'
      const apiRequestData = {
        email: formData.email,
        username: formData.name, // 'name'을 'username'으로 변환
        phone: formData.phone
      };
      
      // 기존 api 인스턴스 사용
      const response = await api.post("/users/info/check", apiRequestData);
      console.log("서버 응답:", response.data);
      
      if (response.data.code === "S0000") {
        console.log("비밀번호 찾기 성공");
        // 성공 시 비밀번호 재설정 페이지로 이동 (form에서 자동 처리)
        return true;
      } else {
        console.log("비밀번호 찾기 실패:", response.data.message);
        setErrorMessage(response.data.message || "입력한 정보가 일치하지 않습니다.");
        return false;
      }
    } catch (error: any) {
      console.error("비밀번호 찾기 오류:", error);
      
      // 오류 메시지 처리
      if (error.response) {
        setErrorMessage(error.response.data?.message || "입력한 정보로 계정을 찾을 수 없습니다.");
      } else if (error.request) {
        setErrorMessage("서버 응답이 없습니다. 네트워크 연결을 확인하세요.");
      } else {
        setErrorMessage("비밀번호 찾기 요청 중 오류가 발생했습니다.");
      }
      return false;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">비밀번호 찾기</h2>
      <FindPasswordForm onSubmit={handleFindPassword} />
      {errorMessage && (
        <p className="mt-4 text-red-500 text-center">{errorMessage}</p>
      )}
    </div>
  );
};

export default FindPasswordPage;