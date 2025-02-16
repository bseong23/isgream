package com.ssafy.iscream.bigFiveTest.controller;

import com.ssafy.iscream.auth.user.Login;
import com.ssafy.iscream.bigFiveTest.dto.request.BigFiveTestCreateReq;
import com.ssafy.iscream.bigFiveTest.service.BigFiveFacade;
import com.ssafy.iscream.bigFiveTest.service.BigFiveTestService;
import com.ssafy.iscream.common.util.ResponseUtil;
import com.ssafy.iscream.user.domain.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/big-five-tests")
public class BigFiveTestController {

    private final BigFiveTestService bigFiveTestService;
    private final BigFiveFacade bigFiveFacade;

    @Operation(summary = "성격 5요인 검사 문제 조회", tags = "big-five")
    @GetMapping("/questions")
    public ResponseEntity<?> getBigFiveTest(){
        return ResponseUtil.success(bigFiveTestService.getBigFiveTestList());
    }

    @Operation(summary = "성격 5요인 검사 결과 제출", tags = "big-five")
    @PostMapping
    public ResponseEntity<?> postBigFiveTestResult(@Login User user,
                                                   @RequestBody BigFiveTestCreateReq bigFiveTestCreateReq){
        return ResponseUtil.success(bigFiveTestService.postBigFiveTestResult(user, bigFiveTestCreateReq));
    }

    @Operation(summary = "성격 5요인 테스트 최근 검사 결과 조회 (1개)", tags = "big-five")
    @GetMapping("/recent/{childId}")
    public ResponseEntity<?> getBigFiveResult(@PathVariable Integer childId){
        return ResponseUtil.success(bigFiveTestService.getBigFiveTestResult(childId));
    }

    @Operation(summary = "사용자의 성격 5요인 검사 결과 목록 조회", tags = "big-five")
    @GetMapping()
    public ResponseEntity<?> getBigFiveListResult(@Login User user,
                             @Schema(description = "조회 시작 날짜", example = "2025-01-01")
                             @RequestParam("startDate") LocalDate startDate,
                             @Schema(description = "조회 종료 날짜", example = "2025-02-10")
                             @RequestParam("endDate") LocalDate endDate) {
        return ResponseUtil.success(
                bigFiveFacade.getUserBigFiveTestListResults(
                        user, startDate, endDate));
    }

    @Operation(summary = "성격 5요인 검사 결과 PDF 추출", tags = "big-five")
    @GetMapping("/{big-five-test-id}/pdf")
    public ResponseEntity<?> getBigFivePDF(@Login User user, @PathVariable("big-five-test-id") Integer bigFiveTestId){
        return ResponseUtil.success(bigFiveTestService.getBigFivePdfUrl(user, bigFiveTestId));
    }
}