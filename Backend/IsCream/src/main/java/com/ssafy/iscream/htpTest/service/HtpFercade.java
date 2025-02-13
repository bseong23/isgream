package com.ssafy.iscream.htpTest.service;

import com.ssafy.iscream.children.dto.res.ChildrenGetRes;
import com.ssafy.iscream.children.service.ChildrenService;
import com.ssafy.iscream.htpTest.domain.HtpTest;
import com.ssafy.iscream.htpTest.dto.response.HtpTestResponseDto;
import com.ssafy.iscream.s3.service.S3Service;
import com.ssafy.iscream.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * HTP 테스트 관련 비즈니스 로직을 수행하는 퍼사드(Facade) 서비스 클래스
 */
@Service
@RequiredArgsConstructor
@Transactional
public class HtpFercade {

    private final ChildrenService childrenService; // 사용자 자녀 정보 관련 서비스
    private final HtpSelectService htpSelectService; // HTP 테스트 조회 서비스

    /**
     * 사용자의 모든 자녀에 대한 HTP 테스트 리스트를 조회하는 메서드
     *
     * @param user 현재 로그인한 사용자
     * @return 자녀별 HTP 테스트 결과 리스트
     */
    public List<HtpTestResponseDto> getHtpTestList(User user) {
        // 사용자(user)의 자녀 목록을 조회
        List<ChildrenGetRes> children = childrenService.getChildren(user.getUserId());

        // 자녀별로 HTP 테스트 리스트를 조회하고 DTO로 변환하여 반환
        return children.stream()
                .flatMap(child -> htpSelectService.getHtpTestList(child.getChildId()).stream()
                        .map(htpTest -> convertToDto(htpTest, child))
                )
                .collect(Collectors.toList());
    }

    /**
     * HTP 테스트 데이터를 HtpTestResponseDto로 변환하는 메서드
     *
     * @param htpTest HTP 테스트 엔티티
     * @param child   자녀 정보 DTO
     * @return 변환된 HTP 테스트 응답 DTO
     */
    private HtpTestResponseDto convertToDto(HtpTest htpTest, ChildrenGetRes child) {
        return new HtpTestResponseDto(
                htpTest.getHtpTestId(), // HTP 테스트 ID
                "HTP 검사", // 검사 제목 (고정값)
                htpTest.getTestDate().toString(), // 검사 날짜 (LocalDate → String 변환)
                child.getNickname() // 자녀 닉네임
        );
    }
}
