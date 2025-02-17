package com.ssafy.iscream.patTest.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Schema(description = "PAT 검사 결과 조회 Response")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PatTestRes {
    @Schema(description = "날짜", example = "2025-02-01")
    private String testDate;

    @Schema(description = "A유형 개수", example = "5")
    private Integer scoreA;

    @Schema(description = "A유형 개수", example = "3")
    private Integer scoreB;

    @Schema(description = "A유형 개수", example = "8")
    private Integer scoreC;

    @Schema(description = "결과 보고서", example = "결과 보고서")
    private String result;
}
