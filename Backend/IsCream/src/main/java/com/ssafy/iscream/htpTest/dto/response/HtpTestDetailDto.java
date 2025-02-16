package com.ssafy.iscream.htpTest.dto.response;

import com.ssafy.iscream.htpTest.domain.HtpTest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HtpTestDetailDto {
    private Integer testId;   // HTP 검사 ID

    private String title;     // 제목

    private String date;      // 검사 날짜

    private String pdf;       // PDF URL

    private String result;    // 검사 결과

    public HtpTestDetailDto(HtpTest htpTest) {
        this.testId = htpTest.getHtpTestId();
        this.title = "HTP 검사"; // 고정된 제목 값
        this.date = htpTest.getTestDate().toString(); // LocalDate -> String 변환
        this.pdf = htpTest.getPdfUrl();
        this.result = htpTest.getAnalysisResult();
    }
}
