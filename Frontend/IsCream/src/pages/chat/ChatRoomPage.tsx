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
  console.log("receiver: ", receiver);
  
  const opponentName = location.state?.roomData?.opponentName;
  
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [chatData, setChatData] = useState<ChatRoomData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [hasMore, setHasMore] = useState(true); // 추가: 더 불러올 데이터가 있는지 확인
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 읽지 않은 메시지 필터링
  const getUnreadMessages = () => {
    if (!chatData?.chats || !currentUserId) {
      console.log("getUnreadMessages - missing data:", { 
        hasChats: !!chatData?.chats, 
        currentUserId 
      });
      return [];
    }
    
    console.log("Checking messages:", {
      allMessages: chatData.chats,
      currentUserId: currentUserId,
      receivedMessages: chatData.chats.filter(chat => chat.receiver == currentUserId),
      unreadMessages: chatData.chats.filter(chat => !chat.read),
    });
  
    const unread = chatData.chats.filter(chat => {
      const isUnread = !chat.read;
      const isForCurrentUser = chat.receiver == currentUserId;
      console.log("1. Message check 이거 맞음?:", {
        messageId: chat.id,
        read: chat.read,
        receiver: chat.receiver,
        currentUserId,
        isUnread,
        isForCurrentUser,
        willBeIncluded: isUnread && isForCurrentUser
      });
      return isUnread && isForCurrentUser;
    });
  
    console.log("Found unread messages:", unread);
    return unread;
  };
  // const getUnreadMessages = () => {
  //   if (!chatData?.chats || !currentUserId) return [];
  //   return chatData.chats.filter(
  //     chat => !chat.read && chat.receiver === currentUserId
  //   );
  // };

  // 읽음 처리 함수
  const handleReadMessages = async () => {
    if (!roomId || !currentUserId) {
      console.log("handleReadMessages - missing data:", { roomId, currentUserId });
      return;
    }
    
    const unreadMessages = getUnreadMessages();
    console.log("Unread messages:", unreadMessages);

    if (unreadMessages.length === 0) {
    console.log("No unread messages");
    return;
  }

    try {
      console.log("Attempting to read messages:", unreadMessages);
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

  const scrollToBottom = (smooth: boolean = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  const loadMoreMessages = async () => {
    if (isLoadingMore || !roomId || !hasMore) return;
    // if (isLoadingMore || !roomId) return;
    console.log("페이지 하나 더 추가 (+1), try문 바깥");
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      console.log("페이지 하나 더 추가 (+1)");
      
      const response = await chatApi.openChatroom(roomId, nextPage);
      
      if (response.data && response.data.length > 0) {
        const messagesWithOpponentName = response.data.map(message => ({
          ...message,
          opponentName: opponentName
        }));

      // 현재 스크롤 위치 저장
      const container = chatContainerRef.current;
      const previousHeight = container?.scrollHeight || 0;
      const previousScrollTop = container?.scrollTop || 0;

      // 스크롤 하단에서 100px 이내인 경우에만 자동 스크롤
      // setShouldScrollToBottom(
      //   container ? 
      //   container.scrollHeight - container.scrollTop <= container.clientHeight + 100 
      //   : true
      // );

      setChatData(prevData => {
        if (!prevData) return { chats: messagesWithOpponentName };
        return {
          // chats: [...messagesWithOpponentName, ...prevData.chats]
          chats: [...prevData.chats, ...messagesWithOpponentName]
        };
      });

      setPage(nextPage);

      // 데이터가 50개 미만이면 더 이상 데이터가 없다고 판단
      if (response.data.length < 50) {
        setHasMore(false);
      }

      console.log("챗데이터: ", chatData);

      // 스크롤 위치 복원
      if (container) {
        requestAnimationFrame(() => {
          const newHeight = container.scrollHeight;
          container.scrollTop = previousScrollTop + (newHeight - previousHeight);
        });
      }

    }else{
      setHasMore(false); // 더 이상 데이터가 없음
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

    // 스크롤이 맨 위에 가까워졌을 때 추가 메시지 로드
    const scrollTop = container.scrollTop;
    const threshold = 100; // 스크롤 임계값

    console.log('Scroll position:', scrollTop); // 스크롤 위치 디버깅
    
    if (scrollTop <= threshold) {
      console.log('Triggering loadMoreMessages');
      loadMoreMessages();
    }

    // 스크롤이 하단에 가까워지면 자동 스크롤 활성화
    setShouldScrollToBottom(
      container.scrollHeight - container.scrollTop <= container.clientHeight + 100
    );
  };

  useEffect(() => {
    // 새 메시지가 추가되었고 스크롤이 필요한 경우에만 스크롤
    if (shouldScrollToBottom) {
      scrollToBottom();
    }
  }, [chatData, shouldScrollToBottom]);

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
            console.log("Tab became visible, checking for unread messages");
            handleReadMessages();
          }

          // 초기 로드 시 즉시 스크롤 (smooth 효과 없이)
          setTimeout(() => {
            scrollToBottom(false);
          }, 100);
        }
        
        const token = localStorage.getItem("accessToken");
        if(token === null) return;

        await chatApi.connectChatroom(roomId, token);
        setIsConnected(true);

        await chatApi.subscribeChatroom(roomId, (message) => {
          console.log("새 메시지 수신:", message);

          // 메시지가 현재 사용자가 받는 것이고, 읽지 않은 상태라면
          if (message.receiver === currentUserId && !message.read) {
            console.log("New message received, triggering read:", message);
            if(!currentUserId) return;

            // 읽음 처리 신호 보내기
            chatApi.messageRead(message.id, currentUserId, roomId);
          }
          // // 읽음 상태 업데이트 메시지인 경우
          // if (message.type === 'ACK') {
          //   setChatData(prevData => {
          //     if (!prevData) return null;
          //     return {
          //       chats: prevData.chats.map(chat => {
          //         if (chat.id === message.messageId) {
          //           return { ...chat, read: true };
          //         }
          //         return chat;
          //       })
          //     };
          //   });
          //   return;
          // }
          
          // 읽음 상태 업데이트 메시지인 경우
          if (message.type === 'ACK' || (message.messageId && message.sender)) {
            console.log("Received ACK message:", message);
            setChatData(prevData => {
              if (!prevData) return null;
              
              const updatedChats = prevData.chats.map(chat => {
                // messageId가 일치하거나, sender가 현재 사용자이고 receiver가 ACK를 보낸 사용자인 경우
                if (
                  chat.id === message.messageId || 
                  (chat.sender === currentUserId && chat.receiver === message.sender)
                ) {
                  console.log("Updating read status for message:", chat.id);
                  return { ...chat, read: true };
                }
                return chat;
              });

              return {
                chats: updatedChats
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
        // alert("채팅방 연결에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeChatRoom();
  }, [roomId, navigate]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected || !roomId || !currentUserId) return;
    
    const messageToSend = newMessage.trim(); // 현재 메시지 저장
    setNewMessage(""); // 즉시 input 비우기

    try {
        console.log("메시지보낼때 파라미터 확인: ", roomId, currentUserId, receiver, messageToSend);
        const response = await chatApi.sendMessage(roomId, currentUserId, receiver, messageToSend);
        console.log("챗룸페이지에서 메시지 보내고 돌아온 응답 메시지: ", response);
        
        
        // const sentMessage = {
        //   id: Date.now().toString(),
        //   roomId: roomId,
        //   sender: currentUserId,
        //   receiver: receiver,
        //   content: messageToSend,
        //   timestamp: new Date().toISOString(),
        //   read: false,
        //   opponentName: opponentName
        // };

        // 응답에 opponentName 추가
        // const messageWithOpponentName = {
        //   ...response,
        //   opponentName: opponentName
        // };
        
        setShouldScrollToBottom(true);  // 새 메시지 전송시 스크롤
        setChatData(prevData => {
          if (!prevData) return { chats: [response] };
          return {
            ...prevData,
            chats: [response, ...prevData.chats]
          };
        });
        
        scrollToBottom(); // 메시지 전송 후 스크롤
      } catch (error) {
        console.error("메시지 전송 실패:", error);
        alert("메시지 전송에 실패했습니다.");
        setNewMessage(messageToSend);
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
    // 무한스크롤위한 페이지 사이즈 설정 
    <div className="flex flex-col h-[calc(100vh-160px)]"> 

    {/* 채팅 메시지 영역 */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4"
        onScroll={handleScroll}
      >
        {isLoadingMore && hasMore && (
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
      

      {/* 채팅입력창 */}
      <div className="mt-4">
        <div className="flex items-center p-1 bg-white ">
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
      {/* 채팅입력창 */}

    </div>
  );
};

export default ChatRoomPage;