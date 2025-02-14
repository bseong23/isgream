package com.ssafy.iscream.htpTest.repository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.iscream.htpTest.dto.request.HtpTestDiagnosisReq;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String IMAGE_MAP_KEY_PREFIX = "imageMap:"; // Redis Key Prefix

    // ✅ Redis에 저장 (childId 기준)
    public void saveImageMap(Integer childId, Map<String, HtpTestDiagnosisReq> map) {
        try {
            String json = objectMapper.writeValueAsString(map);
            redisTemplate.opsForValue().set(IMAGE_MAP_KEY_PREFIX + childId, json, 10, TimeUnit.MINUTES); // 10분 유지
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    // ✅ Redis에서 가져오기
    public Map<String, HtpTestDiagnosisReq> getImageMap(Integer childId) {
        String json = redisTemplate.opsForValue().get(IMAGE_MAP_KEY_PREFIX + childId);
        if (json == null) return new HashMap<>(); // Redis에 없으면 빈 HashMap 반환
        try {
            return objectMapper.readValue(json, HashMap.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new HashMap<>();
        }
    }

    // ✅ Redis에서 삭제
    public void deleteImageMap(Integer childId) {
        redisTemplate.delete(IMAGE_MAP_KEY_PREFIX + childId);
    }
}