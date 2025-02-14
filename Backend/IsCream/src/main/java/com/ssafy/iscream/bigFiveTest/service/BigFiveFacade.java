package com.ssafy.iscream.bigFiveTest.service;

import com.ssafy.iscream.bigFiveTest.domain.BigFiveTest;
import com.ssafy.iscream.bigFiveTest.dto.response.BigFiveTestListRes;
import com.ssafy.iscream.bigFiveTest.repository.BigFiveTestRepository;
import com.ssafy.iscream.children.service.ChildrenService;
import com.ssafy.iscream.children.dto.res.ChildrenGetRes;
import com.ssafy.iscream.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Big Five 테스트 관련 비즈니스 로직을 수행하는 퍼사드(Facade) 서비스 클래스
 */
@Service
@RequiredArgsConstructor
@Transactional
public class BigFiveFacade {

    private final BigFiveTestRepository bigFiveTestRepository; // Big Five 테스트 저장소
    private final ChildrenService childrenService; // 사용자 자녀 정보 관련 서비스

    /**
     * 사용자의 Big Five 테스트 리스트를 조회하는 메서드 (userId 기반)
     *
     * @param user 현재 로그인한 사용자
     * @return 사용자별 Big Five 테스트 결과 리스트
     */
    public List<BigFiveTestListRes> getUserBigFiveTestListResults(User user) {
        // 사용자(user)의 자녀 목록을 조회
        List<ChildrenGetRes> children = childrenService.getChildren(user.getUserId());

        // userId 기반으로 Big Five 테스트 리스트 조회 후 DTO 변환
        return bigFiveTestRepository.findByUserId(user.getUserId()).stream()
                .map(test -> convertToBigFiveTestListRes(test, children))
                .collect(Collectors.toList());
    }

    /**
     * BigFiveTest 데이터를 BigFiveTestListRes로 변환하는 메서드
     *
     * @param bigFiveTest 성격 5요인 테스트 엔티티
     * @param children 사용자의 자녀 목록
     * @return 변환된 BigFiveTestListRes DTO
     */
    private BigFiveTestListRes convertToBigFiveTestListRes(BigFiveTest bigFiveTest, List<ChildrenGetRes> children) {
        // 자녀 ID를 기반으로 닉네임 찾기
        String childNickname = children.stream()
                .filter(child -> child.getChildId().equals(bigFiveTest.getChildId()))
                .map(ChildrenGetRes::getNickname)
                .findFirst()
                .orElse("Unknown");

        return new BigFiveTestListRes(
                bigFiveTest.getTestId(), // 테스트 ID
                "Big-Five", // 검사 제목 (고정값)
                bigFiveTest.getDate(), // 검사 날짜
                childNickname // 자녀 닉네임 추가
        );
    }
}
