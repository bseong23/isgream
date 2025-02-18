package com.ssafy.iscream.comment.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(description = "댓글/대댓글 작성 request")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreateReq {
    @Schema(description = "게시글 아이디", example = "1")
    private Integer postId;

    @Schema(description = "부모댓글 아이디(댓글 작성시 0 또는 null)", example = "1")
    private Integer commentId;

    @Schema(description = "내용", example = "내용")
    private String content;
}
