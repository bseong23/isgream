import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useChild } from "../../hooks/child/useChild";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useNotification } from "../../hooks/notification/useNotification";
import NotificationModal from "../notification/NotificationModal";
import Logo from "../../assets/icons/로고.png";
import { Child } from "@/types/child";

interface HeaderProps {
  onChildSelect: (childName: string) => void;
}

const Header = ({ onChildSelect }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const { children, loading, handleChildSelect } = useChild(onChildSelect);
  const selectedChild = useSelector(
    (state: RootState) => state.child.selectedChild
  );

  const { notifications, hasUnread, refresh, markAsRead } = useNotification();

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

  const handleNotificationClick = async (notifyId: number) => {
    try {
      await markAsRead(notifyId);
      refresh();
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white shadow-md z-100 rounded-b-[15px] transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between h-[64px] sm:h-[72px] md:h-[80px] px-4 w-full max-w-7xl mx-auto">
        {/* 왼쪽: 로고 */}
        <Link to="/" className="h-full flex items-center">
          <img
            src={Logo}
            alt="로고"
            className="h-[55px] sm:h-[60px] md:h-[65px] w-auto object-contain"
          />
        </Link>

        {/* 중앙: 자녀 선택 */}
        {isAuthenticated && (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 text-[20px] font-medium text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50"
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

            {isOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[200px] rounded-lg bg-white py-2 shadow-lg border border-gray-200 z-50">
                {children.length > 0 ? (
                  children.map((child: Child) => (
                    <button
                      key={child.childId}
                      className="w-full px-4 py-2 text-left text-[16px] hover:bg-gray-50"
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
        )}

        {/* 오른쪽: 알림 아이콘 */}
        {isAuthenticated && (
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {hasUnread && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        )}

        {/* 비로그인 시 빈 공간 유지 */}
        {!isAuthenticated && <div className="w-[40px]" />}
      </div>

      {/* 알림 모달 */}
      {isNotificationOpen && (
        <div className="fixed inset-0 isolate z-[9999]">
          <NotificationModal
            notifications={notifications}
            onClose={() => setIsNotificationOpen(false)}
            onMarkAsRead={handleNotificationClick}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
