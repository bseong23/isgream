package com.ssafy.iscream.comment.service;

import com.ssafy.iscream.comment.domain.Comment;
import com.ssafy.iscream.comment.repository.CommentQueryRepository;
import com.ssafy.iscream.comment.repository.CommentRepository;
import com.ssafy.iscream.comment.dto.request.CommentCreateReq;
import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.common.exception.MinorException.*;
import com.ssafy.iscream.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentQueryRepository commentQueryRepository;

    // 댓글/대댓글 작성
    public Integer createComment(User user, CommentCreateReq req) {
        Comment comment = Comment.builder()
                .postId(req.getPostId())
                .content(req.getContent())
                .userId(user.getUserId())
                .parentCommentId(req.getCommentId())
                .build();

        Comment saveComment = commentRepository.save(comment);

        return saveComment.getCommentId();
    }

    // 댓글/대댓글 수정
    @Transactional
    public void updateComment(Integer userId, Integer commentId, String content) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new DataException(ErrorCode.DATA_NOT_FOUND));

        if (!userId.equals(comment.getUserId())) {
            throw new DataException(ErrorCode.DATA_FORBIDDEN_UPDATE);
        }

        comment.setContent(content);
    }

    // 댓글/대댓글 삭제
    @Transactional
    public void deleteComment(Integer userId, Integer commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new DataException(ErrorCode.DATA_NOT_FOUND));

        if (!userId.equals(comment.getUserId())) {
            throw new DataException(ErrorCode.DATA_FORBIDDEN_UPDATE);
        }

        commentRepository.deleteById(commentId);
    }

    // 댓글 조회
    public List<Comment> getComments(Integer postId) {
        return commentQueryRepository.findCommentByPostId(postId);
    }

    // 댓글 개수
    public Integer getCommentCount(Integer postId) {
        return commentRepository.countByPostId(postId);
    }

}
