package com.ssafy.iscream.htpTest.repository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.iscream.htpTest.dto.request.HtpTestDiagnosisReq;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;
import java.util.LinkedHashMap;
import com.fasterxml.jackson.core.type.TypeReference;

@Service
@RequiredArgsConstructor
public class RedisService {
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String IMAGE_MAP_KEY_PREFIX = "imageMap:";

    // ✅ Redis에 저장 (순서 유지)
    public void saveImageMap(Integer childId, LinkedHashMap<String, HtpTestDiagnosisReq> map) {
        try {
            String json = objectMapper.writeValueAsString(map);
            redisTemplate.opsForValue().set(IMAGE_MAP_KEY_PREFIX + childId, json, 10, TimeUnit.MINUTES);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    // ✅ Redis에서 가져오기 (순서 유지)
    public LinkedHashMap<String, HtpTestDiagnosisReq> getImageMap(Integer childId) {
        String json = redisTemplate.opsForValue().get(IMAGE_MAP_KEY_PREFIX + childId);
        if (json == null) return new LinkedHashMap<>();
        try {
            return objectMapper.readValue(json, new TypeReference<LinkedHashMap<String, HtpTestDiagnosisReq>>() {});
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new LinkedHashMap<>();
        }
    }

    // ✅ Redis에서 삭제
    public void deleteImageMap(Integer childId) {
        redisTemplate.delete(IMAGE_MAP_KEY_PREFIX + childId);
    }
}