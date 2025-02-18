import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { chatApi } from "../../api/chat";
import { Client } from '@stomp/stompjs';

let stompClient: Client | null = null;
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { chatApi } from "../../api/chat";

interface ChatMessage {
  id: string;
  roodId: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  read: boolean;
}
// interface ChatMessage {
//   messageId: number;
//   senderId: number;
//   message: string;
//   timestamp: string;
// }

interface ChatRoomData {
  chats: ChatMessage[];
}
// interface ChatRoomData {
//   profileUrl: string;
//   chats: ChatMessage[];
// }

// interface ChatApiResponse {
//   code: string;
//   message: string;
//   data: ChatRoomData;
// }

// const ChatRoomPage = () => {
//   const { roomId } = useParams();
//   const navigate = useNavigate();
//   const [newMessage, setNewMessage] = useState("");
//   const [chatData, setChatData] = useState<ChatRoomData | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeChatRoom = async () => {
      if(!roomId) return;

      try {
        // 1. 채팅방 입장 및 초기 메시지 로드
        const response = await chatApi.openChatroom(roomId, 0);
        setChatData(response.data);
        console.log("ChatRoomPage / 챗데이터: ", chatData);
        
        // 2. 웹소켓 연결
        await chatApi.connectChatroom(roomId);
        setIsConnected(true);
//   useEffect(() => {
//     const initializeChatRoom = async () => {
//       try {
//         // 1. 채팅방 입장 및 초기 메시지 로드
//         const response = await chatApi.openChatroom(roomId, 1);
//         setChatData(response.data);

//         // 2. 웹소켓 연결
//         await chatApi.connectChatroom();
//         setIsConnected(true);

        // 3. 채팅방 구독
        await chatApi.subscribeChatroom(roomId, (message) => {
          setChatData(prevData => {
            if (!prevData) return { chats: [message], profileUrl: '' };
            return {
              ...prevData,
              chats: [...prevData.chats, message]
            };
          });
        });
//         // 3. 채팅방 구독
//         await chatApi.subscribeChatroom();

        // 4. 읽지 않은 메시지 처리
        // await chatApi.ackMessage();
//         // 4. 읽지 않은 메시지 처리
//         await chatApi.ackMessage();

//       } catch (error) {
//         console.error("채팅방 초기화 실패:", error);
//         // 에러 처리 (예: 에러 메시지 표시, 이전 페이지로 이동 등)
//       }
//     };

//     initializeChatRoom();

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
//     // 컴포넌트 언마운트 시 cleanup
//     return () => {
//       // 웹소켓 연결 해제 등의 cleanup 로직
//     };
//   }, [roomId]);
//   console.log(roomId);
//   // 더미 데이터
//   // const dummyData: ChatApiResponse = {
//   //   code: "S0000",
//   //   message: "success",
//   //   data: {
//   //     profileUrl: "/default-profile.png",
//   //     chats: [
//   //       {
//   //         messageId: 1,
//   //         senderId: 1,
//   //         message: "안녕하세요~~",
//   //         timestamp: "2024-02-10T10:00:00Z"
//   //       },
//   //       {
//   //         messageId: 2,
//   //         senderId: 2,
//   //         message: "안녕하세요^~^",
//   //         timestamp: "2024-02-10T10:01:00Z"
//   //       },
//   //       {
//   //         messageId: 3,
//   //         senderId: 1,
//   //         message: "작성하신 글 보고 연락드려요~~",
//   //         timestamp: "2024-02-10T10:02:00Z"
//   //       },
//   //       {
//   //         messageId: 4,
//   //         senderId: 2,
//   //         message:
//   //           "아 그러시군요~~ HTTP 강사 해봤는데, 재미도 있고 도움도 되고 좋았어요 ^^",
//   //         timestamp: "2024-02-10T10:03:00Z"
//   //       }
//   //     ]
//   //   }
//   // };

//   // // 테스트를 위해 더미 데이터 사용
//   // useEffect(() => {
//   //   setChatData(dummyData.data);
//   // }, []);

//   const handleSendMessage = async () => {
//     if (newMessage.trim() && isConnected) {
//       try {
//         await chatApi.sendMessage(roomId, newMessage);
//         setNewMessage("");
//       } catch (error) {
//         console.error("메시지 전송 실패:", error);
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-white">
//       {/* 헤더 */}
//       <header className="flex items-center p-4 border-b">
//         <button onClick={() => navigate(-1)} className="p-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 19l-7-7 7-7"
//             />
//           </svg>
//         </button>
//         <h1 className="text-xl font-semibold ml-4">대화상대</h1>
//       </header>

//       {/* 메시지 목록 */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {chatData?.chats.map((chat) => (
//           <div
//             key={chat.messageId}
//             className={`flex ${chat.senderId === 2 ? "justify-end" : "justify-start"}`}
//           >
//             {chat.senderId !== 2 && (
//               <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
//                 <img
//                   src={chatData.profileUrl}
//                   alt="프로필"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             )}
//             <div
//               className={`max-w-[70%] p-3 rounded-lg ${
//                 chat.senderId === 2
//                   ? "bg-white text-black border"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {chat.message}
//             </div>
//           </div>
//         ))}
//       </div>

      {/* 메시지 입력 */}
      <div className="border-t p-4 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 border rounded-lg p-2 mr-2"
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          전송
        </button>
      </div>
    </div>
  );
};
//       {/* 메시지 입력 */}
//       <div className="border-t p-4 flex items-center">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="메시지를 입력하세요"
//           className="flex-1 border rounded-lg p-2 mr-2"
//         />
//         <button
//           onClick={handleSendMessage}
//           className="bg-green-500 text-white px-4 py-2 rounded-lg"
//         >
//           전송
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatRoomPage;
