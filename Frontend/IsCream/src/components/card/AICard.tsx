import { Link } from "react-router-dom";
import AIRobot from "../../assets/image/그림검사.png";

const AICard = () => {
  return (
    <div className="w-full bg-white mt-4">
      <div className="mx-auto max-w-[706px] relative">
        <Link to="/ai-analysis" className="no-underline group">
          <div className="relative w-full border border-[#009E28] rounded-[20px] bg-white hover:border-3 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 p-6">
            <div className="flex items-center">
              {/* 왼쪽 이미지 영역: 45% */}
              <div className="w-[45%] flex items-center justify-center py-2">
                <img
                  src={AIRobot}
                  alt="AI 로봇"
                  className="w-full h-auto object-contain transition-transform duration-300 transform hover:scale-110 group-hover:scale-110"
                />
              </div>

              {/* 오른쪽 텍스트 영역: 55% */}
              <div className="w-[55%] flex flex-col items-center justify-center text-center space-y-4 transition-transform duration-300 transform group-hover:scale-105">
                <div className="bg-[#009E28] text-white rounded-xl w-[80%] py-2 px-2 transition-all duration-300">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
                    AI가 해주는
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">
                    그림 심리 분석
                  </p>
                </div>
                <div className="rounded-xl w-[90%] py-1">
                  <p className="text-gray-700 text-md sm:text-lg md:text-xl leading-relaxed mb-2 transition-all duration-300 group-hover:text-gray-900">
                    비싼 가격과 부정적인 시선 더 이상 그만!
                  </p>
                  <p className="text-gray-700 text-md sm:text-lg md:text-xl leading-relaxed mb-2 transition-all duration-300 group-hover:text-gray-900">
                    이제 무료로 간편하게
                  </p>
                  <p className="text-gray-700 text-md sm:text-lg md:text-xl leading-relaxed mb-4 transition-all duration-300 group-hover:text-gray-900">
                    우리 아이의 마음을 이해해보세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AICard;
