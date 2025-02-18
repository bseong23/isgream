package com.ssafy.iscream.chat.dto.res;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ChatRoomsGetRes {
    String roomId;
    String opponentName;
    Integer newMessageCount;
    LocalDateTime LastMessageTime;
    String lastMessageUnread;

//
//                "roomId" : string (채팅방 아이디),
//            "opponentName" : "string" (상대방 이름),
//            "newMessageCount" : int (안읽은 새로운 메시지 수),
//            "lastMessageTime": DateTime(최근 메시지 시각),
//            "lastMessageUnread": string(안읽은 메시지 중 가장 최근 메시
}
