package com.ssafy.iscream.board.service;

import com.ssafy.iscream.board.domain.Post;
import com.ssafy.iscream.board.dto.request.PostReq;
import com.ssafy.iscream.board.dto.response.PostDetail;
import com.ssafy.iscream.board.dto.response.PostInfo;
import com.ssafy.iscream.board.dto.response.PostList;
import com.ssafy.iscream.comment.service.CommentService;
import com.ssafy.iscream.user.domain.User;
import com.ssafy.iscream.user.dto.response.UserProfile;
import com.ssafy.iscream.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PostFacade {

    private final PostService postService;
    private final CommentService commentService;
    private final UserService userService;

    // 게시글 상세 조회
    public PostDetail getPostDetail(Integer postId, User user, HttpServletRequest request) {
        Post post = postService.getPost(postId, user, request);
        return makePostDetail(post, user);
    }

    public PostDetail makePostDetail(Post post, User user) {
        Boolean userLiked = postService.isUserLiked(post, user);
        Integer likes = postService.getPostLikes(post.getPostId());
        Integer viewCount = postService.getPostViewCount(post.getPostId());
        List<String> images = postService.getPostImages(post.getPostId());
        UserProfile author = userService.getUserProfile(post.getUserId());

        return PostDetail.of(post, user, userLiked, viewCount, images, likes, author);
    }

    // 게시글 목록 조회 (검색 포함)
    public PostList getPostList(User user, PostReq req) {
        Page<Post> posts = postService.getPostPage(req);

        boolean hasNext = posts.hasNext();

        List<PostInfo> postInfo = makePostInfo(posts.stream().toList(), user);

        PostInfo lastPost = !postInfo.isEmpty() ? postInfo.get(postInfo.size() - 1) : null;

        Integer newLastId = lastPost != null ? lastPost.getPostId() : null;
        Integer newLikeCount = lastPost != null ? lastPost.getLikes() : null;

        return PostList.of(newLastId, newLikeCount, postInfo.size(), hasNext, postInfo);
    }

    // 메인 페이지 게시글 조회
    public Map<String, List<PostInfo>> getMainPostList(User user) {
        Map<String, List<PostInfo>> result = new HashMap<>();

        result.put("hot", makePostInfo(postService.getHotPost(), user));
        result.put("latest", makePostInfo(postService.getLatestPost(), user));

        return result;
    }

    public List<PostInfo> makePostInfo(List<Post> posts, User user) {
        return posts.stream()
                .map(post -> PostInfo.of(
                        post,
                        postService.getPostThumbnail(post.getPostId()),
                        postService.isUserLiked(post, user),
                        postService.getPostLikes(post.getPostId()),
                        postService.getPostViewCount(post.getPostId()),
                        userService.getUserNickname(post.getUserId()),
                        commentService.getCommentCount(post.getPostId())
                        )
                )
                .toList();
    }

}
