package com.ssafy.iscream.chat.dto;

import com.ssafy.iscream.chat.domain.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
public class ChatMessageDto {
    private String messageId;
    private String roomId;
    private String sender;
    private String receiver;
    private String content;
}
