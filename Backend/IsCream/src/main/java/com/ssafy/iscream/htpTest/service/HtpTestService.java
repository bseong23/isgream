package com.ssafy.iscream.htpTest.service;

import com.ssafy.iscream.calendar.dto.request.CalendarGetReq;
import com.ssafy.iscream.children.domain.Child;
import com.ssafy.iscream.children.service.ChildrenService;
import com.ssafy.iscream.htpTest.domain.HtpTest;
import com.ssafy.iscream.htpTest.dto.request.HtpTestDiagnosisReq;
import com.ssafy.iscream.htpTest.dto.request.HtpTestReq;
import com.ssafy.iscream.htpTest.repository.HtpTestRepository;
import com.ssafy.iscream.htpTest.repository.RedisService;
import com.ssafy.iscream.pdf.service.HtpTestPdfService;
import com.ssafy.iscream.s3.service.S3Service;
import com.ssafy.iscream.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional
public class HtpTestService {
    private final HtpTestRepository htpTestRepository;
    private final S3Service s3Service;
    private final HtpTestPdfService pdfService;
    private final ChildrenService childrenService;
    private final RedisService redisService; // Redis를 통한 데이터 저장

    private final ImageServeService imageServeService;

    public List<HtpTest> getByYearMonth(Integer userId, CalendarGetReq calendarGetReq) {
        LocalDateTime startDate = LocalDateTime.of(calendarGetReq.getYear(), calendarGetReq.getMonth(), 1, 0, 0);
        LocalDateTime endDate = startDate.plusMonths(1); // 다음 달 1일 (해당 월의 끝까지 포함)
        return htpTestRepository.findByChildIdAndCreatedAtBetween(calendarGetReq.getChildId(), startDate, endDate);
    }

    // ✅ 전체 HTP 테스트 사이클 실행
    public String htpTestCycle(User user, HtpTestReq req) {
        Integer childId = req.getChildId();
        Map<String, HtpTestDiagnosisReq> imageMap = redisService.getImageMap(childId);

        if (req.getType().equals("house")) {
            checkTodayHtpTest(childId);
            testHouse(user, req, imageMap);
        } else if (req.getType().equals("tree")) {
            testTree(user, req, imageMap);
        } else if (req.getType().equals("male")) {
            return testMale(user, req, imageMap);
        } else if (req.getType().equals("female")) {
            return testFemale(user, req, imageMap);
        }

        redisService.saveImageMap(childId, imageMap);
        return "";
    }

    // ✅ House 그림 처리
    private void testHouse(User user, HtpTestReq req, Map<String, HtpTestDiagnosisReq> imageMap) {
        HtpTest htpTest = saveOrGetHtpTest(req.getChildId());
        String url = s3Service.uploadImage(req.getFile());
        htpTest.setHouseDrawingUrl(url);

        imageMap.put("house", new HtpTestDiagnosisReq(req.getTime(), req.getType(), url));
        redisService.saveImageMap(req.getChildId(), imageMap);
    }

    // ✅ Tree 그림 처리
    private void testTree(User user, HtpTestReq req, Map<String, HtpTestDiagnosisReq> imageMap) {
        HtpTest htpTest = saveOrGetHtpTest(req.getChildId());
        String url = s3Service.uploadImage(req.getFile());
        htpTest.setTreeDrawingUrl(url);

        imageMap.put("tree", new HtpTestDiagnosisReq(req.getTime(), req.getType(), url));
        redisService.saveImageMap(req.getChildId(), imageMap);
    }

    // ✅ Male 그림 처리
    private String testMale(User user, HtpTestReq req, Map<String, HtpTestDiagnosisReq> imageMap) {
        HtpTest htpTest = saveOrGetHtpTest(req.getChildId());
        String url = s3Service.uploadImage(req.getFile());
        htpTest.setMaleDrawingUrl(url);

        imageMap.put("male", new HtpTestDiagnosisReq(req.getTime(), req.getType(), url));

        if (req.getIndex().equals(4)) {
            return sendToAiServer(user, req.getChildId(), htpTest, imageMap);
        }
        redisService.saveImageMap(req.getChildId(), imageMap);
        return "";
    }

    // ✅ Female 그림 처리
    private String testFemale(User user, HtpTestReq req, Map<String, HtpTestDiagnosisReq> imageMap) {
        HtpTest htpTest = saveOrGetHtpTest(req.getChildId());
        String url = s3Service.uploadImage(req.getFile());
        htpTest.setFemaleDrawingUrl(url);

        imageMap.put("female", new HtpTestDiagnosisReq(req.getTime(), req.getType(), url));

        if (req.getIndex().equals(4)) {
            return sendToAiServer(user, req.getChildId(), htpTest, imageMap);
        }
        redisService.saveImageMap(req.getChildId(), imageMap);
        return "";
    }

    // ✅ AI 서버 요청 처리 (마지막 그림 도착 시)
    private String sendToAiServer(User user, Integer childId, HtpTest htpTest, Map<String, HtpTestDiagnosisReq> imageMap) {
        List<HtpTestDiagnosisReq> files = new ArrayList<>(imageMap.values());
        String result = imageServeService.sendImageData(user, files);
        htpTest.setAnalysisResult(result);

        //redisService.deleteImageMap(childId); // AI 분석 완료 후 Redis 데이터 삭제
        return result;
    }

    // ✅ 오늘의 HTP 테스트 데이터 확인 후 삭제
    private void checkTodayHtpTest(Integer childId) {
        List<HtpTest> htpTests = getHtpTestByChildIdAndDate(childId);

        if (htpTests.isEmpty()) {
            return;
        }

        // htpTests의 파일들 조회하고 S3에서 삭제
        List<String> htpFiles = htpTests.stream()
                .flatMap(htpTest -> Stream.of(
                        htpTest.getPdfUrl(),
                        htpTest.getHouseDrawingUrl(),
                        htpTest.getTreeDrawingUrl(),
                        htpTest.getMaleDrawingUrl(),
                        htpTest.getFemaleDrawingUrl()
                ))
                .filter(Objects::nonNull)
                .toList();

        s3Service.deleteFile(htpFiles);

        htpTestRepository.deleteAll(htpTests);
    }

    // ✅ 특정 Child의 오늘 날짜 데이터 조회
    private List<HtpTest> getHtpTestByChildIdAndDate(Integer childId) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        return htpTestRepository.findByChildIdAndCreatedAtBetween(childId, startOfDay, endOfDay);
    }

    // ✅ 특정 날짜의 HTP 테스트 조회
    public HtpTest getByChildIdAndDate(Integer childId, LocalDate selectedDate) {
        return htpTestRepository.findByChildIdAndDate(childId, selectedDate).orElse(null);
    }

    // ✅ 최근 HTP 테스트 조회
    public HtpTest getLastHtpTest(Integer childId) {
        return htpTestRepository.findFirstByChildIdOrderByCreatedAtDesc(childId).orElse(null);
    }

    // ✅ PDF URL 생성 및 반환
    public String getHtpTestPdfUrl(User user, Integer htpTestId) {
        HtpTest htpTest = htpTestRepository.findByHtpTestId(htpTestId);
        Child child = childrenService.getById(htpTest.getChildId());
        htpTest.setPdfUrl(pdfService.generatePdf(user, child, htpTest.getAnalysisResult(), htpTest));
        return htpTest.getPdfUrl();
    }

    // ✅ HtpTest 저장 (기존 데이터가 없으면 새로 생성)
    private HtpTest saveOrGetHtpTest(Integer childId) {
        List<HtpTest> htpTests = getHtpTestByChildIdAndDate(childId);
        if (!htpTests.isEmpty()) {
            return htpTests.get(0);
        }
        HtpTest newTest = new HtpTest();
        newTest.setChildId(childId);
        return htpTestRepository.save(newTest);
    }
}
