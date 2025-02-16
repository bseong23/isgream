package com.ssafy.iscream.htpTest.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HtpTestCreateReq {
    Integer childId;
    String time;
    String type;
    Integer index;
}
