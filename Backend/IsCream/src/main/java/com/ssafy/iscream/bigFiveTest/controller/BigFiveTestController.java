package com.ssafy.iscream.bigFiveTest.controller;

import com.ssafy.iscream.auth.user.Login;
import com.ssafy.iscream.bigFiveTest.dto.request.BigFiveTestCreateReq;
import com.ssafy.iscream.bigFiveTest.service.BigFiveTestService;
import com.ssafy.iscream.common.util.ResponseUtil;
import com.ssafy.iscream.patTest.dto.request.PatTestCreateReq;
import com.ssafy.iscream.user.domain.User;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/big-five-tests")
public class BigFiveTestController {

    private final BigFiveTestService bigFiveTestService;

    @Operation(summary = "성격 5요인 검사 문제 조회", tags = "big-five")
    @GetMapping("/questions")
    public ResponseEntity<?> getBigFiveTest(@Login User user){
        return ResponseUtil.success(bigFiveTestService.getBigFiveTestList(user));
    }

    @Operation(summary = "성격 5요인 검사 결과 제출", tags = "big-five")
    @PostMapping
    public ResponseEntity<?> postBigFiveTestResult(@Login User user,
                                                   @RequestBody BigFiveTestCreateReq bigFiveTestCreateReq){
        return ResponseUtil.success(bigFiveTestService.postBigFiveTestResult(user, bigFiveTestCreateReq));
    }

    @Operation(summary = "성격 5요인 테스트 최근 결과 조회", tags = "big-five")
    @GetMapping("/recent")
    public ResponseEntity<?> getBigFiveResult(@Login User user){
        return ResponseUtil.success(bigFiveTestService.getBigFiveTestResult(user));
    }

    @Operation(summary = "성격 5요인 검사 결과 목록 조회", tags = "big-five")
    @GetMapping()
    public ResponseEntity<?> getBigFiveListResult(@Login User user){
        return ResponseUtil.success(bigFiveTestService.getBigFiveTestListResult(user));
    }
}