import { useCallback, useEffect } from "react";
import { notificationAPI } from "../../api/notification/notification";
import {
  requestNotificationPermission,
  registerServiceWorker
} from "../../utils/fcm";

interface UseFCMReturn {
  initializeFCM: () => Promise<void>;
  saveToken: (token: string) => Promise<void>;
  deleteToken: () => Promise<void>;
}

export const useFCM = (): UseFCMReturn => {
  const saveToken = useCallback(async (token: string) => {
    try {
      await notificationAPI.saveToken(token);
    } catch (error) {
      console.error("FCM 토큰 저장 실패:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const messageHandler = async (event: MessageEvent) => {
      // 타입 가드 추가
      if (event.data && event.data.type === "TOKEN_REFRESH") {
        try {
          await saveToken(event.data.token);
          console.log("갱신된 FCM 토큰 저장 성공:", event.data.token);
        } catch (error) {
          console.error("갱신된 FCM 토큰 저장 실패:", error);
        }
      }
    };

    navigator.serviceWorker.addEventListener("message", messageHandler);

    // 클린업 함수로 이벤트 리스너 제거
    return () => {
      navigator.serviceWorker.removeEventListener("message", messageHandler);
    };
  }, [saveToken]);

  const initializeFCM = useCallback(async (): Promise<void> => {
    try {
      // 서비스워커 등록
      await registerServiceWorker();

      // 알림 권한 요청
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const token = await requestNotificationPermission();

        if (token) {
          // 토큰을 서버에 저장
          await saveToken(token);
          console.log("FCM 토큰 서버 저장 성공:", token);

          // 주기적인 토큰 갱신 로직 추가
          const tokenRefreshInterval = setInterval(
            async () => {
              try {
                const refreshedToken = await requestNotificationPermission();
                if (refreshedToken) {
                  await saveToken(refreshedToken);
                }
              } catch (error) {
                console.error("토큰 주기적 갱신 실패:", error);
              }
            },
            60 * 60 * 1000
          ); // 1시간마다 갱신

          // 컴포넌트 언마운트 시 인터벌 정리
          clearInterval(tokenRefreshInterval);
        }
      } else {
        console.warn("알림 권한이 거부되었습니다.");
      }
    } catch (error) {
      console.error("FCM 초기화 실패:", error);
    }
  }, [saveToken]);

  const deleteToken = useCallback(async () => {
    try {
      await notificationAPI.deleteToken();
    } catch (error) {
      console.error("FCM 토큰 삭제 실패:", error);
      throw error;
    }
  }, []);

  return {
    initializeFCM,
    saveToken,
    deleteToken
  };
};
