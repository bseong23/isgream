import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { chatApi } from "../../api/chat";
import { Client } from '@stomp/stompjs';

let stompClient: Client | null = null;

interface ChatRoomData {
  chats: ChatMessage[];
}

interface ChatMessage {
  id: string;
  roomId: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface ChatApiResponse {
  code: string;
  message: string;
  data: ChatRoomData;
}

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [chatData, setChatData] = useState<ChatRoomData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const decodeToken = (token: string) => {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (error) {
      console.error('토큰 디코딩 실패:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log("내가바로토큰이다 ", token);
    
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken?.userId) {
        setCurrentUserId(decodedToken.userId);
        console.log("디코딩된 토큰:", decodedToken);
        console.log("현재 유저 ID:", decodedToken.userId);
      }
    }
  }, []);

  useEffect(() => {
    const initializeChatRoom = async () => {
      if(!roomId) return;

      try {
        setIsLoading(true);
        // 1. 채팅방 입장 및 초기 메시지 로드
        const response = await chatApi.openChatroom(roomId, 0);
        if (response.data && response.data.length > 0) {
          console.log("첫 번째 메시지의 sender:", response.data[0].sender);
          console.log("첫 번째 메시지의 receiver:", response.data[0].receiver);
        }
        setChatData({chats: response.data});
        
        // 2. 웹소켓 연결
        const token = localStorage.getItem("access");
        console.log("token: ", token);
        
        await chatApi.connectChatroom(roomId, token);
        setIsConnected(true);

        // 3. 채팅방 구독
        await chatApi.subscribeChatroom(roomId, (message) => {
          setChatData(prevData => {
            if (!prevData) return { chats: [message] };
            return {
              ...prevData,
              chats: [...prevData.chats, message]
            };
          });
        });
      } catch (error) {
        console.error("채팅방 초기화 실패:", error);
        alert("채팅방 연결에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeChatRoom();

    // 컴포넌트 언마운트 시 cleanup
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [roomId, navigate]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected || !roomId) return;
    
    try {
      await chatApi.sendMessage(roomId, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      alert("메시지 전송에 실패했습니다.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-white items-center justify-center">
        <div className="text-gray-500">채팅방을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatData?.chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex ${chat.sender == currentUserId ? "justify-end" : "justify-start"}`}
          >
            <div>
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  chat.sender == currentUserId
                    ? "bg-white text-black border"
                    : "bg-green-500 text-white"
                }`}
              >
                {chat.content}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {chat.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 메시지 입력 */}
      <div className="fixed bottom-20 w-full p-4 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요"
          className="flex-1 border rounded-lg p-2 mr-2"
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected}
          className="bg-green-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPage;