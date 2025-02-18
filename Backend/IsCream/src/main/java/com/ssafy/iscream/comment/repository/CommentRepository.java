package com.ssafy.iscream.comment.repository;

import com.ssafy.iscream.comment.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    Integer countByPostId(Integer postId);
}
