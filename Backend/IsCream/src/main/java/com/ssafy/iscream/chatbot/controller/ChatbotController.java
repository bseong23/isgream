package com.ssafy.iscream.chatbot.controller;


import com.ssafy.iscream.chatbot.dto.request.QuestionReq;
import com.ssafy.iscream.chatbot.service.ChatbotService;
import com.ssafy.iscream.common.util.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/chatbot")
@RestController
@RequiredArgsConstructor
public class ChatbotController {
    private final ChatbotService chatbotService;
    
    @PostMapping
    @Operation(summary = "심시 상태 질문 챗봇", tags = "chatbot")
    public ResponseEntity<?> sendMessage(QuestionReq req) {
        return ResponseUtil.success(chatbotService.sendQueryData(req));
    }

}
