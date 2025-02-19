package com.ssafy.iscream.auth.jwt;

import com.ssafy.iscream.auth.service.UserDetailsServiceImpl;
import com.ssafy.iscream.auth.user.AuthUserDetails;
import com.ssafy.iscream.auth.exception.AuthException.*;
import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.user.domain.Role;
import com.ssafy.iscream.user.domain.User;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final TokenProvider tokenProvider;
    private final UserDetailsServiceImpl userDetailsService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (request.getMethod().equals("OPTIONS")) {
            return;
        }

        // '/reissue' 요청은 필터링하지 않음
        String path = request.getRequestURI();

        if (path.equals("/reissue")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 헤더에서 access키에 담긴 토큰을 꺼냄
        String accessToken = request.getHeader("access");

        // 토큰이 없다면 다음 필터로 넘김
        if (accessToken == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 토큰 만료 여부 확인, 만료시 다음 필터로 넘기지 않음
        try {
            if (!tokenProvider.validateToken(accessToken)) {
                throw new AuthTokenException(ErrorCode.TOKEN_EXPIRED);
            }
        } catch (ExpiredJwtException e) {
            log.error("Access token expired");
            throw new AuthTokenException(ErrorCode.INVALID_TOKEN);
        }

        // 토큰이 access인지 확인 (발급시 페이로드에 명시)
        if (!tokenProvider.getCategory(accessToken).equals(("access"))) {
            log.error("Invalid access token");
            throw new AuthTokenException(ErrorCode.INVALID_TOKEN_REQUEST);
        }

//        User user = new User();
//        user.setUserId(tokenProvider.getUserId(accessToken));
//        user.setEmail(tokenProvider.getEmail(accessToken));
//        user.setRole(Role.valueOf(tokenProvider.getRole(accessToken)));
//
//        AuthUserDetails customUserDetails = new AuthUserDetails(user);

        String email = tokenProvider.getEmail(accessToken);
        AuthUserDetails authUserDetails = (AuthUserDetails) userDetailsService.loadUserByUsername(email);

        Authentication authToken = new UsernamePasswordAuthenticationToken(authUserDetails, null, authUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
