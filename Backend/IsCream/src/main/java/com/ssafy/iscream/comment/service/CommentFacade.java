package com.ssafy.iscream.comment.service;

import com.ssafy.iscream.board.domain.Post;
import com.ssafy.iscream.board.service.PostService;
import com.ssafy.iscream.comment.domain.Comment;
import com.ssafy.iscream.comment.dto.request.CommentCreateReq;
import com.ssafy.iscream.comment.dto.response.CommentList;
import com.ssafy.iscream.noti.service.NotifyService;
import com.ssafy.iscream.user.domain.User;
import com.ssafy.iscream.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentFacade {

    private final PostService postService;
    private final CommentService commentService;
    private final UserService userService;
    private final NotifyService notifyService;

    // 댓글 목록 조회
    public CommentList getCommentList(Integer postId) {
        List<Comment> comments = commentService.getComments(postId);

        List<CommentList.CommentInfo> commentList = comments.stream()
                .map(comment -> new CommentList.CommentInfo(
                        comment,
                        userService.getUserProfile(comment.getUserId())
                        )
                )
                .toList();

        return CommentList.of(commentList, commentList.size());
    }

    // 댓글/대댓글 작성
    public Integer createComment(User user, CommentCreateReq req) {
        Integer commentId = commentService.saveComment(user, req);

        Post post = postService.getPost(req.getPostId(), user, null);
        notifyService.sendCommentNotify(post.getUserId(), req.getPostId()); // 게시글 작성자에게 알림 전송

        return commentId;
    }

}
