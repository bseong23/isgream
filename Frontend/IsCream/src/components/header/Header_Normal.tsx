import { useState, useEffect } from "react";

// interface HeaderProps {
//   // 알림 클릭 핸들러 (현재 미사용)
//   onNotificationClick?: () => void;
// }

// {* onNotificationClick */}: HeaderProps

const Header = () => {
  // 알림 상태 (현재 미사용)
  // const [hasUnreadNotification /*setHasUnreadNotification*/] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 🔥 스크롤 이벤트 추가 (빠르게 올릴 경우 바로 헤더 표시)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // 🔥 기존 lastScrollY보다 10px 이상 올리면 헤더 표시
      if (scrollY < lastScrollY - 10) {
        setIsVisible(true);
      }
      // 🔥 스크롤을 내릴 때는 바로 숨김
      else if (scrollY > lastScrollY + 10) {
        setIsVisible(false);
      }

      setLastScrollY(scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 rounded-b-[15px] transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between h-[52px] px-4 w-full">
        {/* 🔥 뒤로가기 버튼 (onBackClick 제거) */}
        <button
          type="button"
          onClick={() => window.history.back()} // 기본 브라우저 뒤로가기
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

        {/* 제목 */}
        <h1 className="flex-1 text-center text-base font-medium text-gray-900">
          아이's 그림
        </h1>

        {/* 알림 버튼 (현재 비활성화) */}
        {/* <button
          type="button"
          onClick={onNotificationClick}
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
            {hasUnreadNotification && (
              <span
                className="absolute right-[-10px] top-[-4px] h-2 w-2 rounded-full bg-red-500 border border-white"
                aria-label="읽지 않은 알림"
              />
            )}
          </div>
        </button> */}
      </div>
    </header>
  );
};

export default Header;
