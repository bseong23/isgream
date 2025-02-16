import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logout();

      // 성공 코드 "S0000" 또는 다른 특정 성공 코드 확인
      if (response.code === "S0000") {
        // 로그아웃 성공 시 로그인 페이지로 이동
        navigate("/login");
      } else {
        // 다른 코드(예: "E3003")의 경우 메시지와 함께 알림
        alert(response.message || "로그아웃에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[95%] max-w-[706px] flex justify-end m-5">
        <button
          onClick={handleLogout}
          className="flex text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <LogOut size={20} />
          <span className="mx-2">로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default LogoutButton;
