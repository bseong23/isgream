import { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoginLogo from "../../assets/icons/login_logo.png";
import GoogleLogo from "../../assets/icons/google_logo.png";
import LongButton from "../../components/button/LongButton";
import { ERROR_CODES } from "../../types/auth";

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

      if (response.code === ERROR_CODES.SUCCESS) {
        navigate("/");
      } else {
        switch (response.code) {
          case ERROR_CODES.INVALID_EMAIL:
            setError("유효하지 않은 이메일입니다.");
            break;
          case ERROR_CODES.INVALID_PASSWORD:
            setError("유효하지 않은 비밀번호입니다.");
            break;
          case ERROR_CODES.USER_NOT_FOUND:
            setError("존재하지 않는 사용자입니다.");
            break;
          case ERROR_CODES.AUTH_FAILED:
            setError("인증에 실패했습니다.");
            break;
          default:
            setError("로그인에 실패했습니다. 다시 시도해주세요.");
        }
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Login error:", error);
    }
  };

  // 구글 로그인 핸들러
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { access_token } = tokenResponse;
        // 구글 유저 정보 가져오기
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${access_token}` }
          }
        );

        // 백엔드에 사용자 정보 전송
        const response = await axios.post("/users/join/oauth2", {
          email: userInfo.data.email,
          name: userInfo.data.name,
          googleToken: access_token
        });

        // 토큰 저장 및 로그인 성공 처리
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } catch (error) {
        console.error("Google 로그인 오류:", error);
        setError("Google 로그인에 실패했습니다.");
      }
    },
    onError: () => {
      setError("Google 로그인에 실패했습니다.");
    },
    flow: "implicit"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full px-6 pt-16 overflow-hidden">
      <img
        src={LoginLogo}
        alt="로고"
        className="w-60 h-60 sm:w-48 sm:h-48 mb-6 rounded-lg"
      />

      <form onSubmit={handleSubmit} className="w-full max-w-md mt-4">
        <input
          type="email"
          placeholder="이메일"
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <LongButton
          type="submit"
          color="green"
          className="w-full p-3 rounded hover:bg-green-600 text-base"
        >
          로그인
        </LongButton>

        {error && (
          <p className="text-red-500 mt-2 text-center text-sm">{error}</p>
        )}
      </form>

      {/* 구글 로그인 버튼 */}
      <div className="w-full flex flex-col items-center mt-8">
        <button
          onClick={() => googleLogin()}
          className="flex items-center justify-center"
        >
          <img src={GoogleLogo} alt="Google 로그인" className="w-12 h-12" />
        </button>

        {/* 비밀번호 찾기 & 회원가입 */}
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
