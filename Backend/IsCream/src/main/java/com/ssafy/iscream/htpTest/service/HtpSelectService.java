package com.ssafy.iscream.htpTest.service;

import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.common.exception.MinorException;
import com.ssafy.iscream.htpTest.domain.HtpTest;
import com.ssafy.iscream.htpTest.dto.response.HtpTestDetailDto;
import com.ssafy.iscream.htpTest.repository.HtpTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * HTP 테스트 데이터를 조회하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor
@Transactional
public class HtpSelectService {

    private final HtpTestRepository htpTestRepository; // HTP 테스트 관련 DB 접근 Repository

    /**
     * 사용자(userId)의 모든 HTP 테스트 목록을 조회하여 반환
     *
     * @param userId 사용자 ID
     * @return 해당 사용자의 HTP 테스트 목록
     */
    public List<HtpTest> getHtpTestList(Integer userId, LocalDate startDate, LocalDate endDate) {
        return htpTestRepository.findByUserIdAndDate(userId, startDate, endDate);
    }

    /**
     * 특정 HTP 테스트 ID로 조회하여 상세 DTO로 변환 후 반환
     *
     * @param htpTestId 조회할 HTP 테스트 ID
     * @return HtpTestDetailDto 객체 (HTP 테스트 상세 정보)
     */
    public HtpTestDetailDto getHtpTestById(Integer htpTestId) {
        HtpTest htpTest = htpTestRepository
                .findById(htpTestId)
                .orElseThrow(() -> new MinorException.DataException(ErrorCode.DATA_NOT_FOUND));

        return new HtpTestDetailDto(htpTest);
    }

    public List<String> getHtpTestFileUrl(Integer childId) {
        return htpTestRepository.findHtpFileUrlsByChildIds(childId);
    }
}
