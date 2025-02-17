package com.ssafy.iscream.chat.listener;

import com.ssafy.iscream.auth.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final RedisTemplate<String, Object> redisTemplate;
    private final String AUTHORIZATION_HEADER = "Authorization";

    @Autowired
    private TokenProvider tokenProvider;

    /**
     * ✅ 클라이언트가 WebSocket에 연결할 때 로그 출력
     */
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();

        // ✅ STOMP 헤더에서 JWT 토큰 가져오기
        String token = headerAccessor.getFirstNativeHeader(AUTHORIZATION_HEADER);
        log.info("🛠 Received Authorization Header: {}", token);

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // "Bearer " 제거
        }

        Integer userId = null;
        if (token != null && tokenProvider.validateToken(token)) {
            userId = tokenProvider.getUserId(token); // ✅ 기존 TokenProvider 활용
            log.info("🛠 Extracted Token: {}", token);
        }else {
            log.warn("🚨 No valid Authorization token found in headers");
        }

        // ✅ STOMP 헤더에서 userId와 roomId 가져오기
//        String userId = headerAccessor.getFirstNativeHeader("userId");
        String roomId = headerAccessor.getFirstNativeHeader("roomId");

        // ✅ 가져온 값들을 세션 속성에 저장
        if (userId != null) sessionAttributes.put("userId", userId);
        if (roomId != null) sessionAttributes.put("roomId", roomId);

        log.info("🔗 WebSocket 연결됨: 세션ID={}, 사용자ID={}, 채팅방ID={}", sessionId, userId, roomId);

        // ✅ Redis에 사용자 추가 (구독 관리)
        if (userId != null && roomId != null) {
            String redisKey = "chatroom-" + roomId;
            redisTemplate.opsForSet().add(redisKey, userId);
            log.info("✅ 사용자 구독 추가됨: 채팅방={}, 사용자={}", roomId, userId);
        }
    }
    /**
     * ✅ 클라이언트가 WebSocket 연결을 종료할 때 로그 출력
     */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        // ✅ 세션에서 userId와 roomId 가져오기
        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
        String userId = (sessionAttributes != null) ? (String) sessionAttributes.get("userId") : null;
        String roomId = (sessionAttributes != null) ? (String) sessionAttributes.get("roomId") : null;

        log.info("❌ WebSocket 연결 종료됨: 세션ID={}, 사용자ID={}, 채팅방ID={}", sessionId, userId, roomId);

        // ✅ Redis에서 유저 삭제
        if (userId != null && roomId != null) {
            String redisKey = "chatroom-" + roomId;
            redisTemplate.opsForSet().remove(redisKey, userId);
            log.info("🚪 사용자 구독 해제됨: 채팅방={}, 사용자={}", roomId, userId);
        }
    }


}
