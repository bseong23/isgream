package com.ssafy.iscream.htpTest.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HtpTestResponseDto {
    private Integer testId;  // 검사 아이디
    private String title;    // 검사 제목
    private String date;     // 작성 날짜
    private String childName;
}