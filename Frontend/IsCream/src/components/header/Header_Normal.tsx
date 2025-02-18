import { useState, useEffect } from "react";
import Logo from "../../assets/icons/로고.png";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

        {/* 로고 - 중앙 정렬 */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={Logo}
            alt="로고"
            className="h-[56px] sm:h-[60px] md:h-[64px] w-auto object-contain"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
