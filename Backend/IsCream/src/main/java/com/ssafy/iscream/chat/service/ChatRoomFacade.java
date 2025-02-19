package com.ssafy.iscream.chat.service;

import com.ssafy.iscream.chat.domain.ChatMessage;
import com.ssafy.iscream.chat.domain.ChatRoom;
import com.ssafy.iscream.chat.dto.res.ChatRoomsGetRes;
import com.ssafy.iscream.children.domain.Child;
import com.ssafy.iscream.children.service.ChildrenService;
import com.ssafy.iscream.user.domain.User;
import com.ssafy.iscream.user.dto.response.UserInfo;
import com.ssafy.iscream.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatRoomFacade {

    private final UserService userService;
    private final ChatRoomService chatRoomService;
    private final ChatService chatService;

    public List<ChatRoomsGetRes> getChatRooms(Integer userId) {
        List<ChatRoom> chatRooms = chatRoomService.getUserChatRooms(userId);
        List<ChatRoomsGetRes> chatRoomsGetResList = new ArrayList<>();
        for (ChatRoom chatRoom : chatRooms) {

            int unreadCount = chatService.getChatMessagesReceivedCount(chatRoom.getId(), String.valueOf(userId));
            String lastMessage = "";
            ChatMessage chatMessage = chatService.getLastChatMessage(chatRoom.getId());
            if (chatMessage != null) {
                lastMessage = chatMessage.getContent();
            }
            Integer receiver = userId.equals(Integer.valueOf(chatRoom.getParticipantIds().get(0))) ? Integer.valueOf(chatRoom.getParticipantIds().get(1)): Integer.valueOf(chatRoom.getParticipantIds().get(0));
            UserInfo userInfo = userService.getUser(receiver);
            ChatRoomsGetRes chatRoomsGetRes = ChatRoomsGetRes.builder()
                    .roomId(chatRoom.getId())
                    .LastMessageTime(chatRoom.getLastMessageTimestamp())
                    .newMessageCount(unreadCount)
                    .lastMessageUnread(lastMessage)
                    .opponentName(userInfo.nickname())
                    .receiver(String.valueOf(receiver))
                    .build();
            chatRoomsGetResList.add(chatRoomsGetRes);
        }
        return chatRoomsGetResList;
    }


}

