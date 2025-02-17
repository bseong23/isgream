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
            List<ChatMessage> chatMessages = chatService.getChatMessages(String.valueOf(userId), chatRoom.getId(), 99);
            long unreadCount = 0;
            String lastMessage = "";
            if (!chatMessages.isEmpty()){
                unreadCount = chatMessages.stream()
                        .filter(msg -> !msg.isRead()) // isRead가 false인 것만 필터링
                        .count();
                lastMessage = chatMessages.get(0).getContent();
            }

            UserInfo userInfo = userService.getUser(userId.equals(chatRoom.getParticipantIds().get(0)) ? Integer.valueOf(chatRoom.getParticipantIds().get(0)): Integer.valueOf(chatRoom.getParticipantIds().get(1)));
            ChatRoomsGetRes chatRoomsGetRes = ChatRoomsGetRes.builder()
                    .roomId(chatRoom.getId())
                    .LastMessageTime(chatRoom.getLastMessageTimestamp())
                    .newMessageCount((int)unreadCount)
                    .lastMessageUnread(lastMessage)
                    .opponentName(userInfo.nickname())
                    .build();
            chatRoomsGetResList.add(chatRoomsGetRes);
        }
        return chatRoomsGetResList;
    }


}

