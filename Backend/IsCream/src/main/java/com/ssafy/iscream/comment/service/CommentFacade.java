package com.ssafy.iscream.comment.service;

import com.ssafy.iscream.comment.domain.Comment;
import com.ssafy.iscream.comment.dto.response.CommentList;
import com.ssafy.iscream.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentFacade {

    private final CommentService commentService;
    private final UserService userService;

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

}
