import React from "react";
import NotificationItem from "./NotificationItem";
import { useNotificationList } from "../../hooks/notification/useNotificationList";

interface NotificationModalProps {
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ onClose }) => {
  const { notifications, loading, error, markAsRead } = useNotificationList();

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-96 max-h-[500px] rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">알림</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            닫기
          </button>
        </div>

        <div className="overflow-y-auto max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              새로운 알림이 없습니다.
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.notifyId}
                notification={notification}
                onReadClick={markAsRead}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
