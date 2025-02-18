package com.ssafy.iscream.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageAckDto {
    private String messageId; // 읽은 메시지의 ID
    private String readerId;    // 읽은 사람 (B)
}
