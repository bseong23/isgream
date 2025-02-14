package com.ssafy.iscream.auth.service;

import com.ssafy.iscream.auth.user.AuthUserDetails;
import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.user.domain.Status;
import com.ssafy.iscream.user.domain.User;
import com.ssafy.iscream.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new AuthenticationException(ErrorCode.INVALID_LOGIN_EMAIL.getCode()) {});

        // BANNED 상태인 경우 인증 거부
        if (user.getStatus() == Status.BANNED) {
            throw new AuthenticationException(ErrorCode.WITHDRAW_USER.getCode()) {};
        }

        // UserDetails에 담아서 return하면 AutneticationManager가 검증 함
        return new AuthUserDetails(user);
    }
}
