package com.ssafy.iscream.chat.controller;

import com.ssafy.iscream.auth.user.Login;
import com.ssafy.iscream.chat.domain.ChatRoom;
import com.ssafy.iscream.chat.dto.req.ChatRoomCreateReq;
import com.ssafy.iscream.chat.dto.res.ChatRoomsGetRes;
import com.ssafy.iscream.chat.service.ChatRoomFacade;
import com.ssafy.iscream.chat.service.ChatRoomService;
import com.ssafy.iscream.common.response.ResponseData;
import com.ssafy.iscream.common.util.ResponseUtil;
import com.ssafy.iscream.user.domain.User;
import com.ssafy.iscream.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chatrooms")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;
    private final ChatRoomFacade chatRoomFacade;

    /**
     * ✅ 목록 불러오기
     */
    @GetMapping()
    @Operation(summary = "목록 불러오기", tags = "목록불러")
    public ResponseEntity<?> getUserChatRooms(@Login User user) {
        return ResponseUtil.success(chatRoomFacade.getChatRooms(user.getUserId()));
    }

    /**
     * ✅ 채팅방 생성 (이미 존재하면 기존 채팅방 반환)
     */
    @PostMapping("/create")
    @Operation(summary = "채팅방 생성", tags = "채팅방 생성")
    public ResponseEntity<?> createChatRoom(@Login User user, @Parameter String receiverId) {
        ChatRoom chatRoom = chatRoomService.createOrGetChatRoom(String.valueOf(user.getUserId()) , receiverId);
        return ResponseUtil.success(chatRoom);
    }

    /**
     * ✅ 사용자가 채팅방을 나감 (채팅방 삭제 가능)
     */
    @DeleteMapping("/{roomId}/leave")
    public ResponseEntity<?> leaveChatRoom(@Login User user, @PathVariable String roomId) {
        chatRoomService.leaveChatRoom(roomId, String.valueOf(user.getUserId()));
        return ResponseUtil.success();
    }
}