package com.ssafy.iscream.htpTest.controller;

import com.ssafy.iscream.auth.user.Login;
import com.ssafy.iscream.common.util.ResponseUtil;
import com.ssafy.iscream.htpTest.dto.request.HtpTestCreateReq;
import com.ssafy.iscream.htpTest.dto.request.HtpTestReq;
import com.ssafy.iscream.htpTest.dto.response.HtpTestDetailDto;
import com.ssafy.iscream.htpTest.dto.response.HtpTestImageAndDiagnosis;
import com.ssafy.iscream.htpTest.dto.response.HtpTestResponseDto;
import com.ssafy.iscream.htpTest.service.HtpFacade;
import com.ssafy.iscream.htpTest.service.HtpSelectService;
import com.ssafy.iscream.htpTest.service.HtpTestService;
import com.ssafy.iscream.user.domain.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDate;
import java.util.List;

@RequestMapping("/htp-tests")
@RestController
@RequiredArgsConstructor
public class HtpTestController {
    private final HtpTestService htpTestService;
    private final HtpSelectService htpSelectService;
    private final HtpFacade htpFacade;

    /**
     * HTP 테스트 수행 (총 4번 진행해야 함)
     */
    @PostMapping(path = "/img", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @Operation(summary = "Htp 테스트 수행  - 4번 해야함", tags = "htp")
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

        HtpTestImageAndDiagnosis result = htpTestService.htpTestCycle(user, htpTestReq);
        return ResponseUtil.success(result);
    }


    @GetMapping
    @Operation(summary = "user 자녀의 모든 HTP 테스트 결과 조회", tags = "htp")
    public ResponseEntity<?> getHtpTests(@Login User user,
                                         @Schema(description = "조회 시작 날짜", example = "2025-01-01")
                                         @RequestParam("startDate") LocalDate startDate,
                                         @Schema(description = "조회 종료 날짜", example = "2025-02-10")
                                         @RequestParam("endDate") LocalDate endDate) {
        List<HtpTestResponseDto> htpTestList = htpFacade.getHtpTestList(user, startDate, endDate);
        return ResponseUtil.success(htpTestList);
    }

    @GetMapping("/{htp-test-id}")
    @Operation(summary = "특정 HTP 테스트 조회", tags = "htp")
    public ResponseEntity<?> getHtpTestById(@PathVariable("htp-test-id") Integer htpTestId) {
        HtpTestDetailDto htpTest = htpSelectService.getHtpTestById(htpTestId);
        return ResponseUtil.success(htpTest);
    }

    @GetMapping("/{htp-test-id}/pdf")
    @Operation(summary = "특정 HTP 테스트 결과 PDF 추출", tags = "htp")
    public ResponseEntity<?> getHtpTestPdf(@Login User user, @PathVariable("htp-test-id") Integer htpTestId) {
        String pdfUrl = htpTestService.getHtpTestPdfUrl(user, htpTestId).get("url");
        try {
            URL url = new URL(pdfUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            InputStream inputStream = connection.getInputStream();
            InputStreamResource resource = new InputStreamResource(inputStream);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=htp_test_" + htpTestId + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
