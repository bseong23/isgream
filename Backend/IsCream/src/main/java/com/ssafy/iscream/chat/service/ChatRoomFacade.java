package com.ssafy.iscream.chat.service;

import com.ssafy.iscream.chat.domain.ChatMessage;
import com.ssafy.iscream.chat.domain.ChatRoom;
import com.ssafy.iscream.chat.dto.res.ChatRoomsGetRes;
import com.ssafy.iscream.children.domain.Child;
import com.ssafy.iscream.children.service.ChildrenService;
import com.ssafy.iscream.common.exception.BadRequestException;
import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.common.exception.MinorException;
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
        // 유저 유효성 검사
        if (!userService.checkUserValidity(userId))
            throw new MinorException.DataException(ErrorCode.DATA_NOT_FOUND);

        List<ChatRoom> chatRooms = chatRoomService.getUserChatRooms(userId);
        List<ChatRoomsGetRes> chatRoomsGetResList = new ArrayList<>();

        for (ChatRoom chatRoom : chatRooms) {
            // 채팅방 목록에서 보이는 정보 생성
            int unreadCount = chatService.getChatMessagesReceivedCount(chatRoom.getId(), String.valueOf(userId));
            String lastMessage = "";
            ChatMessage chatMessage = chatService.getLastChatMessage(chatRoom.getId());

            // 마지막으로 보낸 메시지
            if (chatMessage != null) {
                lastMessage = chatMessage.getContent();
            }


            Integer receiver;
            String receiverName;
            // 상대방이 유효한 유저가 아닌 경우 이름을 (떠난 상대)로 변경
            if(chatRoom.getParticipantIds().size() == 1){
                receiver = null;
                receiverName = "떠난 상대";
            }
            else{
                receiver = userId.equals(Integer.valueOf(chatRoom.getParticipantIds().get(0))) ? Integer.valueOf(chatRoom.getParticipantIds().get(1)): Integer.valueOf(chatRoom.getParticipantIds().get(0));
                //상대방의 유효성 검사
                if(userService.checkUserValidity(receiver))
                    receiverName = userService.getUser(receiver).nickname();
                else {
                    receiver = null;
                    receiverName = "탈퇴한 상대";
                }
            }
            ChatRoomsGetRes chatRoomsGetRes = ChatRoomsGetRes.builder()
                    .roomId(chatRoom.getId())
                    .LastMessageTime(chatRoom.getLastMessageTimestamp())
                    .newMessageCount(unreadCount)
                    .lastMessageUnread(lastMessage)
                    .opponentName(receiverName)
                    .receiver(String.valueOf(receiver))
                    .build();
            chatRoomsGetResList.add(chatRoomsGetRes);
        }
        return chatRoomsGetResList;
    }


}

