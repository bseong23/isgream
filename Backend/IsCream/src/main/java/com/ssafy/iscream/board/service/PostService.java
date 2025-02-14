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
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

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

        // 작성 시 Redis에 좋아요 수 0으로 저장
        postLikeService.initLikeCount(savePost.getPostId());

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

        postLikeService.removeLikeCount(postId); // Redis에 저장된 좋아요 정보 삭제

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

        if (req.getSort().equals("like")) {
            List<Integer> postIds = postLikeService.getLikePost(req.getLastLikeCount(), req.getLastId(), req.getSize());

            System.out.println(postIds.size());

            Page<Post> list = postQueryRepository.searchPosts(req, pageable, postIds);

            List<Post> result = list.stream()
                    .sorted((post1, post2) -> {
                        // 좋아요 수 기준 내림차순
                        int likeComparison = Integer.compare(getPostLikes(post2.getPostId()), getPostLikes(post1.getPostId()));

                        // 좋아요 수가 같으면 postId 기준 내림차순
                        if (likeComparison == 0) {
                            return Integer.compare(post2.getPostId(), post1.getPostId());  // postId 기준 내림차순
                        }

                        return likeComparison;  // 좋아요 수 기준으로 비교
                    })
                    .filter(post -> {
                        // postId가 null이 아닐 때만 필터링
                        if (post.getPostId() != null) {
                            return req.getLastId() == null || post.getPostId() < req.getLastId();
                        }
                        return true;  // postId가 null이면 필터를 통과시킴
                    })
                    .limit(req.getSize())  // 요청된 개수만큼 가져오기
                    .toList();

            System.out.println("게시글 아이디");
            for (Post post : result) {
                System.out.print(post.getPostId() + " ");
            }

//            System.out.println(result);

            return PageableExecutionUtils.getPage(result, pageable, list::getTotalElements);

//            return postQueryRepository.searchPosts(req, pageable, postIds);
        }

        return postQueryRepository.searchPosts(req, pageable);
    }

    // 인기글
    public List<Post> getHotPost() {
        List<Integer> postIds = postLikeService.getTop5LikePostId();
        List<Post> result = new ArrayList<>();

        for (Integer postId : postIds) {
            Optional<Post> post = postRepository.findById(postId);
            post.ifPresent(result::add);
        }

        return result;
    }

    // 최신글
    public List<Post> getLatestPost() {
        return postRepository.findTop5ByOrderByCreatedAtDescPostIdDesc();
    }

    // 게시글 좋아요 개수 조회
    public Integer getPostLikes(Integer postId) {
        return postLikeService.getPostLikes(postId);
    }

    // 게시글 좋아요
    public void addPostLike(Integer postId, Integer userId) {
        postLikeService.addPostLike(postId, userId);
    }

    // 게시글 좋아요 취소
    @Transactional
    public void deletePostLike(Integer postId, Integer userId) {
        postLikeService.deletePostLike(postId, userId);
    }

    // 사용자 좋아요 여부 확인
    public boolean isUserLiked(Integer postId, Integer userId) {
        return postLikeService.isUserLiked(postId, userId);
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

