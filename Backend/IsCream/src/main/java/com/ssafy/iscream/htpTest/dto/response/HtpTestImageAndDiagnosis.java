package com.ssafy.iscream.htpTest.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HtpTestImageAndDiagnosis {
    private Integer htpTestId;
    private String houseDrawingUrl;
    private String treeDrawingUrl;
    private String maleDrawingUrl;
    private String femaleDrawingUrl;
    private String result;
}
