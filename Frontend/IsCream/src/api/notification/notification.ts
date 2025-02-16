import axios from "axios";
import { NotificationItem } from "../../types/notification";

const BASE_URL = import.meta.env.VITE_BASE_URI;

export const notificationApi = {
  // 알림 내역 조회
  getNotifications: async () => {
    const response = await axios.get<{
      code: string;
      message: string;
      data: NotificationItem[];
    }>(`${BASE_URL}/notify`);
    return response.data;
  },

  // 알림 읽음 처리
  markAsRead: async (notifyId: number) => {
    const response = await axios.get(`${BASE_URL}/notify/${notifyId}`);
    return response.data;
  }
};
