import React from "react";
import { useNavigate } from "react-router-dom";
import { NotificationItem as NotificationItemType } from "../../types/notification";

interface NotificationItemProps {
  notification: NotificationItemType;
  onReadClick: (notifyId: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onReadClick
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // 알림 읽음 처리
    if (!notification.isRead) {
      onReadClick(notification.notifyId);
    }

    // 게시글 또는 채팅방으로 이동 로직
    if (notification.postId) {
      // 게시글로 이동
      navigate(`/board/detail/${notification.postId}`);
    } else if (notification.chatId) {
      // 채팅방으로 이동
      navigate(`/chat/room/${notification.chatId}`);
    }
  };

  return (
    <div
      className={`
        p-4 border-b last:border-b-0 cursor-pointer 
        ${notification.isRead ? "bg-gray-50" : "bg-blue-50"}
        hover:bg-gray-100 transition-colors
      `}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-800">{notification.title}</h3>
          <p className="text-sm text-gray-600">{notification.content}</p>
        </div>
        {!notification.isRead && (
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-2">{notification.type}</div>
    </div>
  );
};

export default NotificationItem;
