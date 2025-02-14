interface ChatRoomProps {
  roomId: number;
  profileUrl: string;
  opponentName: string;
  newMessageCount: number;
  lastMessageTime: string;
  onClick: () => void;
}

const ChatRoomItem = ({
  // roomId,
  profileUrl,
  opponentName,
  newMessageCount,
  lastMessageTime,
  onClick
}: ChatRoomProps) => {
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

    // 7일 이상이면 날짜 표시
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
      {/* 프로필 이미지 */}
      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
        <img
          src={profileUrl || "/default-profile.png"}
          alt="프로필"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 채팅방 정보 */}
      <div className="flex-1">
        <div className="font-medium">{opponentName}</div>
        <div className="text-sm text-gray-500 truncate">
          최근 메시지가 여기에 표시됩니다
        </div>
      </div>

      {/* 새 메시지 수 & 시간 */}
      <div className="flex flex-col items-end">
        <div className="text-xs text-gray-400 mb-1">
          {/* {new Date(lastMessageTime).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })} */}
          {formatRelativeTime(lastMessageTime)}
        </div>
        {newMessageCount > 0 && (
          <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {newMessageCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomItem;
