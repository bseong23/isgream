import { useState, useEffect } from "react";
import { useChild } from "../../hooks/child/useChild";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useLocation } from "react-router-dom";
import Logo from "../../assets/icons/로고.png";

interface HeaderProps {
  onChildSelect: (childName: string) => void;
}

const Header = ({ onChildSelect }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { children, loading, handleChildSelect } = useChild(onChildSelect);
  const selectedChild = useSelector(
    (state: RootState) => state.child.selectedChild
  );

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
    <header
      className={`fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 rounded-b-[15px] transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="relative flex items-center justify-center h-[80px] sm:h-[80px] md:h-[100px] px-4 w-full">
        {/* 로고와 자녀 선택을 감싸는 컨테이너 */}
        <div className="items-center gap-3">
          {/* 로고 */}
          <img
            src={Logo}
            alt="로고"
            className="h-[52px] sm:h-[56px] md:h-[60px] w-auto object-contain"
          />

          {/* 자녀 선택 드롭다운 */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 ml-4 text-[16px] font-medium text-gray-900"
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
                <div className="absolute left-0 top-full mt-1 w-[200px] rounded-lg bg-white py-2 shadow-lg border border-gray-200">
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
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
