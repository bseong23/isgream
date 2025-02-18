package com.ssafy.iscream.board.service;

import com.ssafy.iscream.board.domain.Post;
import com.ssafy.iscream.board.repository.PostLikeRepository;
import com.ssafy.iscream.board.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PostLikeService {

    private final RedisTemplate<String, Object> redisTemplate;

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;

    private String getLikeKey(Integer postId) {
        return "post:" + postId + ":likes";
    }

    private String getLikesCountKey(Integer postId) {
        return "post:like:" + postId + ":likeCount";
    }

    // 게시글 삭제 시 Redis에 저장된 좋아요 정보 삭제
    public void removeLikeCount(Integer postId) {
        redisTemplate.delete(getLikesCountKey(postId));
        redisTemplate.opsForSet().remove(getLikeKey(postId));
    }

    // 게시글 좋아요 개수 조회
    public Integer getPostLikes(Integer postId) {
        String countKey = getLikesCountKey(postId);
        Integer count = (Integer) redisTemplate.opsForValue().get(countKey);

        return count == null ? 0 : count;

//        if (count == null) {
//            count = postLikeRepository.countById_PostId(postId);
//
//            if (count != 0) {
//                redisTemplate.opsForValue().set(countKey, count);
//            }
//        }
//
//        return count;
    }

    // 게시글 좋아요
    public void addPostLike(Integer postId, Integer userId) {
        if (!isUserLiked(postId, userId)) {
            redisTemplate.opsForSet().add(getLikeKey(postId), userId.toString());
            redisTemplate.opsForValue().increment(getLikesCountKey(postId));
        }
    }

    // 게시글 좋아요 취소
    @Transactional
    public void deletePostLike(Integer postId, Integer userId) {
        if (isUserLiked(postId, userId)) {
            redisTemplate.opsForSet().remove(getLikeKey(postId), userId.toString());
            redisTemplate.opsForValue().decrement(getLikesCountKey(postId));

            postLikeRepository.deleteById_PostIdAndId_UserId(postId, userId);
        }
    }

    // 사용자 좋아요 여부 확인
    public boolean isUserLiked(Integer postId, Integer userId) {
        if (userId == null) {
            return false;
        }

        String likeKey = getLikeKey(postId);
        Boolean isMember = redisTemplate.opsForSet().isMember(likeKey, userId.toString());

        if (Boolean.TRUE.equals(isMember)) {
            return true;
        }

        // Redis에 없는 경우 - DB에서 조회
        boolean exist = postLikeRepository.existsById_PostIdAndId_UserId(postId, userId);

        // DB에 있는 사용자인 경우 다시 Redis에 저장
        if (exist) {
            redisTemplate.opsForSet().add(likeKey, userId.toString());
        }

        return exist;
    }

    @Scheduled(cron = "0 */30 * * * ?")
//    @Scheduled(cron = "0/10 * * * * ?")
    @Transactional
    public void updateLikeToDatabase() {
        Set<String> keys = redisTemplate.keys("post:*:likes");

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

    @Transactional
    public void updatePostLikeCount() {
        Set<String> keys = redisTemplate.keys("post:like:*:likeCount");

        for (String key : keys) {
            Integer postId = Integer.parseInt(key.split(":")[2]);

            Object likeCount = redisTemplate.opsForValue().get(key);

            if (likeCount == null) {
                likeCount = 0;
            }

//            if (likeCount == null) {
//                likeCount = postLikeRepository.countById_PostId(postId);
//
//                if (Integer.parseInt(likeCount.toString()) != 0) {
//                    redisTemplate.opsForValue().set(key, likeCount);
//                }
//            }

            Optional<Post> post = postRepository.findById(postId);

            if (post.isPresent()) {
                post.get().updateLikeCount(Integer.parseInt(likeCount.toString()));
            }
        }
    }

}
