package com.ssafy.iscream.patTest.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Schema(description = "PAT 검사 질문 response")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PatTestQuestionRes {
    @Schema(description = "질문", example = "식사시간이 얼마 남지 않았는데도 당신의 아이가 군것질을 먹겠다고 조르자 시어머님(장모님)께서 먹으라고 허락한다면?")
    private String question;

    @Schema(description = "항목1", example = "그대로 먹게 내버려 둔다.")
    private String answer1;

    @Schema(description = "항목2", example = "안 된다고 하며 못 먹게 한다.")
    private String answer2;

    @Schema(description = "항목3", example = "밥을 먹고 난 다음에 후식으로만 먹게 한다.")
    private String answer3;
}
