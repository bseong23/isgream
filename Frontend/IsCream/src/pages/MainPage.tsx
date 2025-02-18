import Banner from "../components/banner/Banner";
import AICard from "../components/card/AICard";
import MainCard from "../components/card/MainCard";
import MainPageBoards from "../components/board/MainPageBoard";
import Chatbot from "../components/chatbot/Chatbot"; // 챗봇 컴포넌트 import

// 이미지 import
import ParentingAttitude from "../assets/image/부모양육태도검사_카드.png";
import Big5 from "../assets/image/성격5요인검사_카드.png";
import Map from "../assets/image/지도_카드.png";
import Recommend from "../assets/image/추천교육_카드.png";

const MainPage = () => {
  return (
    <>
      <div className="mt-10">
        <Banner />
      </div>
      <AICard />
      <div className="w-full bg-white">
        <div className="mx-auto max-w-[706px] relative">
          <div className="grid grid-cols-4 mt-2 gap-1">
            <MainCard
              image={ParentingAttitude}
              title="양육태도 검사"
              to="/parenting-test"
            />
            <MainCard image={Big5} title="성격5요인 검사" to="/big5-test" />
            <MainCard image={Map} title="상담센터 찾기" to="/find-center" />
            <MainCard image={Recommend} title="추천 교육" to="/recommend" />
          </div>
        </div>
      </div>
      <div className="w-full bg-[#F9F9F9] my-8">
        <MainPageBoards />
      </div>

      {/* 챗봇 컴포넌트 추가 */}
      <Chatbot />
    </>
  );
};

export default MainPage;
