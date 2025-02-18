package com.ssafy.iscream.board.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(description = "게시글 작성 request")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostCreateReq {
    @Schema(description = "제목", example = "제목")
    private String title;

    @Schema(description = "내용", example = "내용")
    private String content;
}
