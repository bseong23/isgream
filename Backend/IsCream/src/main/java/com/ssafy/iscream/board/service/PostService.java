package com.ssafy.iscream.board.service;

import com.ssafy.iscream.board.domain.Post;
import com.ssafy.iscream.board.dto.request.PostCreateReq;
import com.ssafy.iscream.board.dto.request.PostReq;
import com.ssafy.iscream.board.dto.request.PostUpdateReq;
import com.ssafy.iscream.board.repository.PostQueryRepository;
import com.ssafy.iscream.board.repository.PostRepository;
import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.common.exception.MinorException.DataException;
import com.ssafy.iscream.user.domain.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostQueryRepository postQueryRepository;

    private final PostImageService postImageService;
    private final PostLikeService postLikeService;
    private final PostViewService postViewService;

    // 게시글 작성
    @Transactional
    public Integer createPost(User user, PostCreateReq postReq, List<MultipartFile> files) {
        Post post = Post.builder()
                .title(postReq.getTitle())
                .content(postReq.getContent())
                .userId(user.getUserId())
                .build();

        Post savePost = postRepository.save(post);
        postImageService.saveImages(savePost, files);

        return savePost.getPostId();
    }

    // 게시글 수정
    @Transactional
    public void updatePost(Integer postId, Integer userId, PostUpdateReq req, List<MultipartFile> files) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new DataException(ErrorCode.DATA_NOT_FOUND));

        if (!userId.equals(post.getUserId())) {
            throw new DataException(ErrorCode.DATA_FORBIDDEN_UPDATE);
        }

        post.updatePost(req.getTitle(), req.getContent());
        postImageService.updateImages(post, req.getDeleteFiles(), files);
    }

    // 게시글 삭제
    @Transactional
    public void deletePost(Integer postId, Integer userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new DataException(ErrorCode.DATA_NOT_FOUND));

        if (!userId.equals(post.getUserId())) {
            throw new DataException(ErrorCode.DATA_FORBIDDEN_UPDATE);
        }

        postImageService.deleteImages(postId);
        postRepository.deleteById(postId);
    }

    // 게시글 상세 조회
    public Post getPost(Integer postId, User user, HttpServletRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new DataException(ErrorCode.DATA_NOT_FOUND));

        postViewService.checkPostView(post, user, request);

        return post;
    }

    // 게시글 목록 조회
    public Page<Post> getPostPage(PostReq req) {
        Pageable pageable = PageRequest.of(0, req.getSize());
        return postQueryRepository.searchPosts(req, pageable);
    }

    // 인기글
    public List<Post> getHotPost() {
        return postQueryRepository.findTop5LikePost();
    }

    // 최신글
    public List<Post> getLatestPost() {
        return postRepository.findTop5ByOrderByCreatedAtDesc();
    }

    // 게시글 좋아요 개수 조회
    public Integer getPostLikes(Integer postId) {
        return postLikeService.getPostLikes(postId);
    }

    // 게시글 좋아요
    public void addPostLike(Integer postId, User user) {
        postLikeService.addPostLike(postId, user);
    }

    // 게시글 좋아요 취소
    @Transactional
    public void deletePostLike(Integer postId, Integer userId) {
        postLikeService.deletePostLike(postId, userId);
    }

    // 사용자 좋아요 여부 확인
    public boolean isUserLiked(Post post, User user) {
        return postLikeService.isUserLiked(post, user);
    }

    // 게시글 조회수
    public Integer getPostViewCount(Integer postId) {
        return postViewService.getViewCount(postId);
    }

    // 게시글 썸네일
    public String getPostThumbnail(Integer postId) {
        return postImageService.getThumbnail(postId);
    }

    // 게시글 이미지
    public List<String> getPostImages(Integer postId) {
        return postImageService.getImages(postId);
    }

}

