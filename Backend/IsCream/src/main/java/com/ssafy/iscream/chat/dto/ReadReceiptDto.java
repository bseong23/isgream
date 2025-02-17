package com.ssafy.iscream.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReadReceiptDto {
    private String messageId; // 읽은 메시지의 ID
    private String sender;    // 원래 보낸 사람 (A)
}