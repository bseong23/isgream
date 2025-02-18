package com.ssafy.iscream.chat.dto.res;

import com.ssafy.iscream.chat.domain.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ChatMessageResDto {
    private String messageId;
    private String roomId;
    private String sender;
    private String receiver;
    private String content;
    private boolean isRead;
    private LocalDateTime timestamp;
    public static ChatMessageResDto of(ChatMessage chatMessage) {
        return new ChatMessageResDto(
                chatMessage.getId(),
                chatMessage.getRoomId(),
                chatMessage.getSender(),
                chatMessage.getReceiver(),
                chatMessage.getContent(),
                chatMessage.isRead(),
                chatMessage.getTimestamp()
        );
    }
}
