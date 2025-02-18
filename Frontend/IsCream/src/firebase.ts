// firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);

export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;

// 토큰 가져오기 유틸리티 함수
export const getFCMToken = async () => {
  if (!messaging) return null;

  try {
    return await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
    });
  } catch (error) {
    console.error("토큰 가져오기 실패:", error);
    return null;
  }
};

// 메시지 수신 리스너 설정
export const initMessaging = () => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("메시지 수신:", payload);
    // 수신된 메시지 처리 로직 추가 가능
    // 예: 알림 표시, 상태 업데이트 등
  });
};
