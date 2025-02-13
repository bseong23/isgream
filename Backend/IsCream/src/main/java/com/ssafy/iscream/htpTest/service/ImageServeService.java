package com.ssafy.iscream.htpTest.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ssafy.iscream.htpTest.dto.request.HtpTestDiagnosisReq;
import com.ssafy.iscream.user.domain.User;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class ImageServeService {
    private final WebClient webClient;

    public ImageServeService(WebClient.Builder webClientBuilder) {
        // 서버 URL
        this.webClient = webClientBuilder.baseUrl("https://i12a407.p.ssafy.io/ai").build();
    }

    public String sendImageData(User user, List<HtpTestDiagnosisReq> data) {
        if (data == null || data.isEmpty()) {
            return "No data to send.";
        }
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode jsonObject = objectMapper.createObjectNode();
        jsonObject.set("files", objectMapper.valueToTree(data));
        try {
            String response = webClient.post()
                    .uri("/htp/predict")  // 엔드포인트 설정
                    .bodyValue(jsonObject)  // JSON 데이터 전송
                    .retrieve()
                    .bodyToMono(String.class)  // 응답을 String으로 변환
                    .block();  // 동기적으로 응답 대기 후 반환

            return response != null ? response : "No response from server.";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

}
