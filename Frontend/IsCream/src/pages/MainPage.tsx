import Banner from "../components/banner/Banner";
import AICard from "../components/card/AICard";
import MainCard from "../components/card/MainCard";
import MainPageBoards from "../components/board/MainPageBoard";
import Chatbot from "../components/chatbot/Chatbot"; // 챗봇 컴포넌트 import

// 이미지 import
import ParentingAttitude from "../assets/image/가족.png";
import Big5 from "../assets/image/성격검사.png";
import Map from "../assets/image/지도.png";
import Recommend from "../assets/image/교육추천.png";

const MainPage = () => {
  return (
    <>
      <div>
        <Banner />
      </div>
      <AICard />
      <div className="w-full bg-white">
        <div className="mx-auto max-w-[710px] relative">
          <div className="grid grid-cols-4 mt-2 gap-2 justify-items-center">
            <MainCard
              image={ParentingAttitude}
              title="양육태도 검사"
              to="/pat"
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
