package com.ssafy.iscream.chat.dto.req;

import lombok.Data;

@Data
public class ChatRoomCreateReq {
    String SenderId;
    String receiverId;
}
