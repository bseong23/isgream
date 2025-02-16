package com.ssafy.iscream.htpTest.service;

import com.ssafy.iscream.children.dto.res.ChildrenGetRes;
import com.ssafy.iscream.children.service.ChildrenService;
import com.ssafy.iscream.htpTest.domain.HtpTest;
import com.ssafy.iscream.htpTest.dto.response.HtpTestResponseDto;
import com.ssafy.iscream.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * HTP 테스트 관련 비즈니스 로직을 수행하는 퍼사드(Facade) 서비스 클래스
 */
@Service
@RequiredArgsConstructor
@Transactional
public class HtpFacade {

    private final ChildrenService childrenService; // 사용자 자녀 정보 관련 서비스
    private final HtpSelectService htpSelectService; // HTP 테스트 조회 서비스

    /**
     * 사용자의 모든 자녀에 대한 HTP 테스트 리스트를 조회하는 메서드
     *
     * @param user 현재 로그인한 사용자
     * @return 자녀별 HTP 테스트 결과 리스트
     */
    public List<HtpTestResponseDto> getHtpTestList(User user, LocalDate startDate, LocalDate endDate) {
        // 사용자(user)의 자녀 목록을 조회
        List<ChildrenGetRes> children = childrenService.getChildren(user.getUserId());

        // 자녀별로 HTP 테스트 리스트를 조회하고 DTO로 변환하여 반환
        return htpSelectService.getHtpTestList(user.getUserId(), startDate, endDate)
                .stream()
                .map(test -> convertToDto(test, children))
                .collect(Collectors.toList());
    }

    /**
     * HTP 테스트 데이터를 HtpTestResponseDto로 변환하는 메서드
     *
     * @param htpTest HTP 테스트 엔티티
     * @param children   자녀 정보 DTO
     * @return 변환된 HTP 테스트 응답 DTO
     */
    private HtpTestResponseDto convertToDto(HtpTest htpTest, List<ChildrenGetRes> children) {
        // 자녀 ID를 기반으로 닉네임 찾기
        String childNickname = children.stream()
                .filter(child -> child.getChildId().equals(htpTest.getChildId()))
                .map(ChildrenGetRes::getNickname)
                .findFirst()
                .orElse("Unknown");

        return new HtpTestResponseDto(
                htpTest.getHtpTestId(), // 테스트 ID
                "HTP 검사", // 검사 제목 (고정값)
                htpTest.getTestDate().toString(), // 검사 날짜
                childNickname // 자녀 닉네임 추가
        );
    }
}
