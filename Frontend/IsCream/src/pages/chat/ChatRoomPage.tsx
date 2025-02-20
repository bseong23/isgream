// 문제없이 돌아가던 서버에 배포한 버전

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
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 읽지 않은 메시지 필터링
  const getUnreadMessages = () => {
    if (!chatData?.chats || !currentUserId) return [];
    return chatData.chats.filter(
      (chat) => !chat.read && chat.receiver === currentUserId
    );
  };

  // 읽음 처리 함수
  const handleReadMessages = async () => {
    if (!roomId || !currentUserId) return;

    const unreadMessages = getUnreadMessages();
    if (unreadMessages.length === 0) return;

    try {
      // 읽지 않은 모든 메시지에 대해 읽음 처리 API 호출
      await Promise.all(
        unreadMessages.map((chat) =>
          // 5. 채팅방 안에서, 메시지 읽음 처리
          chatApi.messageRead(chat.id, currentUserId, roomId)
        )
      );

      // 로컬 상태 업데이트
      setChatData((prevData) => {
        if (!prevData) return null;
        return {
          chats: prevData.chats.map((chat) => {
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

  const scrollToBottom = (smooth: boolean = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto"
      });
    }
  };

  const loadMoreMessages = async () => {
    if (isLoadingMore || !roomId) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      //1. 채팅방 입장
      const response = await chatApi.openChatroom(roomId, nextPage);

      if (response.data && response.data.length > 0) {
        const messagesWithOpponentName = response.data.map((message) => ({
          ...message,
          opponentName: opponentName
        }));

        // 현재 스크롤 위치 저장
        const container = chatContainerRef.current;
        const previousHeight = container?.scrollHeight || 0;
        const previousScrollTop = container?.scrollTop || 0;

        // 스크롤 하단에서 100px 이내인 경우에만 자동 스크롤
        setShouldScrollToBottom(
          container
            ? container.scrollHeight - container.scrollTop <=
                container.clientHeight + 100
            : true
        );

        setChatData((prevData) => {
          if (!prevData) return { chats: messagesWithOpponentName };
          return {
            chats: [...messagesWithOpponentName, ...prevData.chats]
          };
        });

        console.log("챗데이터: ", chatData);

        // 스크롤 위치 복원
        if (container) {
          requestAnimationFrame(() => {
            const newHeight = container.scrollHeight;
            container.scrollTop =
              previousScrollTop + (newHeight - previousHeight);
          });
        }

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

    // 스크롤이 하단에 가까워지면 자동 스크롤 활성화
    setShouldScrollToBottom(
      container.scrollHeight - container.scrollTop <=
        container.clientHeight + 100
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
      const base64Payload = token.split(".")[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (error) {
      console.error("토큰 디코딩 실패:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken?.userId) {
        setCurrentUserId(decodedToken.userId);
      }
    }
  }, []);

  // 채팅방 가시성에 따른 읽음 처리, 탭이 활성화될 때, 읽음처리가 실행
  useEffect(() => {
    // 채팅방 최초 입장시
    if (document.visibilityState === "visible") {
      handleReadMessages(); //읽음처리함수수
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleReadMessages(); //읽음처리함수수
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [chatData?.chats, currentUserId, roomId]);

  useEffect(() => {
    const initializeChatRoom = async () => {
      if (!roomId) return;

      try {
        setIsLoading(true);

        //1. 채팅방 입장
        const response = await chatApi.openChatroom(roomId, page);
        if (response.data && response.data.length > 0) {
          const messagesWithOpponentName = response.data.map((message) => ({
            ...message,
            opponentName: opponentName
          }));
          setChatData({ chats: messagesWithOpponentName });

          // 초기 로드 시 읽음 처리
          if (document.visibilityState === "visible") {
            handleReadMessages();
          }

          // 초기 로드 시 즉시 스크롤 (smooth 효과 없이)
          setTimeout(() => {
            scrollToBottom(false);
          }, 100);
        }

        const token = localStorage.getItem("accessToken");
        if (token === null) return;

        //2.  채팅방 입장시, 소켓 통신 연결
        await chatApi.connectChatroom(roomId, token);
        setIsConnected(true);

        // 3. 채팅방 입장시 연결 성공 직후, 구독

        await chatApi.subscribeChatroom(roomId, (message) => {
          console.log("새 메시지 수신:", message);

          // 읽음 상태 업데이트 메시지인 경우
          if (message.type === "ACK") {
            setChatData((prevData) => {
              if (!prevData) return null;
              return {
                chats: prevData.chats.map((chat) => {
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

          setChatData((prevData) => {
            if (!prevData) {
              return { chats: [messageWithOpponentName] };
            }

            // 메시지 고유성 확인 로직 강화
            const isUnique = !prevData.chats.some(
              (chat) =>
                chat.id === message.messageId ||
                (chat.content === message.content &&
                  chat.timestamp === message.timestamp)
            );

            if (!isUnique) {
              console.log("중복 메시지 제거:", message);
              return prevData;
            }

            // 새 메시지 수신 시 자동 읽음 처리
            if (
              message.receiver === currentUserId &&
              document.visibilityState === "visible"
            ) {
              handleReadMessages();
            }

            return {
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

    const messageToSend = newMessage.trim();
    setNewMessage(""); // input 비우기

    try {
      const response = await chatApi.sendMessage(
        roomId,
        currentUserId,
        receiver,
        messageToSend
      );

      // 중복 체크 로직 추가
      setChatData((prevData) => {
        if (!prevData) return { chats: [response] };

        const isUnique = !prevData.chats.some(
          (chat) =>
            chat.id === response.messageId ||
            (chat.content === response.content &&
              chat.timestamp === response.timestamp)
        );

        if (!isUnique) {
          console.log("중복 메시지 제거:", response);
          return prevData;
        }

        return {
          ...prevData,
          chats: [response, ...prevData.chats]
        };
      });

      setShouldScrollToBottom(true);
      scrollToBottom();
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      alert("메시지 전송에 실패했습니다.");
      setNewMessage(messageToSend);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
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
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="flex flex-col bg-white">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 pb-10"
        onScroll={handleScroll}
      >
        {isLoadingMore && (
          <div className="text-center py-2">
            <span className="text-gray-500">메시지를 불러오는 중...</span>
          </div>
        )}
        {chatData?.chats
          .slice()
          .reverse()
          .map((chat) => (
            <div
              key={chat.id}
              className={`flex ${chat.sender == currentUserId ? "justify-end" : "justify-start"}`}
            >
              {chat.sender == currentUserId ? (
                <div className="flex flex-col items-end">
                  <div className="flex">
                    {/* {!chat.read && (
                      <span className="text-xs text-gray-500 mb-1 mr-2 flex items-end">
                        1
                      </span>
                    )} */}
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
      <div className="w-full bg-white fixed bottom-15">
        <div className="w-[95%] flex items-center bg-white mb-4">
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
    </div>
  );
};

export default ChatRoomPage;
