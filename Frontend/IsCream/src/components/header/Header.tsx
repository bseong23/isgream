import { useLocation } from "react-router-dom";
import { useCallback } from "react";
import HeaderMain from "./Header_MainPage";
import HeaderNormal from "./Header_Normal";

const HeaderController = () => {
  const location = useLocation();
  const handleChildSelect = useCallback((selectedItem: string) => {
    console.log("선택된 아이:", selectedItem);
  }, []);

  // 특정 경로에서 헤더 숨기기
  if (location.pathname === "/login" || location.pathname === "/error") {
    return null;
  }

  if (location.pathname === "/") {
    return <HeaderMain onChildSelect={handleChildSelect} />;
  } else {
    return <HeaderNormal />;
  }
};

export default HeaderController;
