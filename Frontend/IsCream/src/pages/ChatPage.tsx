import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatRoomItem from "../components/chat/ChatRoomItem";
import { chatApi } from "../api/chat";

interface ChatRoom {
  roomId: string;
  opponentName: string;
  newMessageCount: number;
  lastMessageTime: string;
  lastMessageUnread: string;
  receiver: string;
}

const ChatPage = () => {
  
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChatRooms = async () => {
    try{
      console.log("채팅방 목록 조회하러간당");
      console.log("chatRooms: ",chatRooms);

      setIsLoading(true);
      const response = await chatApi.getChatList();
      console.log("프론트엔드데이터: ",response);
      console.log("채팅목록길이: ",response);

      // 서버 응답 데이터에 receiver 필드 추가
      // const roomsWithReceiver = response.data.map(room => ({
      //   ...room
      //   ,receiver: room.opponentId  // opponentId를 receiver로 사용
      // }));
      // console.log("roomsWithReceiver: ", roomsWithReceiver);
      
      // setChatRooms(roomsWithReceiver);
      setChatRooms(response.data);

      console.log("chatRooms: ",chatRooms);
      console.log("챗룸즈~~: ", chatRooms);
      

    }catch (error) {
      console.log("채팅방 목록을 불러오는데 실패했습니다.");
    }finally{
      setIsLoading(false);
    }
  };

  const handleDelete = async (roomId: string) => {
    try{
      const response = await chatApi.deleteChatroom(roomId);
      console.log(response)
      fetchChatRooms();
    } catch(error) {
      console.log("채팅방을 삭제하는데 실패했습니다.")
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  if(isLoading) {
    return(
      <div className="flex flex-col h-screen bg-white items-center justify-center">
        <div className="text-gray-500">로딩중...</div>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
      {chatRooms.length == 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            채팅방이 없습니다.
          </div>
        ) : (
          chatRooms.map((room) => (
            <ChatRoomItem
              key={room.roomId}
              {...room}
              onDelete={() => handleDelete(room.roomId)}
              onClick={() => navigate(`/chat/room/${room.roomId}`,{
                state: {
                  roomData: {
                    roomId: room.roomId,
                    receiver: room.receiver, // 상대방 id
                    opponentName: room.opponentName // 상대방 이름
                  }
                }
              })}
            />
          ))
        )}
      </div>
    </div>
  );
};
export default ChatPage;
