import { useState, useEffect } from "react";

interface ChatRoomProps {
  roomId: string;
  opponentName: string;
  // newMessageCount: number;
  lastMessageTime: string;
  lastMessageUnread: string;
  onDelete: () => void;
  onClick: () => void;
}

const ChatRoomItem = ({
  opponentName,
  // newMessageCount,
  lastMessageTime,
  lastMessageUnread,
  onDelete,
  onClick
}: ChatRoomProps) => {
  const [showOptions, setShowOptions] = useState(false);

  // 외부 클릭 감지를 위한 이벤트 리스너
  useEffect(() => {
    const handleClickOutside = () => {
      setShowOptions(false);
    };

    if (showOptions) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showOptions]);

  const formatRelativeTime = (lastMessageTime: string) => {
    const now = new Date();
    const messageTime = new Date(lastMessageTime);
    const diffInMinutes = Math.floor(
      (now.getTime() - messageTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;

    return messageTime.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex-1">
        <div className="font-medium">{opponentName}</div>
        <div className="text-sm text-gray-500 truncate">
          {lastMessageUnread}
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="text-xs text-gray-400 mb-1">
          {formatRelativeTime(lastMessageTime)}
        </div>
        {/* {newMessageCount > 0 && (
          <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {newMessageCount}
          </div>
        )} */}
      </div>

      {opponentName && (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
            className="ml-4 p-2 hover:bg-red-50 rounded"
          >
            ⋮
          </button>

          {showOptions && (
            <div className="absolute right-0 bottom-full mb-1 bg-white shadow-lg rounded-lg py-2 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setShowOptions(false);
                }}
                className="w-24 px-4 py-2 text-left text-red-500 hover:bg-gray-50"
              >
                나가기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatRoomItem;