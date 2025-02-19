package com.ssafy.iscream.chat.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Slf4j
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        registry.setApplicationDestinationPrefixes("/pub"); // 클라이언트가 메시지를 발행하는 경로

        registry.enableSimpleBroker("/sub") // ✅ STOMP 자체 브로커 사용
                .setTaskScheduler(heartBeatScheduler()); // ✅ Heartbeat 감지용 TaskScheduler 추가

    }

    @Bean
    public ThreadPoolTaskScheduler heartBeatScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(1);
        scheduler.initialize();
        return scheduler;
    }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        log.info("🟢 WebSocket 엔드포인트 등록됨: /ws"); // ✅ 엔드포인트 등록 확인 로그 추가

        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
                //.withSockJS(); //이거하면 웹소켓 안됨 ㅇ으으아아아으아
        registry.addEndpoint("/api/ws/") // ✅ /api/ws 엔드포인트 등록
                .setAllowedOriginPatterns("*");
                //.withSockJS();
    }
}
