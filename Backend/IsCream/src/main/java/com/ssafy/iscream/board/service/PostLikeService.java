package com.ssafy.iscream.board.service;

import com.ssafy.iscream.board.repository.PostLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostLikeService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final PostLikeRepository postLikeRepository;

    private String getLikeKey(Integer postId) {
        return "post:" + postId + ":likes";
    }

    private String getLikesCountKey(Integer postId) {
        return "post:like" + postId + ":likesCount";
    }

    // 게시글 작성 시에 사용
    public void initLikeCount(Integer postId) {
        redisTemplate.opsForZSet().add("likes:posts", postId.toString(), 0);
    }

    // 게시글 삭제 시 Redis에 저장된 좋아요 정보 삭제
    public void removeLikeCount(Integer postId) {
        redisTemplate.opsForZSet().remove("likes:posts", postId.toString());
        redisTemplate.delete(getLikesCountKey(postId));
        redisTemplate.opsForSet().remove(getLikeKey(postId));
    }

    // 게시글 좋아요 개수 조회
    public Integer getPostLikes(Integer postId) {
        String countKey = getLikesCountKey(postId);
        Integer count = (Integer) redisTemplate.opsForValue().get(countKey);

        if (count == null) {
            count = postLikeRepository.countById_PostId(postId);
            redisTemplate.opsForValue().set(countKey, count);
        }

        return count;
    }

    // 게시글 좋아요
    public void addPostLike(Integer postId, Integer userId) {
        String likeKey = getLikeKey(postId);

        if (!isUserLiked(postId, userId)) {
            redisTemplate.opsForZSet().incrementScore("likes:posts", postId.toString(), 1);
            redisTemplate.opsForSet().add(likeKey, userId.toString());
            redisTemplate.opsForValue().increment(getLikesCountKey(postId));
        }
    }

    // 게시글 좋아요 취소
    @Transactional
    public void deletePostLike(Integer postId, Integer userId) {
        String likeKey = getLikeKey(postId);

        if (isUserLiked(postId, userId)) {
            redisTemplate.opsForZSet().incrementScore("likes:posts", postId.toString(), -1);
            redisTemplate.opsForSet().remove(likeKey, userId.toString());
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

    public List<Integer> getTop5LikePostId() {
        Set<Object> result = redisTemplate.opsForZSet().reverseRange("likes:posts", 0, 4);
        return Objects.requireNonNull(result).stream()
                .map(obj -> Integer.parseInt(obj.toString())).collect(Collectors.toList());
    }

    public List<Integer> getLikePost(Integer lastLikeCount, Integer lastId, Integer size) {
        Set<Object> result;

        if (lastLikeCount == null) {
            result = redisTemplate.opsForZSet().reverseRange("likes:posts", 0, -1);

//            System.out.println(result.toString());

            return Objects.requireNonNull(result).stream()
                .map(obj -> Integer.parseInt(obj.toString())).collect(Collectors.toList());
        } else {
//            result = redisTemplate.opsForZSet().reverseRangeByScore(
//                    "likes:posts", Double.MIN_VALUE, lastLikeCount);

            if (lastLikeCount == 0) {
                result = redisTemplate.opsForZSet().reverseRangeByScore("likes:posts", 0, 0);
            } else {
                result = redisTemplate.opsForZSet().reverseRangeByScore("likes:posts", Double.MIN_VALUE, lastLikeCount);
            }

            return Objects.requireNonNull(result).stream()
                    .map(obj -> Integer.parseInt(obj.toString())).collect(Collectors.toList());

//            return Objects.requireNonNull(result).stream()
//                    .map(obj -> Integer.parseInt(obj.toString()))  // Redis 결과를 Integer로 변환
////                    .filter(postId -> postId < lastId)  // lastId보다 작은 게시글만 필터링
//                    .sorted((postId1, postId2) -> {
//                        // 좋아요 수 기준 내림차순
//                        int likeComparison = Integer.compare(getPostLikes(postId2), getPostLikes(postId1));
//
//                        // 좋아요 수가 같으면 postId 기준 내림차순
//                        if (likeComparison == 0) {
//                            return Integer.compare(postId2, postId1);  // postId 기준 내림차순
//                        }
//
//                        return likeComparison;  // 좋아요 수 기준으로 비교
//                    })
//                    .limit(size)
//                    .collect(Collectors.toList());
        }
    }

}
