import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { tokenApi } from "../../api/notification/token"; // 경로 확인 필요

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // 환경변수 이름 수정
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const useNotification = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [messaging, setMessaging] = useState<ReturnType<
    typeof getMessaging
  > | null>(null);

  useEffect(() => {
    // Firebase 앱 초기화
    const app = initializeApp(firebaseConfig);
    const messagingInstance = getMessaging(app);
    setMessaging(messagingInstance);

    // 브라우저 지원 확인
    setIsSupported("Notification" in window && "serviceWorker" in navigator);

    // 포그라운드 알림 핸들러
    const unsubscribe = onMessage(messagingInstance, (payload) => {
      new Notification(payload.notification?.title || "알림", {
        body: payload.notification?.body || "새로운 알림이 도착했습니다."
      });
    });

    // 컴포넌트 언마운트 시 리스너 정리
    return () => {
      unsubscribe();
    };
  }, []);

  // 알림 권한 요청
  const requestNotificationPermission = async () => {
    if (!isSupported) {
      console.error("브라우저가 알림을 지원하지 않습니다.");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted" && messaging) {
      try {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
        });

        // 백엔드에 토큰 저장
        await tokenApi.saveToken(token);
        return token;
      } catch (error) {
        console.error("토큰 생성 중 오류 발생:", error);
        return null;
      }
    }
    return null;
  };

  // 토큰 삭제
  const removeNotificationToken = async () => {
    try {
      await tokenApi.removeToken();
    } catch (error) {
      console.error("토큰 삭제 중 오류 발생:", error);
    }
  };

  return {
    isSupported,
    requestNotificationPermission,
    removeNotificationToken
  };
};
