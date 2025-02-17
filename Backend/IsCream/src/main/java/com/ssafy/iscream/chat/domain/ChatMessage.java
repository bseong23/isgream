package com.ssafy.iscream.chat.domain;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "chat_messages")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    @Id
    private String id;
    private String roomId;
    private String sender;
    private String receiver;
    private String content;
    private LocalDateTime timestamp;
    private boolean isRead;

    public void readMessage(){
        isRead = true;
    }
}