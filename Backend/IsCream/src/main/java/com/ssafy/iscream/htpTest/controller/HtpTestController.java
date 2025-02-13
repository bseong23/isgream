package com.ssafy.iscream.htpTest.controller;

import com.ssafy.iscream.auth.user.Login;
import com.ssafy.iscream.common.util.ResponseUtil;
import com.ssafy.iscream.htpTest.dto.request.HtpTestCreateReq;
import com.ssafy.iscream.htpTest.dto.request.HtpTestReq;
import com.ssafy.iscream.htpTest.dto.response.HtpTestDetailDto;
import com.ssafy.iscream.htpTest.dto.response.HtpTestResponseDto;
import com.ssafy.iscream.htpTest.service.HtpFercade;
import com.ssafy.iscream.htpTest.service.HtpSelectService;
import com.ssafy.iscream.htpTest.service.HtpTestService;
import com.ssafy.iscream.user.domain.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequestMapping("/htp-tests")
@RestController
@RequiredArgsConstructor
public class HtpTestController {
    private final HtpTestService htpTestService;
    private final HtpSelectService htpSelectService;
    private final HtpFercade htpFercade;

    /**
     * HTP 테스트 수행 (총 4번 진행해야 함)
     */

    @PostMapping(path = "/img", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @Operation(summary = "Htp 테스트 수행 4번해야함", tags = "htp")
    public ResponseEntity<?> img(@Login User user,
                                 @RequestPart(name = "htp") HtpTestCreateReq req, // JSON 데이터
                                 @Parameter(name = "file")
                                 @RequestPart(name = "file", required = false) MultipartFile file) { // 파일 데이터
        // 요청 데이터 검증 및 서비스 호출
        HtpTestReq htpTestReq = new HtpTestReq(
                req.getChildId(),
                req.getTime(),
                req.getType(),
                req.getIndex(),
                file
        );

        String result = htpTestService.htpTestCycle(user, htpTestReq);
        return ResponseUtil.success(result);
    }


    @GetMapping
    @Operation(summary = "user 자녀의 HTP 테스트 리스트", tags = "htp")
    public ResponseEntity<?> getHtpTests(@Login User user) {
        List<HtpTestResponseDto> htpTestList = htpFercade.getHtpTestList(user);
        return ResponseUtil.success(htpTestList);
    }

    @GetMapping("/{htp_test_id}")
    @Operation(summary = "특정 HTP 테스트 조회", tags = "htp")
    public ResponseEntity<?> getHtpTestById(@Login User user, @PathVariable("htp_test_id") Integer htpTestId) {
        HtpTestDetailDto htpTest = htpSelectService.getHtpTestById(htpTestId);
        return ResponseUtil.success(htpTest);
    }

    @GetMapping("/{htp_test_id}/pdf")
    @Operation(summary = "특정 HTP 테스트 결과 PDF 조회", tags = "htp")
    public ResponseEntity<?> getHtpTestPdf(@Login User user, @PathVariable("htp_test_id") Integer htpTestId) {
        return ResponseUtil.success(htpTestService.getHtpTestPdfUrl(user, htpTestId));
    }

}
