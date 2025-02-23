import { Link, useNavigate } from "react-router-dom";
import AIRobot from "../../assets/image/그림검사.png";

interface AICardProps {
  requireChild?: boolean;
  haveChild?: boolean;
}

const AICard = ({ requireChild = true, haveChild = false }: AICardProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (requireChild && !haveChild) {
      e.preventDefault();
      alert("자녀 등록 후 이용 가능한 서비스입니다.");
      navigate("/mypage");
      return;
    }
  };

  return (
    <div className="w-full bg-white mt-4">
      <div className="mx-auto max-w-[706px] relative">
        <Link to="/ai-analysis" className="no-underline group" onClick={handleClick}>
          {/* 고정된 높이와 최소 높이를 설정하고, 오버플로우 관리 */}
          <div className="relative w-full border border-[#009E28] rounded-[20px] bg-white hover:border-3 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 p-6">
            <div className="flex items-center">
              {/* 왼쪽 이미지 영역 */}
              <div className="w-[45%] flex items-center justify-center py-2">
                <img
                  src={AIRobot}
                  alt="AI 로봇"
                  className="w-full h-auto object-contain transition-all duration-300 transform 
          group-hover:-translate-y-2 
          group-hover:scale-115"
                />
              </div>

              {/* 오른쪽 텍스트 영역 */}
              <div className="w-[55%] flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-[#009E28] text-white rounded-xl w-[80%] py-2 px-2">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    AI가 해주는
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                    그림 심리 분석
                  </p>
                </div>
                <div className="rounded-xl w-[90%]">
                  <p className="text-gray-700 text-md sm:text-lg md:text-xl mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                    비싼 가격과 부정적인 시선 더 이상 그만!
                  </p>
                  <p className="text-gray-700 text-md sm:text-lg md:text-xl mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                    이제 무료로 간편하게
                  </p>
                  <p className="text-gray-700 text-md sm:text-lg md:text-xl mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
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
