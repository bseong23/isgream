package com.ssafy.iscream.chat.domain;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "chat_rooms")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoom {
    @Id
    private String id;

    private List<String> participantIds;
    private LocalDateTime lastMessageTimestamp; // 🔹 마지막 메시지 전송 시간 추가

    // 마지막 메시지 업데이트 메서드
    public void updateLastMessageTimestamp(LocalDateTime timestamp) {
        this.lastMessageTimestamp = timestamp;
    }


}
