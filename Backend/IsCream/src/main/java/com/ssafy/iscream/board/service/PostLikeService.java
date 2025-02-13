package com.ssafy.iscream.board.service;

import com.ssafy.iscream.board.domain.Post;
import com.ssafy.iscream.board.repository.PostLikeRepository;
import com.ssafy.iscream.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class PostLikeService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final PostLikeRepository postLikeRepository;

    private String getLikeKey(Integer postId) {
        return "post:" + postId + ":likes";
    }

    private String getLikesCountKey(Integer postId) {
        return "post:" + postId + ":likesCount";
    }

    // 게시글 좋아요 개수 조회
    public Integer getPostLikes(Integer postId) {
        String countKey = getLikesCountKey(postId);
        Integer count = (Integer) redisTemplate.opsForValue().get(countKey);

        return count != null ? count : 0;
    }

    // 게시글 좋아요
    public void addPostLike(Integer postId, User user) {
        String likeKey = getLikeKey(postId);

        redisTemplate.opsForSet().add(likeKey, user.getUserId().toString());
        redisTemplate.opsForValue().increment(getLikesCountKey(postId));
    }

    // 게시글 좋아요 취소
    @Transactional
    public void deletePostLike(Integer postId, Integer userId) {
        String likeKey = getLikeKey(postId);

        redisTemplate.opsForSet().remove(likeKey, userId.toString());
        redisTemplate.opsForValue().decrement(getLikesCountKey(postId));

        postLikeRepository.deleteByPostIdAndUserId(postId, userId);
    }

    // 사용자 좋아요 여부 확인
    public boolean isUserLiked(Post post, User user) {
        if (user == null) {
            return false;
        }

        String likeKey = getLikeKey(post.getPostId());
        Boolean isMember = redisTemplate.opsForSet().isMember(likeKey, user.getUserId().toString());

        if (Boolean.TRUE.equals(isMember)) {
            return true;
        }

        // Redis에 없는 경우에만 DB에서 조회
        return postLikeRepository.existsByPostIdAndUserId(post.getPostId(), user.getUserId());
    }

    @Scheduled(cron = "0 */30 * * * ?")
    @Transactional
    public void updateLikeToDatabase() {
        Set<String> keys = redisTemplate.keys("post:*:likes");

        if (keys.isEmpty()) {
            return;
        }

        for (String key : keys) {
            Integer postId = Integer.parseInt(key.split(":")[1]);
            Set<Object> userIds = redisTemplate.opsForSet().members(key);

            if (userIds == null || userIds.isEmpty()) {
                continue;
            }

            // 중복 방지
            userIds.forEach(userId -> postLikeRepository.insertIgnore(postId, Integer.parseInt(userId.toString())));

            redisTemplate.delete(key); // 동기화 후 삭제
        }
    }
}
