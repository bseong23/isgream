// 🌟 메인 및 공통 페이지
export { default as MainPage } from "./MainPage";
export { default as CalendarPage } from "./CalendarPage";
export { default as MyPage } from "./MyPage";
export { default as Education } from "./Education";

// 🌟 로그인 및 회원가입 관련
export { default as LoginPage } from "./login/LoginPage";
export { default as SignUpPage } from "./login/SignupPage";

// 🌟 비밀번호 관련 (비밀번호 찾기, 이메일 인증, 비밀번호 재설정)
export { default as FindPasswordPage } from "./account/FindPasswordPage";
export { default as VerifyEmailPage } from "./account/VerifyEmailPage";
export { default as ResetPasswordPage } from "./account/ResetPasswordPage";
export { default as ChangePassword } from "./mypage/ChangePassword";

// 🌟 마이페이지 관련
export { default as ChangeInfo } from "./mypage/ChangeInfo";
export { default as PDFDownload } from "./mypage/PDFDownload";

// 🌟 게시판 관련
export { default as CenterPage } from "./map/CenterPage";

// 🌟 게시판 관련
export { default as BoardPage } from "./board/BoardPage";
export { default as BoardCreatePage } from "./board/BoardCreatePage";
export { default as BoardEditPage } from "./board/BoardEditPage";
export { default as BoardDetailPage } from "./board/BoardDetailPage";

// 🌟 채팅 관련
export { default as ChatPage } from "./ChatPage";
// export { default as ChatRoomPage } from "./chat/ChatRoomPage";

// 🌟 HTP 검사 (그림판)
export { default as CanvasPage } from "./htp/CanvasPage";
export { default as AiAnalysisPage } from "./htp/AiAnalysisPage";

export { default as CameraPage } from "./htp/PhotoCapturePage";
export { default as PhotoCapturePage } from "./htp/PhotoCapturePage";
export { default as HTPResultsPage } from "./htp/HTPResultsPage";
// 🌟 부모 양육 태도 검사 (Parenting Test)
export { default as ParentingTestPage } from "./pat/ParentingTest"; // ✅ 추가
export { default as PatTestResultPage } from "./pat/PatTestResultPage";

// 🌟 BIG5 검사
export { default as BigFivePage } from "./bigfive/BigFivePage";
export { default as BigFiveQuestionPage } from "./bigfive/BigFiveQuestionPage";
export { default as BigFiveResultPage } from "./bigfive/BigFiveResultPage";
