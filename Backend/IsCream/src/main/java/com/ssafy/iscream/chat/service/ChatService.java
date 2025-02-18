package com.ssafy.iscream.chat.service;

import com.ssafy.iscream.chat.domain.ChatMessage;
import com.ssafy.iscream.chat.domain.ChatRoom;
import com.ssafy.iscream.chat.dto.ChatMessageDto;
import com.ssafy.iscream.chat.dto.MessageAckDto;
import com.ssafy.iscream.chat.dto.ReadReceiptDto;
import com.ssafy.iscream.chat.repository.ChatMessageRepository;
import com.ssafy.iscream.chat.repository.ChatRoomRepository;
import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.common.exception.NotFoundException;
import com.ssafy.iscream.common.exception.UnauthorizedException;
import com.ssafy.iscream.common.response.ResponseData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomRepository chatRoomRepository;

    public void sendMessage(ChatMessageDto chatMessageDto) {

        // ✅ roomId가 있으면 해당 ID로 채팅방 조회
        ChatRoom chatRoom = chatRoomRepository.findById(chatMessageDto.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("🚨 존재하지 않는 채팅방: " + chatMessageDto.getRoomId()));

        // ✅ participants 검증 (roomId가 있지만, 실제 참여자가 일치하지 않는다면 예외 발생)
        List<String> participants = chatRoom.getParticipantIds();
        if (!participants.contains(chatMessageDto.getSender()) || !participants.contains(chatMessageDto.getReceiver())) {
            throw new IllegalArgumentException("🚨 유효하지 않은 채팅방 ID 또는 참가자 불일치");
        }

        ChatMessage chatMessage = ChatMessage.builder()
                .roomId(chatMessageDto.getRoomId())
                .sender(chatMessageDto.getSender())
                .receiver(chatMessageDto.getReceiver())
                .content(chatMessageDto.getContent())
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();

        // ✅ MongoDB에 메시지 저장 후, messageId 가져오기
        chatMessage = chatMessageRepository.save(chatMessage);

        // ✅ 클라이언트에게 messageId 포함해서 전송
        chatMessageDto.setMessageId(chatMessage.getId());

        log.info("📤 Redis Pub/Sub 발행 (messageId 포함): {}", chatMessageDto);

        redisTemplate.convertAndSend("chatroom-" + chatMessageDto.getRoomId(), chatMessageDto);

    }

    public void handleAck(MessageAckDto ackDto) {
        //messagingTemplate.convertAndSend("/sub/chat/read-receipt/" + ackDto.getRoomId(), ackDto);
        log.info("🔍 ACK 처리 중: {}", ackDto);

        // ✅ 해당 메시지를 DB에서 찾아 읽음 처리
        ChatMessage chatMessage = chatMessageRepository.findById(ackDto.getMessageId())
                .orElse(null);

        if (chatMessage == null) {
            log.warn("❌ 메시지를 찾을 수 없음: {}", ackDto.getMessageId());
            return;
        }

        if (!chatMessage.getReceiver().equals(ackDto.getReaderId())) {
            log.info("❌ 읽음 요청한 사람 = 보낸사람 : {}", ackDto.getMessageId());
            return;
        }

        // ✅ 이미 읽음 상태면 처리하지 않음
        if (chatMessage.isRead()) {
            log.info("✅ 이미 읽음 처리된 메시지: {}", ackDto.getMessageId());
            return;
        }

        // ✅ 읽음 상태로 업데이트
        chatMessage.readMessage();
        chatMessageRepository.save(chatMessage);

        log.info("✅ 메시지 읽음 처리 완료: {}", ackDto.getMessageId());

        // ✅ 보낸 사용자(A)에게 WebSocket을 통해 읽음 상태 전송
        String destination = "/sub/chat/room/" + chatMessage.getRoomId();
        ReadReceiptDto readReceipt = new ReadReceiptDto(ackDto.getMessageId(), chatMessage.getSender());
        messagingTemplate.convertAndSend(destination, readReceipt);

        log.info("📩 읽음 상태 전송: {}", destination);
    }

    public List<ChatMessage> getChatMessages(String userId, String roomId, int page) {

        // ✅ 채팅방 존재 여부 확인
        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(roomId);

        if (chatRoomOptional.isEmpty()) {
            log.warn("❌ 채팅방을 찾을 수 없음: {}", roomId);
            throw new NotFoundException(new ResponseData<>(ErrorCode.DATA_NOT_FOUND.getCode(), ErrorCode.DATA_NOT_FOUND.getMessage(), null));
        }

        ChatRoom chatRoom = chatRoomOptional.get();

        // ✅ 사용자가 채팅방 참가자인지 확인
        if (!chatRoom.getParticipantIds().contains(userId)) {
            log.warn("🚫 접근 권한 없음 - userId: {}, roomId: {}", userId, roomId);
            throw new UnauthorizedException(new ResponseData<>(ErrorCode.DATA_FORBIDDEN_ACCESS.getCode(), ErrorCode.DATA_FORBIDDEN_ACCESS.getMessage(), null));
        }

        // ✅ 최신 메시지 50개씩 페이징 조회
        Pageable pageable = PageRequest.of(page, 50, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<ChatMessage> messagePage = chatMessageRepository.findByRoomId(roomId, pageable);

        log.info("📩 채팅 내역 조회 (userId={}, roomId={}, page={}): {}개",
                userId, roomId, page, messagePage.getNumberOfElements());

        return messagePage.getContent();
    }
    public boolean checkReceiverOnline(String receiverId, String chatRoomId) {
        String redisKey = "chatroom-" + chatRoomId;

        // ✅ 레디스에서 상대방이 현재 채팅방에 있는지 확인
        Boolean isOpponentActive = redisTemplate.opsForSet().isMember(redisKey, receiverId);
        if(isOpponentActive)
            return true;

        log.info("📢 상대방({})이 채팅방({})에 없음 -> 알림 전송", receiverId, chatRoomId);
        return false;

    }
}
