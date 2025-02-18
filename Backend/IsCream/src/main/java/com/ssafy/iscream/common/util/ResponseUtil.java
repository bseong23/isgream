package com.ssafy.iscream.common.util;

import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.common.exception.GlobalException;
import com.ssafy.iscream.common.response.ResponseData;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class ResponseUtil {

    public static <T> ResponseEntity<ResponseData<T>> success(String message, T data) {
        return ResponseEntity.ok(ResponseData.<T>builder().code("S0000").message(message).data(data).build());
    }

    public static <T> ResponseEntity<ResponseData<T>> success(T data) {
        return ResponseEntity.ok(
                ResponseData.<T>builder()
                        .code("S0000")
                        .message("정상적으로 처리되었습니다.")
                        .data(data)
                        .build());
    }

    public static <T> ResponseEntity<ResponseData<T>> success() {
        return ResponseEntity.ok(
                ResponseData.<T>builder()
                        .code("S0000")
                        .message("정상적으로 처리되었습니다.")
                        .build());
    }

    public static <T> ResponseEntity<ResponseData<T>> failure(GlobalException e) {
        return ResponseEntity.status(e.getStatus())
                .body(ResponseData.<T>builder()
                        .code(e.getData().getCode())
                        .message(e.getData().getMessage())
                        .build());
    }

    public static <T> ResponseEntity<ResponseData<T>> failure(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ResponseData.<T>builder()
                        .code(ErrorCode.SYSTEM_ERROR.getCode())
                        .message(ErrorCode.SYSTEM_ERROR.getMessage())
                        .build());
    }

    public static <T> ResponseEntity<ResponseData<T>> failure(ErrorCode errorCode) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseData.<T>builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }

}
