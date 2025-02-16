import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URI;

export const tokenApi = {
  // FCM 토큰 저장
  saveToken: async (token: string) => {
    const response = await axios.post(`${BASE_URL}/notify/token`, { token });
    return response.data;
  },

  // FCM 토큰 삭제
  removeToken: async () => {
    const response = await axios.delete(`${BASE_URL}/notify/token`);
    return response.data;
  }
};
