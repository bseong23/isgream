import { useState, useEffect } from "react";
import { NotificationItem } from "../../types/notification";
import { notificationApi } from "../../api/notification/notification";

export const useNotificationList = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 알림 목록 불러오기
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationApi.getNotifications();
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      setError("알림을 불러오는 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 알림 읽음 처리
  const markAsRead = async (notifyId: number) => {
    try {
      await notificationApi.markAsRead(notifyId);
      // 로컬 상태 업데이트
      setNotifications((prev) =>
        prev.map((noti) =>
          noti.notifyId === notifyId ? { ...noti, isRead: true } : noti
        )
      );
    } catch (err) {
      console.error("알림 읽음 처리 중 오류 발생:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead
  };
};
