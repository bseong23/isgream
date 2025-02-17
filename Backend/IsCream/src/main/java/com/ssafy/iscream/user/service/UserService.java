package com.ssafy.iscream.user.service;

import com.ssafy.iscream.auth.jwt.JwtUtil;
import com.ssafy.iscream.auth.service.TokenService;
import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.s3.service.S3Service;
import com.ssafy.iscream.user.domain.Relation;
import com.ssafy.iscream.user.domain.Role;
import com.ssafy.iscream.user.domain.Status;
import com.ssafy.iscream.user.domain.User;
import com.ssafy.iscream.user.dto.request.UserCreateReq;
import com.ssafy.iscream.user.dto.request.UserInfoReq;
import com.ssafy.iscream.user.dto.request.UserUpdateReq;
import com.ssafy.iscream.user.dto.response.UserInfo;
import com.ssafy.iscream.user.dto.response.UserProfile;
import com.ssafy.iscream.user.exception.UserException.*;
import com.ssafy.iscream.auth.exception.AuthException.*;
import com.ssafy.iscream.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

import static com.ssafy.iscream.common.exception.ErrorCode.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private final TokenService tokenService;
    private final S3Service s3Service;

    // 회원가입
    public Integer joinProcess(UserCreateReq userReq) {
        String email = userReq.getEmail();
        String password = userReq.getPassword();

        Boolean isExist = userRepository.existsByEmail(email);

        if (isExist) {
            throw new UserExistException();
        }

        duplicatePhone(userReq.getPhone()); // 전화번호 중복 확인

        User user = modelMapper.map(userReq, User.class);
        user.setRelation(Relation.valueOf(userReq.getRelation()));
        user.setPassword(bCryptPasswordEncoder.encode(password));
        user.setRole(Role.USER);
        return userRepository.save(user).getUserId();
    }

    // 사용자 정보 조회
    public UserInfo getUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.USER_NOT_FOUND));
        return new UserInfo(user);
    }

    // 이메일 중복 확인
    public Boolean duplicateEmail(String email) {
        Boolean exist = userRepository.existsByEmail(email);

        if (exist) {
            throw new EmailException();
        }

        return true;
    }

    // 닉네임 중복 확인
    public Boolean duplicateNickname(String nickname) {
        Boolean exist = userRepository.existsByNickname(nickname);

        if (exist) {
            throw new NicknameException();
        }

        return true;
    }

    // 전화번호 중복 확인
    private Boolean duplicatePhone(String phone) {
        Boolean exist = userRepository.existsByPhone(phone);

        if (exist) {
            throw new UserExistException();
        }

        return true;
    }

    // 사용자 정보 확인 (이메일, 이름, 전화번호)
    public Boolean existUserInfo(UserInfoReq req, Integer userId) {
        User user = userRepository.findByEmailAndUsernameAndPhone(req.getEmail(), req.getUsername(), req.getPhone())
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.USER_NOT_FOUND));

        if (!userId.equals(user.getUserId())) {
            throw new UserNotFoundException(ErrorCode.INVALID_USER_INFO);
        }

        return true;
    }

    // 비밀번호 재설정
    @Transactional
    public boolean changePassword(Integer userId, String password, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.USER_NOT_FOUND));

        String original = user.getPassword();

        if (!bCryptPasswordEncoder.matches(password, original)) {
            throw new PasswordException(INCORRECT_PASSWORD);
        }

        if (bCryptPasswordEncoder.matches(newPassword, original)) {
            throw new PasswordException(SAME_PASSWORD);
        }

        user.setPassword(bCryptPasswordEncoder.encode(newPassword));

        return true;
    }

    @Transactional
    public void updateUserInfo(Integer userId, UserUpdateReq req, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.USER_NOT_FOUND));

        user.setNickname(req.getNickname());
        user.setPhone(req.getPhone());
        user.setBirthDate(LocalDate.parse(req.getBirthDate()));
        user.setRelation(Relation.valueOf(req.getRelation()));

        // 프로필 사진 저장
        if (file != null) {
            // 기존 이미지 삭제
            if (user.getImageUrl() != null) {
                s3Service.deleteFile(user.getImageUrl());
            }

            String imageUrl = s3Service.uploadImage(file);
            user.setImageUrl(imageUrl);
        }
    }

    // 사용자 탈퇴 처리
    @Transactional
    public void updateUserStatus(HttpServletRequest request, HttpServletResponse response, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.USER_NOT_FOUND));

        user.setStatus(Status.BANNED); // 탈퇴 처리

        String refresh = tokenService.validateRefreshToken(request); // 쿠키에서 토큰 가져오기
        tokenService.deleteRefreshToken(refresh); // Redis에 저장된 리프레시 토큰 삭제

        response.addHeader("Set-Cookie", JwtUtil.createCookie("refresh", ""));
    }

    // 게시글, 댓글 작성자 정보 가져오기
    public UserProfile getUserProfile(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.USER_NOT_FOUND));

        return new UserProfile(user);
    }

    // 게시글 목록에서 작성자 닉네임 가져오기
    public String getUserNickname(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.USER_NOT_FOUND));

        return user.getNickname();
    }

}
