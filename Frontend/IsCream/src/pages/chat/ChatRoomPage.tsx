import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { chatApi } from "../../api/chat";

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
  opponentName: string;
}

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const receiver = location.state?.roomData?.receiver;
  const opponentName = location.state?.roomData?.opponentName;
  
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [chatData, setChatData] = useState<ChatRoomData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 읽지 않은 메시지 필터링
  const getUnreadMessages = () => {
    if (!chatData?.chats || !currentUserId) return [];
    return chatData.chats.filter(
      chat => !chat.read && chat.receiver === currentUserId
    );
  };

  // 읽음 처리 함수
  const handleReadMessages = async () => {
    if (!roomId || !currentUserId) return;
    
    const unreadMessages = getUnreadMessages();
    if (unreadMessages.length === 0) return;

    try {
      await Promise.all(
        unreadMessages.map(chat => 
          chatApi.messageRead(chat.id, currentUserId, roomId)
        )
      );

      setChatData(prevData => {
        if (!prevData) return null;
        return {
          chats: prevData.chats.map(chat => {
            if (!chat.read && chat.receiver === currentUserId) {
              return { ...chat, read: true };
            }
            return chat;
          })
        };
      });
    } catch (error) {
      console.error("메시지 읽음 처리 실패:", error);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMoreMessages = async () => {
    if (isLoadingMore || !roomId) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const response = await chatApi.openChatroom(roomId, nextPage);
      
      if (response.data && response.data.length > 0) {
        const messagesWithOpponentName = response.data.map(message => ({
          ...message,
          opponentName: opponentName
        }));

        setChatData(prevData => {
          if (!prevData) return { chats: messagesWithOpponentName };
          return {
            chats: [...messagesWithOpponentName, ...prevData.chats]
          };
        });
        setPage(nextPage);
      }
    } catch (error) {
      console.error("추가 메시지 로드 실패:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    if (container.scrollTop <= container.clientHeight * 0.1) {
      loadMoreMessages();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

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
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken?.userId) {
        setCurrentUserId(decodedToken.userId);
      }
    }
  }, []);

  // 채팅방 가시성에 따른 읽음 처리
  useEffect(() => {
    if (document.visibilityState === 'visible') {
      handleReadMessages();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleReadMessages();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [chatData?.chats, currentUserId, roomId]);

  useEffect(() => {
    const initializeChatRoom = async () => {
      if(!roomId) return;

      try {
        setIsLoading(true);
        const response = await chatApi.openChatroom(roomId, page);
        if (response.data && response.data.length > 0) {
          const messagesWithOpponentName = response.data.map(message => ({
            ...message,
            opponentName: opponentName
          }));
          setChatData({chats: messagesWithOpponentName});
          
          // 초기 로드 시 읽음 처리
          if (document.visibilityState === 'visible') {
            handleReadMessages();
          }
        }
        
        const token = localStorage.getItem("accessToken");
        if(token === null) return;

        await chatApi.connectChatroom(roomId, token);
        setIsConnected(true);

        await chatApi.subscribeChatroom(roomId, (message) => {
          console.log("새 메시지 수신:", message);

          // 읽음 상태 업데이트 메시지인 경우
          if (message.type === 'READ_ACK') {
            setChatData(prevData => {
              if (!prevData) return null;
              return {
                chats: prevData.chats.map(chat => {
                  if (chat.id === message.messageId) {
                    return { ...chat, read: true };
                  }
                  return chat;
                })
              };
            });
            return;
          }

          // 일반 메시지인 경우
          const messageWithOpponentName = {
            ...message,
            opponentName: opponentName
          };

          setChatData(prevData => {
            if (!prevData) {
              return { chats: [messageWithOpponentName] };
            }
            const isDuplicate = prevData.chats.some(chat => chat.id === message.id);
            if (isDuplicate) {
              return prevData;
            }
            
            // 새 메시지 수신 시 자동 읽음 처리
            if (message.receiver === currentUserId && document.visibilityState === 'visible') {
              handleReadMessages();
            }
            
            return {
              ...prevData,
              chats: [messageWithOpponentName, ...prevData.chats]
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
  }, [roomId, navigate]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected || !roomId || !currentUserId) return;
    
    try {
        await chatApi.sendMessage(roomId, currentUserId, receiver, newMessage);

        const sentMessage = {
          id: Date.now().toString(),
          roomId: roomId,
          sender: currentUserId,
          receiver: receiver,
          content: newMessage.trim(),
          timestamp: new Date().toISOString(),
          read: false,
          opponentName: opponentName
        };

        setChatData(prevData => {
            if (!prevData) return { chats: [sentMessage] };
            return {
                ...prevData,
                chats: [sentMessage, ...prevData.chats]
            };
        });
        
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

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col bg-white">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 pb-20"
        onScroll={handleScroll}
      >
        {isLoadingMore && (
          <div className="text-center py-2">
            <span className="text-gray-500">메시지를 불러오는 중...</span>
          </div>
        )}
        {chatData?.chats.slice().reverse().map((chat) => (
          <div
            key={chat.id}
            className={`flex ${chat.sender == currentUserId ? "justify-end" : "justify-start"}`}
          >
            {chat.sender == currentUserId ? (
              <div className="flex flex-col items-end">
                <div className="flex">
                  {!chat.read && (
                    <span className="text-xs text-gray-500 mb-1 mr-2 flex items-end">1</span>
                  )}
                  <div className="p-3 rounded-lg bg-white text-black border border-gray-500">
                    {chat.content}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-1 px-1">
                  {formatMessageTime(chat.timestamp)}
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="text-base text-gray-600 mb-1">
                  {opponentName}
                </div>
                <div className="p-3 rounded-lg bg-green-500 text-white">
                  {chat.content}
                </div>
                <div className="text-xs text-gray-500 mt-1 px-1">
                  {formatMessageTime(chat.timestamp)}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="fixed bottom-20 w-full p-4 flex items-center bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요"
          className="flex-1 border border-gray-500 rounded-lg p-2 mr-2"
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