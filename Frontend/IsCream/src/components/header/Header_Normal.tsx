import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/icons/로고.png";
import { useNotification } from "../../hooks/notification/useNotification";
import NotificationModal from "../notification/NotificationModal";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const { notifications, hasUnread, markAsRead, refresh } = useNotification();

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
      className={`fixed top-0 left-0 w-full bg-white shadow-md z-50 rounded-b-[15px] transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="relative flex items-center justify-between h-[64px] sm:h-[72px] md:h-[80px] px-4 w-full max-w-7xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="p-2 w-[44px] h-[44px] rounded-bl-[10px]"
          aria-label="뒤로가기"
        >
          <svg
            width="24"
            height="24"
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

        {/* 로고 - 중앙 정렬 유지 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link to="/">
            <img
              src={Logo}
              alt="로고"
              className="h-[42px] sm:h-[46px] md:h-[50px] w-auto object-contain"
            />
          </Link>
        </div>

        {/* 알림 아이콘 - 오른쪽 */}
        {isAuthenticated && (
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 w-[44px] h-[44px] rounded-br-[10px] relative"
            aria-label="알림"
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
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        )}

        {/* 비로그인 시 빈 공간 유지 */}
        {!isAuthenticated && <div className="w-[44px]" />}
      </div>

      {/* 알림 모달 */}
      {isNotificationOpen && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setIsNotificationOpen(false)}
          onMarkAsRead={handleNotificationClick}
        />
      )}
    </header>
  );
};

export default Header;
