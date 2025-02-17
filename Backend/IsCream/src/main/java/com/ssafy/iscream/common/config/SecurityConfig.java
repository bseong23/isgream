package com.ssafy.iscream.common.config;

import com.ssafy.iscream.auth.exception.JwtAccessDeniedHandler;
import com.ssafy.iscream.auth.exception.JwtAuthenticationEntryPoint;
import com.ssafy.iscream.auth.filter.AuthLogoutFilter;
import com.ssafy.iscream.auth.filter.LoginFilter;
import com.ssafy.iscream.auth.jwt.JwtFilter;
import com.ssafy.iscream.auth.jwt.TokenProvider;
import com.ssafy.iscream.auth.service.TokenService;
import com.ssafy.iscream.auth.service.UserDetailsServiceImpl;
import com.ssafy.iscream.oauth.AuthSuccessHandler;
import com.ssafy.iscream.oauth.service.OAuth2UserServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.CorsUtils;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // AuthenticationManager가 인자로 받을 AuthenticationConfiguraion 객체 생성자 주입
    private final AuthenticationConfiguration authenticationConfiguration;
    private final UserDetailsServiceImpl userDetailsService;
    private final TokenProvider tokenProvider;
    private final TokenService tokenService;
    private final OAuth2UserServiceImpl customOAuth2UserService;
    private final AuthSuccessHandler customSuccessHandler;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;
    private final JwtAccessDeniedHandler accessDeniedHandler;

    // AuthenticationManager Bean 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

//    @Bean
//    public WebSecurityCustomizer webSecurityCustomizer() {
//        return web -> web.ignoring().requestMatchers("/ws/**", "/api/ws/**");
//    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {


        http
                .cors((corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {
                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

                        CorsConfiguration configuration = new CorsConfiguration();

                        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:5173", "https://i12a407.p.ssafy.io", "http://localhost:8080"));
                        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                        configuration.setAllowCredentials(true);
                        configuration.setAllowedHeaders(Collections.singletonList("*"));
                        configuration.setMaxAge(3600L);
                        configuration.setExposedHeaders(Arrays.asList("access", "Set-Cookie"));

                        return configuration;
                    }
                })));

        // csrf disable
        http
                .csrf(AbstractHttpConfigurer::disable);

        // From 로그인 방식 disable
        http
                .formLogin(AbstractHttpConfigurer::disable);

        // http basic 인증 방식 disable
        http
                .httpBasic(AbstractHttpConfigurer::disable);

        // 경로별 인가 작업
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/api/ws/**", "/ws/**").permitAll()// 웹소켓은 이거 해야함하하
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/users/join/**", "/users/login/**", "/oauth2/**").permitAll()
                        .requestMatchers("/users/email/check", "/users/nickname/check").permitAll()
                        .requestMatchers(HttpMethod.GET, "/board/post/{postId}", "/board/main").permitAll()
                        .requestMatchers(HttpMethod.POST, "/board").permitAll()
                        .requestMatchers(HttpMethod.GET, "/comments/{postId}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/chatbot").permitAll()
                        .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
                        .anyRequest().authenticated());

        // 예외 처리
        http.exceptionHandling((exceptionConfig) ->
                exceptionConfig
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
        );

        http
                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
                                .userService(customOAuth2UserService))
                        .successHandler(customSuccessHandler)
                );

        http
                .addFilterBefore(new JwtFilter(tokenProvider, userDetailsService), LoginFilter.class);

        // 필터 추가 LoginFilter()는 인자를 받음 (AuthenticationManager() 메소드에 authenticationConfiguration 객체를 넣어야 함) 따라서 등록 필요
        http
                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), tokenProvider, tokenService), UsernamePasswordAuthenticationFilter.class);

        http
                .addFilterBefore(new AuthLogoutFilter(tokenService), LogoutFilter.class);

        // 세션 설정
        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // 세션 관리

        return http.build();
    }
}
