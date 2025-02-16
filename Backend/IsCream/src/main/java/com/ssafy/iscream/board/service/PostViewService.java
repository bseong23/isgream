package com.ssafy.iscream.board.service;

import com.ssafy.iscream.board.domain.Post;
import com.ssafy.iscream.board.repository.PostRepository;
import com.ssafy.iscream.user.domain.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PostViewService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final PostRepository postRepository;

    // 게시글 조회 여부 확인
    public void checkPostView(Post post, User user, HttpServletRequest request) {
        String key = "post:viewed:" + post.getPostId() + ":" + getViewUserId(user, request);

        Boolean isNotViewed = redisTemplate.opsForValue().setIfAbsent(key, "Viewed", Duration.ofHours(24));

        // 24시간 이내에 방문한 적이 없는 경우
        if (Boolean.TRUE.equals(isNotViewed)) {
            incrementViewCount(post.getPostId());
        }
    }

    // 조회수 증가
    public void incrementViewCount(Integer postId) {
        String key = "post:views:" + postId;
        getViewCount(postId); // Redis에 조회수 저장되어 있는지 확인

        redisTemplate.opsForValue().increment(key);
    }

    // Redis에 저장된 게시글 조회수 가져오기
    public Integer getViewCount(Integer postId) {
        String key = "post:views:" + postId;
        Integer viewCount = (Integer) redisTemplate.opsForValue().get(key);

        if (viewCount == null) {
            viewCount = postRepository.findById(postId)
                    .map(Post::getViewCount)
                    .orElse(0);

            redisTemplate.opsForValue().set(key, viewCount);
        }

        return viewCount;
    }

    // 조회수 증가 시 Redis에 저장될 사용자 아이디 만들기
    private String getViewUserId(User user, HttpServletRequest request) {
        String userIdentifier;

        // 로그인한 경우 userId 사용, 비회원은 IP 주소와 User-Agent를 사용
        if (user != null) {
            userIdentifier = "user:" + user.getUserId();
        } else {
            String ipAddress = request.getHeader("X-Forwarded-For");

            if (ipAddress != null && !ipAddress.isEmpty()) {
                ipAddress = ipAddress.split(",")[0].trim();
            } else {
                ipAddress = request.getRemoteAddr();
            }

            String userAgent = request.getHeader("User-Agent");

            if (userAgent == null || userAgent.isEmpty()) {
                userIdentifier = "guest:" + ipAddress.hashCode();
            } else {
                String identifier = ipAddress + userAgent;
                userIdentifier = "guest:" + (long) identifier.hashCode();
            }
        }

        return userIdentifier;
    }

    @Scheduled(cron = "0 */30 * * * ?")
    @Transactional
    public void updateViewCountToDatabase() {
        Set<String> keys = redisTemplate.keys("post:views:*");

        for (String key : keys) {
            Integer postId = Integer.parseInt(key.split(":")[2]);
            Integer viewCount = (Integer) redisTemplate.opsForValue().get(key);

            if (viewCount != null) {
                Optional<Post> post = postRepository.findById(postId);

                if (post.isPresent()) {
                    Integer dbViewCount = post.get().getViewCount();

                    // Redis 조회수와 DB와 일치하지 않을 경우에만 업데이트
                    if (!viewCount.equals(dbViewCount)) {
                        post.get().updateViewCount(viewCount);
                    }
                }
            }
        }

        redisTemplate.delete(keys);
    }
}

