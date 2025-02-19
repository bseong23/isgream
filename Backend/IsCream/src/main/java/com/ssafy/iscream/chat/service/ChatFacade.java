package com.ssafy.iscream.chat.service;

import com.ssafy.iscream.chat.dto.ChatMessageDto;
import com.ssafy.iscream.noti.service.NotifyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatFacade {

    private final ChatService chatService;
    private final NotifyService notifyService;
    public void sendMessage(ChatMessageDto chatMessageDto){
        chatService.sendMessage(chatMessageDto);

        // 상대방이 채팅방에 없으면 알림 보냄
        if (!chatService.checkReceiverOnline(chatMessageDto.getReceiver(), chatMessageDto.getRoomId()))
            notifyService.sendChatNotify(Integer.valueOf(chatMessageDto.getReceiver()),null);
    }
}
