package com.ssafy.iscream.chat.service;

import com.ssafy.iscream.chat.domain.ChatRoom;
import com.ssafy.iscream.chat.dto.res.ChatRoomsGetRes;
import com.ssafy.iscream.chat.repository.ChatMessageRepository;
import com.ssafy.iscream.chat.repository.ChatRoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * ✅ 사용자가 속한 채팅방 목록 조회
     */
    public List<ChatRoom> getUserChatRooms(Integer userId) {
        return chatRoomRepository.findByParticipantIdsContaining(String.valueOf(userId));
    }

    /**
     * ✅ 1:1 채팅방 생성 또는 기존 채팅방 반환
     */
    public ChatRoom createOrGetChatRoom(String user1, String user2) {
        // 두 사용자가 포함된 채팅방이 이미 있는지 확인
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByParticipants(user1, user2);

        if (existingRoom.isPresent()) {
            return existingRoom.get(); // 기존 채팅방 반환
        }

// 새로운 채팅방 생성
        ChatRoom newChatRoom = ChatRoom.builder()
                .participantIds(List.of(user1, user2))
                .lastMessageTimestamp(LocalDateTime.now()) // 생성 시 현재 시간으로 설정
                .build();

// ✅ 저장 후, 반환된 객체에서 chatRoomId 확인
        newChatRoom = chatRoomRepository.save(newChatRoom);

        log.info("🆕 새로운 채팅방 생성: {}", newChatRoom.getId()); // ✅ 여기서 null이면 문제 있음
        return newChatRoom;
    }

    /**
     * ✅ 사용자가 채팅방을 나갈 때 처리
     */
    @Transactional
    public void leaveChatRoom(String roomId, String userId) {
        log.info("🚪 채팅방 나가기 요청: roomId={}, userId={}", roomId, userId);

        // 1️⃣ 채팅방 조회
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 채팅방이 존재하지 않습니다: " + roomId));

        // 2️⃣ 사용자를 채팅방에서 제거
        chatRoom.getParticipantIds().remove(userId);
        log.info("🚪 사용자 제거됨: roomId={}, 남은 인원={}", roomId, chatRoom.getParticipantIds());

        // 3️⃣ Redis에서 해당 사용자 구독 정보 삭제
        redisTemplate.opsForSet().remove("chatroom-" + roomId, userId);
        log.info("❌ Redis 구독 정보 삭제됨: chatroom-{}", roomId);

        // 4️⃣ 채팅방에 아무도 없으면 전체 삭제
        if (chatRoom.getParticipantIds().isEmpty()) {
            log.info("🗑 채팅방 삭제됨: {}", roomId);

            // MongoDB에서 채팅방과 메시지 삭제
            chatRoomRepository.delete(chatRoom);
            chatMessageRepository.deleteByRoomId(roomId);
            log.info("🗑 모든 메시지도 삭제됨: roomId={}", roomId);
        } else {
            // 5️⃣ 남아 있는 사람이 있다면 변경된 참여자 목록 저장
            chatRoomRepository.save(chatRoom);
        }
    }
}
