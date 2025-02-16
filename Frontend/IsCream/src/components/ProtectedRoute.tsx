import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

  console.log("protectedRoute 컴포넌트 실행");
  
  const { isAuthenticated } = useAuth();

  console.log('현재 인증 상태:', isAuthenticated);
  console.log('localStorage accessToken:', localStorage.getItem('accessToken')); // 실제 토큰 존재 여부 확인
  
  const location = useLocation();

  if (!isAuthenticated) {
    console.log('인증되지 않음, 로그인 페이지로 리다이렉트');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('인증됨, children 렌더링');
  return <>{children}</>;
};

export default ProtectedRoute;
