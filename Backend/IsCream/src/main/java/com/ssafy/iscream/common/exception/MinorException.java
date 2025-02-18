package com.ssafy.iscream.common.exception;

import com.ssafy.iscream.common.response.ResponseData;
import org.springframework.http.HttpStatus;

public class MinorException extends GlobalException {
    public MinorException(ResponseData<?> data) {
        super(data, HttpStatus.OK);
    }

    public static class DataException extends MinorException {
        public DataException(ErrorCode errorCode) {
            super(ResponseData.builder()
                    .code(errorCode.getCode())
                    .message(errorCode.getMessage())
                    .build());
        }
    }
}
