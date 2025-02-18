package com.ssafy.iscream.common.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    SYSTEM_ERROR("E2001", "시스템 에러 발생"),

    INVALID_TOKEN("E3001", "토큰 유효성 검증에 실패하였습니다."),
    TOKEN_EXPIRED("E3002", "토큰 유효기간이 만료되었습니다."),
    INVALID_TOKEN_REQUEST("E3003", "토큰 요청 형식이 잘못되었습니다."),
    TOKEN_ERROR("E3004", "토큰 인증에 실패하였습니다."),

    DATA_NOT_FOUND("E4001", "데이터 조회에 실패했습니다."),
    DATA_SAVE_FAILED("E4002", "데이터 저장, 업데이트에 실패했습니다."),
    DATA_DELETE_FAILED("E4003", "데이터 삭제에 실패했습니다."),
    DATA_FORBIDDEN_ACCESS("E4004", "데이터에 대한 접근 권한이 없습니다."),
    INVALID_PARAMETER("E4005", "파라미터 형식이 잘못되었습니다."),
    DATA_FORBIDDEN_UPDATE("E4006", "데이터에 대한 수정/삭제 권한이 없습니다."),

    DUPLICATE_EMAIL("E5001", "이미 존재하는 이메일입니다."),
    DUPLICATE_NICKNAME("E5002", "이미 존재하는 닉네임입니다."),
    SEND_EMAIL_CODE_FAILED("E5003", "인증 코드 전송 실패"),
    EMAIL_CERTIFICATION_FAILED("E5004", "이메일 인증 실패"),
    DUPLICATE_USER("E5005", "이미 가입된 회원입니다."),
    JOIN_SOCIAL_FAILED("E5006", "간편 회원가입 실패"),
    USER_NOT_FOUND("E5007", "존재하지 않는 회원입니다."),
    INVALID_EMAIL_FORMAT("E5008", "이메일 형식이 잘못되었습니다."),
    INVALID_PASSWORD_FORMAT("E5009", "비밀번호 형식이 잘못되었습니다."),
    INVALID_USER_INFO("E5010", "잘못된 사용자 요청입니다. 입력한 정보를 다시 확인해주세요."),
    WITHDRAW_USER("E5011", "탈퇴한 사용자입니다."),
    INVALID_LOGIN_EMAIL("E5012", "이메일이 잘못되었습니다."),

    LOGIN_FAILED("E6001", "로그인에 실패하였습니다."),
    LOGIN_SOCIAL_FAILED("E6002", "간편 로그인 실패"),
    INCORRECT_PASSWORD("E6003", "현재 비밀번호가 올바르지 않습니다."),
    SAME_PASSWORD("E6004", "현재 비밀번호와 동일한 비밀번호입니다."),

    FILE_UPLOAD_FAILED("E7001", "파일 업로드 실패"),
    IMAGE_ANALYZE_FAILED("E7002", "이미지 분석 실패"),
    FILE_DELETE_IS_FAILED("E7003", "파일 삭제에 실패하였습니다."),
    FILE_DOES_NOT_EXIST("E7004", "파일이 존재하지 않습니다."),
    UNSUPPORTED_EXTENSION("E7005", "지원하지 않는 파일 형식입니다."),
    INVALID_FILE_REQUEST("E7006", "잘못된 형식의 파일 요청입니다.");

    private final String code;
    private final String message;

    ErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
