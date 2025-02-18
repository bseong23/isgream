import { Link } from "react-router-dom";

interface MainCardProps {
  image: string;
  title: string;
  to: string; // 라우팅을 위한 경로 prop 추가
}

const MainCard = ({ image, title, to }: MainCardProps) => {
  return (
    <Link to={to} className="w-[95%] h-full no-underline mt-2">
      <div className="w-full h-full border border-[#009E28] rounded-[15px] bg-white hover:bg-gray-50 p-1 flex flex-col items-center justify-between hover:shadow-lg transition-shadow duration-200">
        {/* 이미지 영역 */}
        <div className="w-full flex-1 flex items-center justify-center p-1">
          <img
            src={image}
            alt={title}
            className="max-w-[95%] max-h-full w-auto h-auto object-contain"
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="bg-[#009E28] w-[99%] py-0.5 rounded-[15px] flex items-center justify-center">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white overflow-hidden whitespace-nowrap text-ellipsis px-2">
            {title}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MainCard;
