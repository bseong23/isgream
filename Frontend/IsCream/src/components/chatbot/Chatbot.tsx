import React from "react";
import { Send } from "lucide-react";
import { useChatbot } from "../../hooks/chatbot/useChatbot";
import chatbotImage from "../../assets/image/chatbot.png";
import Spinner from "../spinner";

// 방방 뛰는 애니메이션을 위한 CSS 추가
const bounceAnimation = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
`;

const Chatbot: React.FC = () => {
  const {
    isOpen,
    query,
    messages,
    isLoading,
    error,
    setQuery,
    sendQuery,
    toggleChatbot
  } = useChatbot();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      sendQuery();
    }
  };

  return (
    <>
      {/* 애니메이션 스타일 추가 */}
      <style>{bounceAnimation}</style>

      <div className="fixed right-3 bottom-15 sm:right-6 sm:bottom-20 z-10 flex flex-col items-center">
        {/* 말풍선 (작은 화면에서는 숨김) */}
        {/* {!isOpen && (
          <div className="relative mb-2 sm:mb-3 hidden sm:block">
            <div className="bg-white border border-gray-300 p-2 rounded-lg shadow-lg text-sm font-medium relative w-[150px] sm:w-auto text-center">
              <p className="text-[#009E28] font-bold">안녕하세요!</p>
              <p>궁금한 걸 물어보세요!</p>
              <div
                className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 
                border-l-8 border-l-transparent 
                border-r-8 border-r-transparent 
                border-t-8 border-t-gray-300"
              ></div>
              <div
                className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 
                border-l-7 border-l-transparent 
                border-r-7 border-r-transparent 
                border-t-7 border-t-white"
              ></div>
            </div>
          </div>
        )} */}

        {/* 방방 뛰는 곰 버튼 */}
        {!isOpen && (
          <button
            onClick={toggleChatbot}
            className="w-15 h-20 sm:w-20 sm:h-25 hover:scale-110 transition-transform animate-[bounce_2s_infinite]"
          >
            <img
              src={chatbotImage}
              alt="챗봇"
              className="w-full h-full object-cover"
            />
          </button>
        )}

        {/* 챗봇 UI */}
        {isOpen && (
          <div className="relative w-[90vw] max-w-[350px] h-[70vh] max-h-[500px] bg-white border border-[#009E28] rounded-2xl shadow-xl flex flex-col overflow-hidden">
            {/* 챗봇 헤더 */}
            <div className="bg-[#009E28] text-white p-3 rounded-t-2xl flex justify-between items-center">
              <h2 className="font-bold text-lg">챗봇</h2>
              <button
                onClick={toggleChatbot}
                className="hover:bg-green-700 rounded-full p-1"
              >
                ×
              </button>
            </div>

            {/* 메시지 영역 */}
            <div className="flex-grow overflow-y-auto p-3 space-y-2 bg-[#F7FFF0]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                   relative p-3 rounded-xl max-w-[70%] 
                   ${
                     msg.sender === "user"
                       ? "bg-[#009E28] text-white"
                       : "bg-green-500 text-white"
                   }
                 `}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center justify-center space-x-2 text-gray-500 py-2">
                  <Spinner />
                  <span className="text-sm">답변을 생성하고 있어요...</span>
                </div>
              )}

              {error && (
                <div className="text-red-500 bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}
            </div>

            {/* 입력창 */}
            <div className="p-3 border-t flex bg-white">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                placeholder="메시지를 입력하세요"
                className="flex-grow p-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-[#009E28] disabled:opacity-50 text-sm sm:text-base"
              />
              <button
                onClick={sendQuery}
                disabled={isLoading}
                className="bg-[#009E28] text-white p-2 rounded-r-full hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;
