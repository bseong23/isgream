import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import boardIcon from "../../assets/icons/nav_board.png";
import calendarIcon from "../../assets/icons/nav_calander.png";
import homeIcon from "../../assets/icons/nav_home.png";
import chatIcon from "../../assets/icons/nav_chat.png";
import mypageIcon from "../../assets/icons/nav_mypage.png";
import boardActiveIcon from "../../assets/icons/nav_active_board.png";
import calendarActiveIcon from "../../assets/icons/nav_active_calander.png";
import homeActiveIcon from "../../assets/icons/nav_active_home.png";
import chatActiveIcon from "../../assets/icons/nav_active_chat.png";
import mypageActiveIcon from "../../assets/icons/nav_active_mypage.png";

interface NavItem {
  id: string;
  path: string;
  icon: string;
  activeIcon: string;
  label: string;
}

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const excludePaths: string[] = ["/htp", "/photo-capture"];

  if (excludePaths.includes(currentPath)) return null;

  const navItems: NavItem[] = [
    {
      id: "board",
      path: "/board",
      icon: boardIcon,
      activeIcon: boardActiveIcon,
      label: "게시판"
    },
    {
      id: "calendar",
      path: "/calendar",
      icon: calendarIcon,
      activeIcon: calendarActiveIcon,
      label: "일정"
    },
    {
      id: "home",
      path: "/",
      icon: homeIcon,
      activeIcon: homeActiveIcon,
      label: "홈"
    },
    {
      id: "chat",
      path: "/chat",
      icon: chatIcon,
      activeIcon: chatActiveIcon,
      label: "채팅"
    },
    {
      id: "mypage",
      path: "/mypage",
      icon: mypageIcon,
      activeIcon: mypageActiveIcon,
      label: "마이페이지"
    }
  ];

  const isActiveRoute = (itemPath: string) => {
    // 홈 경로(/)는 정확히 일치할 때만 활성화
    if (itemPath === "/") {
      return currentPath === "/";
    }
    // 다른 경로들은 startsWith로 체크
    return currentPath.startsWith(itemPath);
  };

  return (
    <nav className="fixed bottom-0 pt-1rem left-0 w-full bg-white border-gray-200 shadow-[0_-4px_4px_0_rgba(0,0,0,0.05)] rounded-t-[15px]">
      <div className="max-w-screen-sm mx-auto h-full">
        <div className="flex justify-between items-center h-full px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`flex flex-col items-center justify-center p-2
               ${isActiveRoute(item.path) ? "bg-white" : "hover:bg-white cursor-pointer"}`}
              onClick={() => navigate(item.path)}
              type="button"
            >
              <img
                src={isActiveRoute(item.path) ? item.activeIcon : item.icon}
                alt={item.label}
                className={`w-6 h-6 mb-1`}
              />
              <span
                className={`text-xs font-medium 
               ${isActiveRoute(item.path) ? "text-[#009E28]" : "text-gray-500"}`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
