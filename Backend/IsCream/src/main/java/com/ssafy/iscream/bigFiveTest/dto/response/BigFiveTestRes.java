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
public class BigFiveTestRes {

    @Schema(description = "날짜", example = "2025-02-11")
    private String testDate;

    @Schema(description = "성실성", example = "5")
    private Double conscientiousness;

    @Schema(description = "우호성", example = "2")
    private Double agreeableness;

    @Schema(description = "정서적 안정성", example = "4")
    private Double emotionalStability;

    @Schema(description = "외향성", example = "2")
    private Double extraversion;

    @Schema(description = "개방성", example = "1")
    private Double openness;

}
