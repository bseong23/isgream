import Banner from "../components/banner/Banner";
import AICard from "../components/card/AICard";
import MainCard from "../components/card/MainCard";
import MainPageBoards from "../components/board/MainPageBoard";
import Chatbot from "../components/chatbot/Chatbot"; // 챗봇 컴포넌트 import
import { childApi } from "../api/child";
import { useEffect } from "react";

// 이미지 import
import ParentingAttitude from "../assets/image/가족.png";
import Big5 from "../assets/image/성격검사.png";
import Map from "../assets/image/지도.png";
import Recommend from "../assets/image/교육추천.png";
import { useState } from "react";

const MainPage = () => {
  const [haveChild, setHaveChild] = useState(false);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await childApi.getChildren();
        // 배열의 길이로 자녀 유무 확인
        setHaveChild(response.length > 0);
      } catch (error) {
        console.error("자녀 목록 조회 실패:", error);
      }
    };

    fetchChildren();
  }, []);

    // MainCard 컴포넌트에 조건부 이동 로직 추가
    const handleCardClick = (path: string) => {
      if (!haveChild) {
        alert("자녀 등록 후 이용 가능한 서비스입니다.");
        // 자녀 등록 페이지로 이동하거나 다른 처리
        return false;
      }
      return true;
    };

  return (
    <>
      <div>
        <Banner 
          requireChild={true} 
          haveChild={haveChild} 
        />
      </div>
      <AICard 
        requireChild={true} 
        haveChild={haveChild} 
      />
      <div className="w-full bg-white">
        <div className="mx-auto max-w-[706px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-2">
            <MainCard
              image={ParentingAttitude}
              title="양육태도 검사"
              to="/pat"
              requireChild={false}
              haveChild={haveChild}
            />
            <MainCard 
              image={Big5} 
              title="성격5요인 검사" 
              to="/big5-test"
              requireChild={true}
              haveChild={haveChild}
            />
            <MainCard 
              image={Map} 
              title="상담센터 찾기" 
              to="/find-center"
              requireChild={false}  // 이 서비스는 자녀가 없어도 사용 가능
            />
            <MainCard 
              image={Recommend} 
              title="추천 교육" 
              to="/recommend"
              requireChild={true}
              haveChild={haveChild}
            />
            {/* <MainCard
              image={ParentingAttitude}
              title="양육태도 검사"
              to="/pat"
            />
            <MainCard image={Big5} title="성격5요인 검사" to="/big5-test" />
            <MainCard image={Map} title="상담센터 찾기" to="/find-center" />
            <MainCard image={Recommend} title="추천 교육" to="/recommend" /> */}
          </div>
        </div>
      </div>
      <div className="w-full bg-[#F9F9F9] my-8">
        <MainPageBoards />
      </div>
      <Chatbot />
    </>
  );
};

export default MainPage;
