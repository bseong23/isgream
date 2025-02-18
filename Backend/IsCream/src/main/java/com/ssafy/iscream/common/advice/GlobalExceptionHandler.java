package com.ssafy.iscream.common.advice;

import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.common.exception.GlobalException;
import com.ssafy.iscream.common.response.ResponseData;
import com.ssafy.iscream.common.util.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(GlobalException.class)
    public ResponseEntity<ResponseData<String>> handleGlobalException(GlobalException e, HttpServletRequest request) {
        log.error("source = {} \n {} = {}", request.getMethod(), request.getRequestURI(), e);

        return ResponseUtil.failure(e);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ResponseData<String>> handleServerException(DataIntegrityViolationException e, HttpServletRequest request) {
        log.error("source = {} \n {} = {}", request.getMethod(), request.getRequestURI(), e);
        return ResponseUtil.failure(ErrorCode.DATA_SAVE_FAILED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseData<String>> handleServerException(Exception e, HttpServletRequest request) {
        log.error("source = {} \n {} = {}", request.getMethod(), request.getRequestURI(), e);

        return ResponseUtil.failure(e);
    }

    private String extractExceptionSource(Exception e) {
        StackTraceElement[] stackTrace = e.getStackTrace();

        if (stackTrace.length > 0) {
            return stackTrace[0].toString();
        }

        return "Unknown Source";
    }

}
