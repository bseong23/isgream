import { getMessaging, getToken } from "firebase/messaging";
import { app } from "../firebase";

export const registerServiceWorker = async () => {
  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        {
          scope: "/"
        }
      );
      console.log("Service Worker 등록 성공:", registration);
      return registration;
    }
  } catch (error) {
    console.error("Service Worker 등록 실패:", error);
    return null;
  }
};

export const requestNotificationPermission = async () => {
  try {
    // 먼저 권한 요청
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const messaging = getMessaging(app);

      try {
        // 서비스워커 등록 확인
        const registration = await navigator.serviceWorker.getRegistration();

        // 토큰 요청
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration
        });

        if (token) {
          console.log("FCM 토큰:", token);
          return token;
        }

        console.log("토큰을 받을 수 없습니다.");
        return null;
      } catch (tokenError) {
        console.error("FCM 토큰 생성 중 에러:", tokenError);
        return null;
      }
    }

    console.log("알림 권한이 거부되었습니다.");
    return null;
  } catch (error) {
    console.error("알림 권한 요청 중 에러 발생:", error);
    return null;
  }
};
