package com.ssafy.iscream.board.repository;

import com.ssafy.iscream.board.domain.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Integer> {
    void deleteByPostIdAndUserId(Integer postId, Integer userId);
    Boolean existsByPostIdAndUserId(Integer postId, Integer userId);
    Integer countByPostId(Integer postId);

    @Modifying
    @Query(value = "INSERT IGNORE INTO post_like (post_id, user_id) VALUES (:postId, :userId)", nativeQuery = true)
    void insertIgnore(@Param("postId") Integer postId, @Param("userId") Integer userId);
}
