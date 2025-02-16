import { useEffect } from "react";
import LoginForm from "../../components/account/LoginForm";
import { GoogleOAuthProvider } from "@react-oauth/google";

const LoginPage: React.FC = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.classList.add("no-navbar"); // 네비게이션 숨기기

    return () => {
      document.body.style.overflow = "auto";
      document.body.classList.remove("no-navbar"); // 페이지 벗어나면 네비게이션 복구
    };
  }, []);
  const handleLoginSuccess = () => {
    console.log("Login successful!");
  };

  return (
    <GoogleOAuthProvider clientId="500251459785-jt83i1u8dq66ecvjr6it8mc6orcj40m7.apps.googleusercontent.com">
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
