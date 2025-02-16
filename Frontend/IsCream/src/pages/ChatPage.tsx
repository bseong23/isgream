
const ChatPage = () => {
  return(
    <div>
      채팅페이지
    </div>
  );
};
export default ChatPage;

// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import ChatRoomItem from "../components/chat/ChatRoomItem";
// import { chatApi } from "../api/chat";

// interface ChatRoom {
//   roomId: number;
//   profileUrl: string;
//   opponentName: string;
//   newMessageCount: number;
//   lastMessageTime: string;
// }

// const ChatPage = () => {
  
//   const navigate = useNavigate();
  // const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // const fetchChatRooms = async () => {
  //   try{
  //     console.log("채팅방 목록 조회하러간당");
      
  //     setIsLoading(true);
  //     const response = await chatApi.getChatList();
  //     console.log(response);
  //     setChatRooms(response);

  //   }catch (error) {
  //     console.log("채팅방 목록을 불러오는데 실패했습니다.");
  //   }finally{
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchChatRooms();
  // }, []);

  // if(isLoading) {
  //   return(
  //     <div className="flex flex-col h-screen bg-white items-center justify-center">
  //       <div className="text-gray-500">로딩중...</div>
  //     </div>
  //   )
  // }

  // if (error) {
  //   return (
  //     <div className="flex flex-col h-screen bg-white items-center justify-center">
  //       <div className="text-red-500">{error}</div>
  //       <button 
  //         onClick={fetchChatRooms}
  //         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  //       >
  //         다시 시도
  //       </button>
  //     </div>
  //   );
  // }
  
  
  
  // return (
  //   <div className="flex flex-col h-screen bg-white">
  //     <div className="flex-1 overflow-y-auto">
  //       수정중...
  //     {chatRooms.length === 0 ? (
  //         <div className="flex items-center justify-center h-full text-gray-500">
  //           채팅방이 없습니다.
  //         </div>
  //       ) : (
  //         chatRooms.map((room) => (
  //           <ChatRoomItem
  //             key={room.roomId}
  //             {...room}
  //             onClick={() => navigate(`/chat/room/${room.roomId}`)}
  //           />
  //         ))
  //       )}
  //     </div>
  //   </div>
//   );
// };

// export default ChatPage;

// const dummyChatRooms: ChatRoom[] = [
//   {
//     roomId: 1,
//     profileUrl: "/default-profile.png",
//     opponentName: "박준영",
//     newMessageCount: 2,
//     lastMessageTime: new Date().toISOString() // 현재 시간 (방금 전)
//   },
//   {
//     roomId: 2,
//     profileUrl: "/default-profile.png",
//     opponentName: "김민수",
//     newMessageCount: 0,
//     lastMessageTime: new Date(Date.now() - 30 * 60000).toISOString() // 30분 전
//   },
//   {
//     roomId: 3,
//     profileUrl: "/default-profile.png",
//     opponentName: "이서연",
//     newMessageCount: 5,
//     lastMessageTime: new Date(Date.now() - 3 * 3600000).toISOString() // 3시간 전
//   },
//   {
//     roomId: 4,
//     profileUrl: "/default-profile.png",
//     opponentName: "최유진",
//     newMessageCount: 1,
//     lastMessageTime: new Date(Date.now() - 2 * 24 * 3600000).toISOString() // 2일 전
//   },
//   {
//     roomId: 5,
//     profileUrl: "/default-profile.png",
//     opponentName: "정현우",
//     newMessageCount: 0,
//     lastMessageTime: new Date(Date.now() - 10 * 24 * 3600000).toISOString() // 10일 전
//   }
// ];