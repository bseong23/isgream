package com.ssafy.iscream.auth.filter;

import com.ssafy.iscream.auth.jwt.JwtUtil;
import com.ssafy.iscream.auth.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

import static com.ssafy.iscream.auth.jwt.JwtUtil.createCookie;

@Slf4j
@RequiredArgsConstructor
public class AuthLogoutFilter extends GenericFilterBean {

    private final TokenService tokenService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        // path and method verify
        String requestUri = request.getRequestURI();
        if (!requestUri.matches("^/api/users/logout$")) {
            filterChain.doFilter(request, response);
            return;
        }

        String requestMethod = request.getMethod();
        if (!requestMethod.equals("POST")) {
            filterChain.doFilter(request, response);
            return;
        }

        String refresh = tokenService.validateRefreshToken(request);

        tokenService.deleteRefreshToken(refresh);

        // Refresh 토큰 Cookie 값 0
        response.addHeader("Set-Cookie", JwtUtil.createCookie("refresh", ""));
        response.setStatus(HttpServletResponse.SC_OK);
        JwtUtil.writeJsonResponse(response, "S0000", "정상적으로 처리되었습니다.");
    }
}
