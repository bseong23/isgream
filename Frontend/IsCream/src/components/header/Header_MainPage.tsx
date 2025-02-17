import { useState, useEffect } from "react";
import { useChild } from "../../hooks/child/useChild";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// 알림 모달 컴포넌트 (현재 미사용)
// import NotificationModal from "../notification/NotificationModal";
// 알림 훅 (현재 미사용)
// import { useNotification } from "../../hooks/notification/useNotification";

interface HeaderProps {
  onChildSelect: (childName: string) => void;
}

const Header = ({ onChildSelect }: HeaderProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  // 알림 모달 상태 (현재 미사용)
  // const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { children, loading, handleChildSelect } = useChild(onChildSelect);
  const selectedChild = useSelector(
    (state: RootState) => state.child.selectedChild
  );

  // 알림 상태 (현재 미사용)
  // const { notifications, hasUnread, markAsRead } = useNotification();

  // 알림 클릭 핸들러 (현재 미사용)
  // const handleNotificationClick = () => {
  //   setIsNotificationModalOpen(true);
  // };

  useEffect(() => {
    if (location.pathname === "/login") {
      return;
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY < lastScrollY - 10) {
        setIsVisible(true);
      } else if (scrollY > lastScrollY + 10) {
        setIsVisible(false);
      }

      setLastScrollY(scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 rounded-b-[15px] transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between h-[52px] px-4 w-full">
          {location.pathname !== "/" && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 w-[40px] h-[40px] rounded-bl-[10px]"
              aria-label="뒤로가기"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}
          {location.pathname === "/" && <div className="w-[40px]"></div>}

          <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center">
            {isAuthenticated ? (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-[16px] font-medium text-gray-900 relative z-10"
              >
                {loading
                  ? "로딩 중..."
                  : selectedChild?.nickname ||
                    (children.length === 0 ? "등록된 아이 없음" : "자녀 선택")}
                <svg
                  className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            ) : (
              <span className="text-[16px] font-medium text-gray-900">
                아이's그림
              </span>
            )}

            {isAuthenticated && isOpen && (
              <div className="absolute top-full mt-1 w-[200px] rounded-lg bg-white py-2 shadow-lg border border-gray-200">
                {children.length > 0 ? (
                  children.map((child) => (
                    <button
                      key={child.childId}
                      className="w-full px-4 py-2 text-left text-[14px] hover:bg-gray-50"
                      onClick={() => {
                        handleChildSelect(child);
                        setIsOpen(false);
                      }}
                    >
                      {child.nickname}
                    </button>
                  ))
                ) : (
                  <p className="text-center p-2 text-gray-500">
                    등록된 아이가 없습니다
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 알림 버튼 (현재 비활성화)
          <button
            type="button"
            // onClick={handleNotificationClick}
            className="p-2 w-[40px] h-[40px] relative flex items-center justify-center"
            aria-label="알림"
          >
            <div className="relative">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {hasUnread && (
                <span
                  className="absolute right-[-10px] top-[-4px] h-2 w-2 rounded-full bg-red-500 border border-white"
                  aria-label="읽지 않은 알림"
                />
              )}
            </div>
          </button> */}
        </div>
      </header>

      {/* 알림 모달 (현재 비활성화)
      {isNotificationModalOpen && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setIsNotificationModalOpen(false)}
          onMarkAsRead={markAsRead}
        />
      )} */}
    </>
  );
};

export default Header;
