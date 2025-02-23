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
  const isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
  };

  const saveToken = useCallback(async (token: string) => {
    if (!isAuthenticated()) return;

    try {
      await notificationAPI.saveToken(token);
    } catch (error) {
      console.error("FCM 토큰 저장 실패:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) return;

    const messageHandler = async (event: MessageEvent) => {
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

    return () => {
      navigator.serviceWorker.removeEventListener("message", messageHandler);
    };
  }, [saveToken]);

  const initializeFCM = useCallback(async () => {
    if (!isAuthenticated()) return;

    let intervalId: number | undefined;

    try {
      await registerServiceWorker();
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const token = await requestNotificationPermission();

        if (token) {
          await saveToken(token);
          console.log("FCM 토큰 서버 저장 성공:", token);

          intervalId = window.setInterval(
            async () => {
              if (!isAuthenticated()) {
                if (intervalId) {
                  window.clearInterval(intervalId);
                }
                return;
              }

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
          );
        }
      } else {
        console.warn("알림 권한이 거부되었습니다.");
      }
    } catch (error) {
      console.error("FCM 초기화 실패:", error);
    }

    // 이 부분 제거 (Promise<void>를 반환해야 하므로 cleanup 함수를 반환하면 안됨)
  }, [saveToken]);

  const deleteToken = useCallback(async () => {
    if (!isAuthenticated()) return;

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
