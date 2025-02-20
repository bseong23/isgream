import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoginLogo from "../../assets/icons/로고.png";
import LongButton from "../../components/button/LongButton";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("no-navbar");
    return () => {
      document.body.classList.remove("no-navbar");
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await login({ email, password });

      if (response.code === "S0000") {
        navigate("/");
      } else {
        switch (response.code) {
          case "E6001":
            setError(
              "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요."
            );
            break;
          case "E6003":
            setError("비밀번호가 틀렸습니다.");
            break;
          case "E5011":
            setError("탈퇴한 사용자입니다.");
            break;
          case "E5012":
            setError("이메일이 잘못되었습니다.");
            break;
          case "E3001":
            setError("인증에 실패했습니다.");
            break;
          case "E3002":
            setError("인증이 만료되었습니다. 다시 로그인해주세요.");
            break;
          case "E3003":
            setError("인증 형식이 잘못되었습니다.");
            break;
          case "E3004":
            setError("인증에 실패했습니다. 다시 시도해주세요.");
            break;

          default:
            setError(
              response.message || "로그인에 실패했습니다. 다시 시도해주세요."
            );
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          "로그인 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full overflow-hidden">
      <img
        src={LoginLogo}
        alt="로고"
        className="w-25 h-20 sm:w-35 sm:h-30 mb-6"
      />

      <form onSubmit={handleSubmit} className="w-full max-w-md mt-4 px-4">
        <input
          type="email"
          placeholder="이메일"
          className="w-full p-3 mb-4 border border-[#BEBEBE] rounded-[15px] focus:outline-none focus:border-0 focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full p-3 mb-4 border border-[#BEBEBE] rounded-[15px] focus:outline-none focus:border-0 focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <LongButton
          type="submit"
          color="green"
          className="w-full p-3 hover:bg-green-600 text-base"
        >
          로그인
        </LongButton>

        {error && (
          <p className="text-red-500 mt-2 text-center text-sm">{error}</p>
        )}
      </form>

      <div className="w-full flex flex-col items-center mt-8">
        <div className="mt-4 flex items-center w-full justify-center">
          <a
            href="/find-password"
            className="text-gray-600 hover:text-gray-900 hover:underline mr-2"
          >
            비밀번호 찾기
          </a>
          <span className="text-gray-300 mx-2">|</span>
          <a
            href="/signup"
            className="text-gray-600 hover:text-gray-900 hover:underline ml-2"
          >
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
