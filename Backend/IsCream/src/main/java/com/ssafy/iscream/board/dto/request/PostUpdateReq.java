package com.ssafy.iscream.board.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Schema(description = "게시글 수정 request")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostUpdateReq {
    @Schema(description = "제목", example = "제목")
    private String title;

    @Schema(description = "내용", example = "내용")
    private String content;

    @Schema(description = "삭제할 이미지 url")
    private List<String> deleteFiles = new ArrayList<>();
}

