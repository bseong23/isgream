package com.ssafy.iscream.noti.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
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
import java.util.concurrent.ExecutionException;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotifyService {

    private final NotifyRepository notificationRepository;
    private final Firestore firestore;

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

        Notification notification = Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();

        Message message = Message.builder()
                .setToken(token)  // 푸시 알림을 받을 기기의 FCM 토큰
                .setNotification(notification)
                .putData("type", type.name())  // 추가적인 데이터 전달
                .putData("postId", postId != null ? postId.toString() : "")
                .putData("chatId", chatId != null ? chatId.toString() : "")
                .build();

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

        try {
            String result = FirebaseMessaging.getInstance().sendAsync(message).get();
            log.info(result);
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("푸시 알림 전송 실패", e);
        }
    }

    // FCM 토큰 추가/갱신
    public void addFcmToken(Integer userId, String token) {
        DocumentReference userRef = firestore.collection("users").document(String.valueOf(userId));

        // Firestore에 업데이트 요청
        ApiFuture<WriteResult> future = userRef.update("fcmToken", token); // 토큰 저장

        future.addListener(() -> {
            try {
                future.get();
            } catch (Exception e) {
                userRef.set(token);
            }
        }, Runnable::run);
    }

    // FCM 토큰 제거
    public void removeFcmToken(Integer userId) {
        DocumentReference userRef = firestore.collection("users").document(String.valueOf(userId));
        userRef.update("fcmToken", FieldValue.delete());
    }

    // FCM 토큰 가져오기
    private String getFcmToken(Integer userId) {
        DocumentReference userRef = firestore.collection("users").document(String.valueOf(userId));
        ApiFuture<DocumentSnapshot> future = userRef.get();

        try {
            DocumentSnapshot document = future.get();
            if (document.exists() && document.contains("fcmToken")) {
                return document.getString("fcmToken");
            }
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt(); // 인터럽트 발생 시 현재 스레드 중단
        }
        return null; // 사용자가 없거나 토큰이 없는 경우
    }

}
