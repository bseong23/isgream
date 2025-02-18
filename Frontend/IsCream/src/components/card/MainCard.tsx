import { Link } from "react-router-dom";

interface MainCardProps {
  image: string;
  title: string;
  to: string;
}

const MainCard = ({ image, title, to }: MainCardProps) => {
  // 양육태도검사일 경우 더 큰 스케일 적용
  const imageScaleClass =
    title === "양육태도검사"
      ? "scale-140" // 기본 스케일을 125%로 고정
      : "scale-100"; // 다른 카드들은 기본 크기 유지

  return (
    <Link to={to} className="h-full no-underline mt-2 group">
      <div className="w-full h-full border border-[#009E28] rounded-[15px] bg-white hover:bg-gray-50 hover:border-3 p-1 flex flex-col items-center justify-between hover:shadow-xl transition-all duration-200">
        {/* 이미지 영역 */}
        <div className="w-full flex-1 flex items-center justify-center p-">
          <img
            src={image}
            alt={title}
            className={`max-w-[95%] max-h-full w-auto h-auto object-contain transition-transform duration-300 transform ${imageScaleClass}`}
          />
        </div>
        {/* 텍스트 영역 */}
        <div className="w-[99%] bg-[#009E28] rounded-[15px] flex items-center justify-center transition-transform duration-300 transform group-hover:scale-105">
          <p className="text-[15px] text-white sm:text-sm md:text-xl overflow-hidden whitespace-nowrap text-ellipsis transition-all duration-300 group-hover:text-gray-100">
            {title}
          </p>
        </div>
      </div>
    </Link>
  );
};
export default MainCard;
