package com.ssafy.iscream.bigFiveTest.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BigFiveTestQuestionRes {

    @Schema(description = "질문", example = "질문")
    private String question;

    @Schema(description = "타입", example = "타입")
    private String questionType;
}
