package com.ssafy.iscream.patTest.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PatTestListRes {

    @Schema(description = "검사 아이디", example = "1")
    private Integer testId;

    @Schema(description = "검사 제목", example = "부모 양육 태도 검사")
    private String title;

    @Schema(description = "검사 날짜", example = "2025-02-11")
    private String testDate;
}
