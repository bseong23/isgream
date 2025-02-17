import { api } from "../../utils/common/axiosInstance";
import { NotifyResponse } from "../../types/notification";

export const notificationAPI = {
  // FCM 토큰 저장
  saveToken: (token: string) => {
    return api.post("/notify/token", {
      token: token
    });
  },

  // FCM 토큰 삭제
  deleteToken: () => {
    return api.delete("/notify/token");
  },

  // 알림 내역 조회
  getNotifications: () => {
    return api.get<NotifyResponse>("/notify");
  },

  // 알림 읽음 처리
  markAsRead: (notifyId: number) => {
    return api.get(`/notify/${notifyId}`);
  }
};
