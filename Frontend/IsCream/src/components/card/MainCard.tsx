import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface MainCardProps {
  image: string;
  title: string;
  to: string;
  requireChild?: boolean;  // 자녀 필요 여부를 prop으로 받음
  haveChild?: boolean;     // 자녀 존재 여부를 prop으로 받음
}

const MainCard = ({ image, title, to, requireChild = true, haveChild = false  }: MainCardProps) => {
  const navigate = useNavigate();
  const imageScaleClass = title === "양육태도검사" ? "scale-125" : "scale-100";

  const handleClick = (e: React.MouseEvent) => {
    if (requireChild && !haveChild) {
      e.preventDefault();  // Link의 기본 동작을 막음
      alert("자녀 등록 후 이용 가능한 서비스입니다.");
      navigate("/mypage");  // 또는 자녀 등록 페이지로 이동
      return;
    }
  };

  return (
    <Link 
      to={to} 
      className="h-full no-underline mt-2 group"
      onClick={handleClick}
    >
      <div className="w-full h-full border border-[#009E28] rounded-[15px] bg-white hover:bg-gray-50 hover:border-3 p-1 flex flex-col items-center justify-between hover:shadow-xl transition-all duration-200">
        {/* 이미지 영역 */}
        <div className="w-full flex-1 flex items-center justify-center">
          <img
            src={image}
            alt={title}
            className={`max-w-[95%] max-h-full w-auto h-auto object-contain transition-all duration-300 transform 
              ${imageScaleClass} 
              group-hover:-translate-y-2 
              group-hover:scale-110`}
          />
        </div>
        {/* 텍스트 영역 */}
        <div className="w-[99%] bg-[#009E28] rounded-[15px] flex items-center justify-center transition-transform duration-300 transform group-hover:scale-105">
          <p className="text-xl text-white sm:text-xl md:text-2xl overflow-hidden whitespace-nowrap text-ellipsis transition-all duration-300 group-hover:text-gray-100">
            {title}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MainCard;
