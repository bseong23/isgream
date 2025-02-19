import { Link } from "react-router-dom";

interface MainCardProps {
  image: string;
  title: string;
  to: string;
}

const MainCard = ({ image, title, to }: MainCardProps) => {
  const imageScaleClass = title === "양육태도검사" ? "scale-125" : "scale-100";

  return (
    <Link to={to} className="h-full no-underline mt-2 group">
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
