// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { chatService } from '../services/chatService';
// import { ChatMessage, ChatRoom } from '../types/chat';
// const { VITE_BASE_API } = import.meta.env;


// interface ChatContextType {
//   chatRooms: ChatRoom[];
//   currentRoom: {
//     messages: ChatMessage[];
//     profileUrl: string;
//   } | null;
//   sendMessage: (roomId: number, content: string) => Promise<void>;
//   createRoom: (opponentId: number) => Promise<void>;
//   leaveRoom: (roomId: number) => Promise<void>;
//   enterRoom: (roomId: number) => Promise<void>;
//   loading: boolean;
//   error: string | null;
// }

// const ChatContext = createContext<ChatContextType | null>(null);

// export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [socket, setSocket] = useState<WebSocket | null>(null);
//   const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
//   const [currentRoom, setCurrentRoom] = useState<ChatContextType['currentRoom']>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // WebSocket 연결 설정
//     const ws = new WebSocket('ws://localhost:3001');

//     ws.onopen = () => {
//       console.log('Connected to WebSocket server');
//     };

//     ws.onmessage = async (event) => {
//       const data = JSON.parse(event.data);
//       if (data.type === 'NEW_MESSAGE') {
//         // 채팅방 목록 새로고침
//         await fetchChatRooms();
        
//         // 현재 열려있는 채팅방이 있다면 메시지 목록 업데이트
//         if (currentRoom && data.roomId === currentRoom.roomId) {
//           await enterRoom(data.roomId);
//         }
//       }
//     };

//     setSocket(ws);

//     return () => {
//       ws.close();
//     };
//   }, []);

//   // 채팅방 목록 조회
//   const fetchChatRooms = async () => {
//     try {
//       setLoading(true);
//       const response = await chatService.getChatRooms();
//       if (response.code === 'S0000') {
//         setChatRooms(response.data || []);
//       }
//     } catch (err) {
//       setError('채팅방 목록을 불러오는데 실패했습니다.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 채팅방 입장
//   const enterRoom = async (roomId: number) => {
//     try {
//       setLoading(true);
//       const response = await chatService.getChatRoomDetail(roomId);
//       if (response.code === 'S0000' && response.data) {
//         setCurrentRoom({
//           messages: response.data.chats,
//           profileUrl: response.data.profileUrl
//         });
//       }
//     } catch (err) {
//       setError('채팅방을 불러오는데 실패했습니다.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 메시지 전송
//   const sendMessage = async (roomId: number, content: string) => {
//     try {
//       const response = await chatService.sendMessage(roomId, { content });
//       if (response.code === 'S0000') {
//         // 웹소켓을 통해 서버에 새 메시지 알림
//         socket?.send(JSON.stringify({
//           type: 'NEW_MESSAGE',
//           roomId,
//           content
//         }));
//       }
//     } catch (err) {
//       setError('메시지 전송에 실패했습니다.');
//     }
//   };

//   // 채팅방 생성
//   const createRoom = async (opponentId: number) => {
//     try {
//       const response = await chatService.createRoom({ opponentId });
//       if (response.code === 'S0000') {
//         await fetchChatRooms();
//       }
//     } catch (err) {
//       setError('채팅방 생성에 실패했습니다.');
//     }
//   };

//   // 채팅방 나가기
//   const leaveRoom = async (roomId: number) => {
//     try {
//       const response = await chatService.leaveRoom(roomId);
//       if (response.code === 'S0000') {
//         setCurrentRoom(null);
//         await fetchChatRooms();
//       }
//     } catch (err) {
//       setError('채팅방 나가기에 실패했습니다.');
//     }
//   };

//   // 컴포넌트 마운트 시 채팅방 목록 조회
//   useEffect(() => {
//     fetchChatRooms();
//   }, []);

//   return (
//     <ChatContext.Provider 
//       value={{ 
//         chatRooms, 
//         currentRoom, 
//         sendMessage, 
//         createRoom, 
//         leaveRoom, 
//         enterRoom,
//         loading,
//         error
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error('useChat must be used within a ChatProvider');
//   }
//   return context;
// };