package com.ssafy.iscream.bigFiveTest.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BigFiveTestListRes {

    @Schema(description = "검사 아이디", example = "1")
    private Integer testId;

    @Schema(description = "검사 제목", example = "성격 5요인 검사")
    private String title;

    @Schema(description = "검사 날짜", example = "2025-02-11")
    private String testDate;
    
    @Schema(description = "아이 이름", example = "철수")
    private String childName;

}
