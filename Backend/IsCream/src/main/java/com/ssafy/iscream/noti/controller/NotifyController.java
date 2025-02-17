package com.ssafy.iscream.noti.controller;

import com.ssafy.iscream.auth.user.Login;
import com.ssafy.iscream.common.util.ResponseUtil;
import com.ssafy.iscream.noti.service.NotifyService;
import com.ssafy.iscream.user.domain.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notify")
public class NotifyController {

    private final NotifyService notifyService;

    @Operation(summary = "FCM 토큰 저장", tags = "notify")
    @PostMapping(value = "/token")
    public ResponseEntity<?> addFcmToken(@Login User user,
                      @Schema(example = "{\"token\": \"string\"}") @RequestBody Map<String, String> map) {
        notifyService.addFcmToken(user.getUserId(), map.get("token"));
        return ResponseUtil.success();
    }

    @Operation(summary = "FCM 토큰 삭제", tags = "notify")
    @DeleteMapping(value = "/token")
    public ResponseEntity<?> removeFcmToken(@Login User user) {
        notifyService.removeFcmToken(user.getUserId());
        return ResponseUtil.success();
    }

    @Operation(summary = "알림 목록 조회", tags = "notify")
    @GetMapping
    public ResponseEntity<?> getNotifyList(@Login User user) {
        return ResponseUtil.success(notifyService.getNotifyList(user.getUserId()));
    }

    @Operation(summary = "알림 읽음 처리", tags = "notify")
    @GetMapping("/{notifyId}")
    public ResponseEntity<?> updateNotifyStatus(@PathVariable Integer notifyId) {
        notifyService.updateNotifyStatus(notifyId);
        return ResponseUtil.success();
    }

}
