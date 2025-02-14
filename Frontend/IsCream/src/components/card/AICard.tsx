import { Link } from "react-router-dom";
import AIRobot from "../../assets/image/AI그림-removebg-preview.png";

const AICard = () => {
  return (
    <div className="w-full bg-white mt-4">
      <div className="mx-auto max-w-[706px] relative">
        <Link to="/ai-analysis" className="no-underline">
          <div className="relative w-full border border-[#009E28] rounded-[20px] bg-white p-1 hover:bg-gray-50 flex hover:shadow-lg transition-shadow duration-200">
            {/* 왼쪽 이미지 영역: 50% */}
            <div className="w-1/2 flex items-center justify-center">
              <img
                src={AIRobot}
                alt="AI 로봇"
                className="w-full h-auto object-contain transform scale-90"
              />
            </div>

            {/* 오른쪽 텍스트 영역: 50% */}
            <div className="w-1/2 flex flex-col items-center justify-center text-center">
              <div className="bg-[#009E28] text-white rounded-lg w-[80%] md:w-[70%] lg:w-[60%] p-1">
                <p className="text-xs md:text-sm lg:text-base font-bold">
                  AI가 해주는
                </p>
                <p className="text-xs md:text-sm lg:text-base font-bold">
                  그림 심리 분석
                </p>
              </div>
              <p className="text-gray-700 text-xs md:text-sm lg:text-base mt-4 leading-relaxed">
                그림을 그리거나 업로드 하면
                <br />
                아이의 감정을 분석해드려요
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AICard;
