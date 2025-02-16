package com.ssafy.iscream.patTest.controller;

import com.ssafy.iscream.auth.user.Login;
import com.ssafy.iscream.common.util.ResponseUtil;
import com.ssafy.iscream.patTest.dto.request.PatTestCreateReq;
import com.ssafy.iscream.patTest.service.PatTestService;
import com.ssafy.iscream.user.domain.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pat-tests")
@Tag(name = "pat", description = "PAT 검사 API")
public class PatTestController {

    private final PatTestService patTestService;

    @Operation(summary = "PAT 검사 문제 조회", tags = "pat")
    @GetMapping("/questions")
    public ResponseEntity<?> getPatTest(){
        return ResponseUtil.success(patTestService.getPatTestList());
    }

    @Operation(summary = "PAT 검사 결과 제출", tags = "pat")
    @PostMapping
    public ResponseEntity<?> postPatTestResult(@Login User user,
                                               @RequestBody PatTestCreateReq patTestCreateReq){
        return ResponseUtil.success(patTestService.postPatTestResult(user, patTestCreateReq));
    }

    @Operation(summary = "PAT 최근 검사 결과 조회 (1개)", tags = "pat")
    @GetMapping("/recent")
    public ResponseEntity<?> getPatTestResult(@Login User user){
        return ResponseUtil.success(patTestService.getPatTestResult(user));
    }

    @Operation(summary = "사용자의 모든 PAT 검사 결과 목록 조회", tags = "pat")
    @GetMapping
    public ResponseEntity<?> getPatTestResultList(@Login User user,
                             @Schema(description = "조회 시작 날짜", example = "2025-01-01")
                             @RequestParam("startDate") LocalDate startDate,
                             @Schema(description = "조회 종료 날짜", example = "2025-02-10")
                             @RequestParam("endDate") LocalDate endDate) {
        return ResponseUtil.success(patTestService.getPatTestResultList(user, startDate, endDate));
    }

    @Operation(summary = "PAT 검사 결과 PDF 추출", tags = "pat")
    @GetMapping("/{pat-test-id}/pdf")
    public ResponseEntity<?> getPatTestPdf(@Login User user, @PathVariable("pat-test-id") Integer patTestId) {
        String pdfUrl = patTestService.getPatTestPdfUrl(user, patTestId).get("url");
        try {
            URL url = new URL(pdfUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            InputStream inputStream = connection.getInputStream();
            InputStreamResource resource = new InputStreamResource(inputStream);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=pat_test_" + patTestId + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
