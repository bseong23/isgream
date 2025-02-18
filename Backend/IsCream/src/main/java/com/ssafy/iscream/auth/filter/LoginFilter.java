package com.ssafy.iscream.auth.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.iscream.auth.jwt.JwtUtil;
import com.ssafy.iscream.auth.jwt.TokenProvider;
import com.ssafy.iscream.auth.dto.LoginReq;
import com.ssafy.iscream.auth.service.TokenService;
import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.auth.exception.AuthException.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;
    private final TokenService tokenService;

    public LoginFilter(AuthenticationManager authenticationManager, TokenProvider tokenProvider, TokenService tokenService) {
        //super.setFilterProcessesUrl("/users/login"); // 기본 경로 변경
        super.setFilterProcessesUrl("/api/users/login"); // 기본 경로 변경

        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.tokenService = tokenService;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            // 요청 본문에서 LoginReq 객체를 파싱
            // 클라이언트 요청에서 email, password 추출 -> json 형식으로 받음
            ObjectMapper objectMapper = new ObjectMapper();
            LoginReq loginReq = objectMapper.readValue(request.getInputStream(), LoginReq.class);

            String email = loginReq.getEmail();
            String password = loginReq.getPassword();

            // 스프링 시큐리티에서 email과 password를 검증하기 위해서는 token에 담아야 함
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, password);

            // token에 담은 검증을 위한 AuthenticationManager로 전달
            return authenticationManager.authenticate(authToken);
        } catch (Exception e) {
            log.error("Authentication failed {}", e.getMessage());

            // 예외 구분
            if (e.getMessage().equals(ErrorCode.WITHDRAW_USER.getCode())) {
                throw new AuthTokenException(ErrorCode.WITHDRAW_USER);
            } else if (e.getMessage().equals(ErrorCode.INVALID_LOGIN_EMAIL.getCode())) {
                throw new AuthTokenException(ErrorCode.INVALID_LOGIN_EMAIL);
            } else {
                throw new AuthTokenException(ErrorCode.LOGIN_FAILED);
            }
        }
    }

    // 로그인 성공시 실행하는 메소드 (여기서 JWT를 발급하면 됨)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {
        JwtUtil.generateAndSetTokens(response, authentication, tokenProvider, tokenService);
        response.setStatus(HttpStatus.OK.value());
        JwtUtil.writeJsonResponse(response, "S0000", "정상적으로 처리되었습니다.");
    }

    // 로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        ErrorCode errorCode = ErrorCode.LOGIN_FAILED;

        if (failed instanceof AuthTokenException e) {
            errorCode = e.getErrorCode();
        }

        JwtUtil.writeJsonResponse(response, errorCode.getCode(), errorCode.getMessage());
    }
}
