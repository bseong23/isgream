package com.ssafy.iscream.oauth.service;

import com.ssafy.iscream.auth.user.AuthUserDetails;
import com.ssafy.iscream.oauth.dto.GoogleResponse;
import com.ssafy.iscream.oauth.dto.OAuth2Response;
import com.ssafy.iscream.user.domain.Role;
import com.ssafy.iscream.user.domain.User;
import com.ssafy.iscream.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuth2UserServiceImpl extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println(oAuth2User.getAttributes());

        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        OAuth2Response oAuth2Response = null;

        if (registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else {
            return null;
        }

        String email = oAuth2Response.getEmail();

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = User.builder().email(email).username(oAuth2User.getName()).role(Role.USER).build();
            userRepository.save(user);
        } else {
            user.setEmail(email);
            user.setUsername(oAuth2User.getName());
            userRepository.save(user);
        }

        return new AuthUserDetails(user);
    }
}
