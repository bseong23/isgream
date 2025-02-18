package com.ssafy.iscream.chat.controller;

import com.ssafy.iscream.auth.user.Login;
import com.ssafy.iscream.chat.domain.ChatMessage;
import com.ssafy.iscream.chat.dto.ChatMessageDto;
import com.ssafy.iscream.chat.dto.MessageAckDto;
import com.ssafy.iscream.chat.service.ChatFacade;
import com.ssafy.iscream.chat.service.ChatService;
import com.ssafy.iscream.common.util.ResponseUtil;
import com.ssafy.iscream.user.domain.User;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Slf4j
@Controller
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final ChatFacade chatFacade;

    @MessageMapping("/chat/send")
    public void sendMessage(@Payload ChatMessageDto chatMessageDto) {
        log.info("📤 메시지 전송 요청: {}", chatMessageDto);
        String destination = "/sub/chat/room-" + chatMessageDto.getRoomId();

        log.info("📢 메시지 브로커에 메시지 발행: {}", destination);

        chatFacade.sendMessage(chatMessageDto);
    }

    @MessageMapping("/chat/ack")
    public void messageReceivedAck(@Payload MessageAckDto ackDto) {
        chatService.handleAck(ackDto);
    }



    /**
     * ✅ 특정 채팅방의 메시지 불러오기 (페이지네이션)
     */
    @GetMapping("/{roomId}/messages")
    @Operation(summary = "채팅방 입장", tags = "채팅방 입장")
    public ResponseEntity<?> getChatMessages(@Login User user, @PathVariable String roomId, @RequestParam(defaultValue = "0") int page) {

        List<ChatMessage> messages = chatService.getChatMessages(String.valueOf(user.getUserId()), roomId, page);
        return ResponseUtil.success(messages);
    }
}
