import { api } from "../../utils/common/axiosInstance";

export const tokenApi = {
  // FCM 토큰 저장
  saveToken: async (token: string) => {
    // 인증 상태 체크
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      const response = await api.post(`/notify/token`, { token });
      return response.data;
    } catch (error) {
      console.error("FCM 토큰 저장 실패:", error);
    }
  },

  // FCM 토큰 삭제
  removeToken: async () => {
    // 인증 상태 체크
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      const response = await api.delete(`/notify/token`);
      return response.data;
    } catch (error) {
      console.error("FCM 토큰 삭제 실패:", error);
    }
  }
};
