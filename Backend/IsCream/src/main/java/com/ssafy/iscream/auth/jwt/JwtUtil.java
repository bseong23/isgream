package com.ssafy.iscream.auth.jwt;

import com.ssafy.iscream.auth.user.AuthUserDetails;
import com.ssafy.iscream.auth.service.TokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
public class JwtUtil {

    public static void generateAndSetTokens(
            HttpServletResponse response,
            Authentication authentication,
            TokenProvider tokenProvider,
            TokenService tokenService
    ) {
        AuthUserDetails userDetails = (AuthUserDetails) authentication.getPrincipal();

        // 유저 정보 추출
        Integer userId = userDetails.getUserId();
        String email = userDetails.getUsername();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        // 토큰 생성
        String access = tokenProvider.createAccessToken(userId, email, role);
        String refresh = tokenProvider.createRefreshToken(userId, email, role);

        // Redis에 refresh token 저장
        tokenService.addRefreshToken(refresh, userId);

        // 응답 헤더 설정
        response.setHeader("access", access);
        response.addHeader("Set-Cookie", createCookie("refresh", refresh));
//        response.addCookie(createCookie("refresh", refresh));
    }

    public static String extractTokenFromCookie(HttpServletRequest request, String tokenName) {
        return Optional.ofNullable(request.getCookies())
                .flatMap(cookies -> Arrays.stream(cookies)
                        .filter(cookie -> cookie.getName().equals(tokenName))
                        .map(Cookie::getValue)
                        .findFirst())
                .orElse(null);
    }

    public static void writeJsonResponse(HttpServletResponse response, String code, String message) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter writer = response.getWriter();
        writer.write(String.format("{\"code\": \"%s\", \"message\": \"%s\"}", code, message));
        writer.flush();
    }

    public static String createCookie(String key, String value) {
        return ResponseCookie.from(key, value)
                .httpOnly(true)
                .maxAge(value.isEmpty() ? 0 : 24 * 60 * 60)
                .sameSite("None")
                .secure(true)
                .path("/")
                .build()
                .toString();
    }

//    public static Cookie createCookie(String key, String value) {
//        Cookie cookie = new Cookie(key, value);
//        cookie.setMaxAge(value.isEmpty() ? 0 : 24 * 60 * 60);
////        cookie.setSecure(true);
////        cookie.setAttribute("SameSite", "None");
//        cookie.setPath("/");
//        cookie.setHttpOnly(true);
//
//        return cookie;
//    }
}
