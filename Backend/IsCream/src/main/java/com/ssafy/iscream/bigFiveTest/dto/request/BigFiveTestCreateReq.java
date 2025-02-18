package com.ssafy.iscream.bigFiveTest.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BigFiveTestCreateReq {

    @Schema(description = "아이 PK")
    private Integer childId;

    @Schema(description = "성실성", example = "5")
    private Double conscientiousness;

    @Schema(description = "우호성", example = "4")
    private Double agreeableness;

    @Schema(description = "정서적 안정성", example = "2")
    private Double emotionalStability;

    @Schema(description = "외향성", example = "4")
    private Double extraversion;

    @Schema(description = "개방성", example = "7")
    private Double openness;

}
