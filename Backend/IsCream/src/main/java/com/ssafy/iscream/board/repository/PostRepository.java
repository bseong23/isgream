package com.ssafy.iscream.board.repository;

import com.ssafy.iscream.board.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findTop5ByOrderByCreatedAtDescPostIdDesc();
    List<Post> findByPostIdIn(List<Integer> postIds);
}
