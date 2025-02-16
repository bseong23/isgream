import React from "react";
import { useNavigate } from "react-router-dom"; // 🔥 페이지 이동을 위한 import
import characterImage from "../../assets/image/character.png"; // 캐릭터 이미지
import introImage from "../../assets/image/htp_intro.png"; // HTP 검사 소개 이미지

const AiAnalysisPage: React.FC = () => {
  const navigate = useNavigate(); // 🔥 페이지 이동을 위한 훅

  return (
    <div className="w-full flex flex-col bg-white items-center">
      {/* 🔷 헤더 */}
      <div className="w-full max-w-[706px] mx-auto flex items-center justify-between px-4 bg-white flex-none h-[60px]">
        <img src={characterImage} alt="캐릭터" className="w-8 h-12" />
        <h1 className="text-lg font-bold">HTP-그림으로 보는 심리검사</h1>
        <div className="relative w-6 h-6"></div>
      </div>

      {/* 🎨 검사 소개 (이미지, 메인페이지 너비에 맞춤) */}
      <div className="w-full max-w-[706px] mx-auto flex-none">
        <img src={introImage} alt="HTP 검사 소개" className="w-full" />
      </div>

      <div className="w-full max-w-[706px] mx-auto flex flex-col px-4 mt-6">
        <div className="bg-white flex flex-col justify-center">
          <div className="flex justify-between items-center text-gray-700 w-full">
            <p className="flex items-center">
              <i className="fas fa-pencil-alt mr-2"></i> 검사 구성
            </p>
            <p className="text-gray-400">그림 그리기</p>
          </div>
          <div className="flex justify-between items-center text-gray-700 w-full mt-4">
            <p className="flex items-center">
              <i className="fas fa-clock mr-2"></i> 소요 시간
            </p>
            <p className="text-gray-400">최대 60분</p>
          </div>
          <div className="flex justify-between items-center text-gray-700 w-full mt-4">
            <p className="flex items-center">
              <i className="fas fa-file-alt mr-2"></i> 결과지 보유 기간
            </p>
            <p className="text-gray-400">검사 후 1년</p>
          </div>
          <div className="flex justify-between items-center text-gray-700 w-full mt-4">
            <p className="flex items-center">
              <i className="fas fa-user mr-2"></i> 검사 대상
            </p>
            <p className="text-gray-400">자녀</p>
          </div>
        </div>
      </div>
      
      {/* 🎨 버튼 그룹 */}
      <div className="w-full max-w-[706px] mx-auto flex justify-around py-4 flex-none mt-6">
        <button 
          className="w-[45%] h-[50px] bg-[#009E28] text-white rounded-lg text-lg shadow-md"
          onClick={() => navigate("/photo-capture")} // ✅ 사진 촬영 안내 페이지로 이동
        >
          사진 촬영
        </button>
        <button 
          className="w-[45%] h-[50px] bg-[#009E28] text-white rounded-lg text-lg shadow-md"
          onClick={() => navigate("/htp")} // ✅ 직접 그리기로 이동
        >
          직접 그리기
        </button>
      </div>

      {/* 📝 검사 정보 복구됨! */}

    </div>
  );
};

export default AiAnalysisPage;
