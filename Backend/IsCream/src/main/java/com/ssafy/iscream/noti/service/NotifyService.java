package com.ssafy.iscream.noti.service;

import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.common.exception.MinorException.DataException;
import com.ssafy.iscream.noti.domain.Notify;
import com.ssafy.iscream.noti.domain.NotifyType;
import com.ssafy.iscream.noti.dto.response.NotifyInfo;
import com.ssafy.iscream.noti.repository.NotifyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotifyService {

    private final NotifyRepository notificationRepository;
//    private final Firestore firestore;

    // 알림 목록 조회
    public List<NotifyInfo> getNotifyList(Integer userId) {
        return notificationRepository.findAllByUserId(userId).stream()
                .map(NotifyInfo::new)
                .toList();
    }

    // 알림 읽음 처리
    @Transactional
    public void updateNotifyStatus(Integer notifyId) {
        Notify notify = notificationRepository.findById(notifyId)
                .orElseThrow(() -> new DataException(ErrorCode.DATA_NOT_FOUND));

        notify.setRead(true);
    }

    // TODO: 채팅 푸시 알림 전송, 메세지 정의
    @Transactional
    public void sendChatNotify(Integer userId, Integer chatId) {
        sendNotification(userId, "채팅 알림", "채팅 알림", NotifyType.NOTIFY_CHAT, null, chatId);
    }

    // 댓글 푸시 알림 전송
    @Transactional
    public void sendCommentNotify(Integer userId, Integer postId) {
        sendNotification(userId, "댓글 알림", "회원님의 게시글에 댓글이 작성되었습니다.",
                NotifyType.NOTIFY_COMMENT, postId, null);
    }

    public void sendNotification(Integer userId, String title, String body, NotifyType type,
                                 Integer postId, Integer chatId) {
        String token = getFcmToken(userId);

        if (token == null) {
            return;
        }

//        Notification notification = Notification.builder()
//                .setTitle(title)
//                .setBody(body)
//                .build();
//
//        Message message = Message.builder()
//                .setToken(token)  // 푸시 알림을 받을 기기의 FCM 토큰
//                .setNotification(notification)
//                .putData("type", type.name())  // 추가적인 데이터 전달
//                .putData("postId", postId != null ? postId.toString() : "")
//                .putData("chatId", chatId != null ? chatId.toString() : "")
//                .build();

        // DB에 알림 내역 저장
        Notify notify = Notify.builder()
                .userId(userId)
                .title(title)
                .content(body)
                .type(type)
                .postId(postId)
                .chatId(chatId)
                .build();

        notificationRepository.save(notify);

//        try {
//            String result = FirebaseMessaging.getInstance().sendAsync(message).get();
//            log.info(result);
//        } catch (InterruptedException | ExecutionException e) {
//            throw new RuntimeException("푸시 알림 전송 실패", e);
//        }
    }

    // FCM 토큰 추가/갱신
    public void addFcmToken(Integer userId, String token) {
//        DocumentReference userRef = firestore.collection("users").document(String.valueOf(userId));
//
//        userRef.get().addListener(() -> {
//            try {
//                DocumentSnapshot document = userRef.get().get();
//                if (document.exists()) {
//                    userRef.update("fcmToken", token).get();
//                } else {
//                    userRef.set(Collections.singletonMap("fcmToken", token)).get();
//                }
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//        }, Runnable::run);
    }


    // FCM 토큰 제거
    public void removeFcmToken(Integer userId) {
//        DocumentReference userRef = firestore.collection("users").document(String.valueOf(userId));
//
//        userRef.get().addListener(() -> {
//            try {
//                DocumentSnapshot document = userRef.get().get();
//                if (document.exists()) {
//                    userRef.update("fcmToken", FieldValue.delete()).get();
//                }
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//        }, Runnable::run);
    }

    // FCM 토큰 가져오기
    public String getFcmToken(Integer userId) {
//        DocumentReference userRef = firestore.collection("users").document(String.valueOf(userId));
//        ApiFuture<DocumentSnapshot> future = userRef.get();
//
//        try {
//            DocumentSnapshot document = future.get(); // 동기 실행
//            if (document.exists() && document.contains("fcmToken")) {
//                return document.getString("fcmToken");
//            }
//        } catch (InterruptedException | ExecutionException e) {
//            Thread.currentThread().interrupt();
//        }
        return null;
    }


}
