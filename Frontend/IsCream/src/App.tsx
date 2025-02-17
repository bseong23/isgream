import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/common/queryClient";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNavigation from "./components/nav/Nav";
import Header from "./components/header/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { api } from "./utils/common/axiosInstance";

// pages 폴더에서 필요한 컴포넌트들을 가져옴
import {
  CalendarPage,
  MyPage,
  ChangeInfo,
  ChangePassword,
  MainPage,
  PDFDownload,
  BoardPage,
  BoardCreatePage,
  BoardEditPage,
  BoardDetailPage,
  LoginPage,
  SignUpPage,
  FindPasswordPage,
  VerifyEmailPage,
  ResetPasswordPage,
  ChatPage,
  ChatRoomPage,
  CenterPage,
  CanvasPage,
  AiAnalysisPage,
  CameraPage,
  PhotoCapturePage,
  HTPResultsPage,
  Education,
  ParentingTestPage,
  PatTestResultPage,
  BigFivePage,
  BigFiveQuestionPage,
  BigFiveResultPage
} from "./pages";
import { useFCM } from "./hooks/notification/useFCM";

// 앱 시작시 인증 설정
const setupAxiosInterceptors = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    api.defaults.headers.common["access"] = token;
  }
};

function App() {
  const { initializeFCM } = useFCM();

  useEffect(() => {
    setupAxiosInterceptors();
    initializeFCM();
  }, [initializeFCM]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <div className="w-[95%] mx-auto pb-20 bg-white pt-15 min-h-screen">
          <Routes>
            {/* 인증이 필요 없는 라우트 */}
            {/* 메인 페이지 */}
            <Route path="/" element={<MainPage />} />

            {/* 인증 관련 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/find-password" element={<FindPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* 게시판 (읽기 전용) */}
            <Route path="/board" element={<BoardPage />} />
            <Route path="/board/detail/:postId" element={<BoardDetailPage />} />

            {/* 인증이 필요한 라우트 */}
            {/* 캘린더 */}
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              }
            />

            {/* 게시판 (쓰기, 수정) */}
            <Route
              path="/board/write"
              element={
                <ProtectedRoute>
                  <BoardCreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/board/edit/:postId"
              element={
                <ProtectedRoute>
                  <BoardEditPage />
                </ProtectedRoute>
              }
            />

            {/* 채팅 */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/room/:roomId"
              element={
                <ProtectedRoute>
                  <ChatRoomPage />
                </ProtectedRoute>
              }
            />

            {/* 마이페이지 관련 */}
            <Route
              path="/mypage"
              element={
                <ProtectedRoute>
                  <MyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mypage/changeInfo"
              element={
                <ProtectedRoute>
                  <ChangeInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mypage/changeInfo/password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mypage/PDFDownload"
              element={
                <ProtectedRoute>
                  <PDFDownload />
                </ProtectedRoute>
              }
            />

            {/* HTP 검사 */}
            <Route
              path="/htp"
              element={
                <ProtectedRoute>
                  <CanvasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/photo-capture"
              element={
                <ProtectedRoute>
                  <PhotoCapturePage />
                </ProtectedRoute>
              }
            />
            {/* CameraPage 라우트 추가 */}
            <Route
              path="/camera"
              element={
                <ProtectedRoute>
                  <CameraPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/htp-results/:htpTestId"
              element={
                <ProtectedRoute>
                  <HTPResultsPage />
                </ProtectedRoute>
              }
            />

            {/* BIG 5 */}
            <Route
              path="/big5-test"
              element={
                <ProtectedRoute>
                  <BigFivePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/big-five/question"
              element={
                <ProtectedRoute>
                  <BigFiveQuestionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/big-five/result"
              element={
                <ProtectedRoute>
                  <BigFiveResultPage />
                </ProtectedRoute>
              }
            />

            {/* 기타 기능 */}
            <Route
              path="/ai-analysis"
              element={
                <ProtectedRoute>
                  <AiAnalysisPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parenting-test"
              element={
                <ProtectedRoute>
                  <ParentingTestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pat-test-result"
              element={
                <ProtectedRoute>
                  <PatTestResultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/find-center"
              element={
                <ProtectedRoute>
                  <CenterPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommend"
              element={
                <ProtectedRoute>
                  <Education />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <BottomNavigation />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
