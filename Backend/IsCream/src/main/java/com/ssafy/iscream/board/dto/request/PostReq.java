package com.ssafy.iscream.board.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(description = "게시글 조회 request")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostReq {
    @Schema(description = "마지막으로 조회된 postId (첫 요청 시 null)")
    private Integer lastId;

    @Schema(description = "마지막으로 조회된 게시글 likes (첫 요청 시 null)")
    private Integer lastLikeCount;

    @Schema(description = "정렬 기준 (create - default, like)", example = "create")
    private String sort = "create";

    @Schema(description = "개수 (default 0)", example = "10")
    private Integer size = 10;

    @Schema(description = "검색 내용", example = "제목")
    private String keyword;
}
