package com.ssafy.iscream.comment.dto.response;

import com.ssafy.iscream.comment.domain.Comment;
import com.ssafy.iscream.common.util.DateUtil;
import com.ssafy.iscream.user.dto.response.UserProfile;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder @Getter
public class CommentList {
    private Integer totalCount;
    private List<CommentInfo> comments;

    public record CommentInfo(
            Integer commentId,
            String content,
            Integer parentId,
            String createdAt,
            UserProfile author
    ) {
        public CommentInfo(Comment comment, UserProfile author) {
            this(comment.getCommentId(), comment.getContent(), comment.getParentCommentId(),
                    DateUtil.format(comment.getCreatedAt()), author);
        }
    }

    public static CommentList of(List<CommentInfo> comments, int totalCount) {
        return CommentList.builder()
                .totalCount(totalCount)
                .comments(comments)
                .build();
    }
}
