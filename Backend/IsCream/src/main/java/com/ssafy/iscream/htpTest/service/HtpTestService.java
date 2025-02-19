package com.ssafy.iscream.htpTest.service;

import com.ssafy.iscream.calendar.dto.request.CalendarGetReq;
import com.ssafy.iscream.children.domain.Child;
import com.ssafy.iscream.children.service.ChildrenService;
import com.ssafy.iscream.htpTest.domain.HtpTest;
import com.ssafy.iscream.htpTest.dto.request.HtpTestDiagnosisReq;
import com.ssafy.iscream.htpTest.dto.request.HtpTestReq;
import com.ssafy.iscream.htpTest.dto.response.HtpTestImageAndDiagnosis;
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
import java.util.*;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional
public class HtpTestService {
    private final HtpTestRepository htpTestRepository;
    private final S3Service s3Service;
    private final HtpTestPdfService pdfService;
    private final ChildrenService childrenService;
    private final RedisService redisService;
    private final ImageServeService imageServeService;

    public List<HtpTest> getByYearMonth(Integer userId, CalendarGetReq calendarGetReq) {
        LocalDateTime startDate = LocalDateTime.of(calendarGetReq.getYear(), calendarGetReq.getMonth(), 1, 0, 0);
        LocalDateTime endDate = startDate.plusMonths(1);
        return htpTestRepository.findByChildIdAndCreatedAtBetweenAndValid(calendarGetReq.getChildId(), startDate, endDate);
    }

    // ✅ 전체 HTP 테스트 사이클 실행
    public HtpTestImageAndDiagnosis htpTestCycle(User user, HtpTestReq req) {
        Integer childId = req.getChildId();

        // 🔥 기존 HashMap → LinkedHashMap 사용하여 API 순서 유지
        LinkedHashMap<String, HtpTestDiagnosisReq> imageMap = new LinkedHashMap<>(redisService.getImageMap(childId));

        // ✅ index가 1이면 Redis 초기화 (새로운 사이클 시작)
        if (req.getIndex().equals(1)) {
            redisService.deleteImageMap(childId);
            imageMap.clear();
        }

        if (req.getType().equals("house")) {
            checkTodayHtpTest(childId);
        }

        processHtpDrawing(user, req, imageMap, req.getType());
        HtpTestImageAndDiagnosis response  = new HtpTestImageAndDiagnosis();
        if (req.getIndex().equals(4) && (req.getType().equals("male") || req.getType().equals("female"))) {
            sendToAiServer(user, childId, saveOrGetHtpTest(user.getUserId(), childId), imageMap);
            HtpTest htpTest = saveOrGetHtpTest(user.getUserId(), req.getChildId());
            response.setHtpTestId(htpTest.getHtpTestId());
            response.setResult(htpTest.getAnalysisResult());
            response.setHouseDrawingUrl(htpTest.getHouseDrawingUrl());
            response.setTreeDrawingUrl(htpTest.getTreeDrawingUrl());
            response.setMaleDrawingUrl(htpTest.getMaleDrawingUrl());
            response.setFemaleDrawingUrl(htpTest.getFemaleDrawingUrl());

            return response;
        }

        return response;
    }

    // ✅ 그림 데이터 처리 (중복 제거 및 순서 유지)
    private void processHtpDrawing(User user, HtpTestReq req, LinkedHashMap<String, HtpTestDiagnosisReq> imageMap, String type) {
        HtpTest htpTest = saveOrGetHtpTest(user.getUserId(), req.getChildId());
        String url = s3Service.uploadImage(req.getFile());

        switch (type) {
            case "house" -> htpTest.setHouseDrawingUrl(url);
            case "tree" -> htpTest.setTreeDrawingUrl(url);
            case "male" -> htpTest.setMaleDrawingUrl(url);
            case "female" -> htpTest.setFemaleDrawingUrl(url);
        }

        imageMap.put(type, new HtpTestDiagnosisReq(req.getTime(), req.getType(), url));
        redisService.saveImageMap(req.getChildId(), imageMap);
    }

    // ✅ AI 서버 요청 처리 (순서 유지)
    private String sendToAiServer(User user, Integer childId, HtpTest htpTest, LinkedHashMap<String, HtpTestDiagnosisReq> imageMap) {
        List<HtpTestDiagnosisReq> files = new ArrayList<>(imageMap.values());
        String result = imageServeService.sendImageData(user, files);
        htpTest.setAnalysisResult(result);
        htpTestRepository.save(htpTest);
        redisService.deleteImageMap(childId);
        return result;
    }

    // ✅ 오늘의 HTP 테스트 데이터 확인 후 삭제
    private void checkTodayHtpTest(Integer childId) {
        List<HtpTest> htpTests = getHtpTestByChildIdAndDate(childId);

        if (!htpTests.isEmpty()) {
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

            if (!htpFiles.isEmpty()) {
                s3Service.deleteFile(htpFiles);
            }

            htpTestRepository.deleteAll(htpTests);
        }
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

    // ✅ PDF URL 생성 및 반환
    public Map<String, String> getHtpTestPdfUrl(User user, Integer htpTestId) {
        HtpTest htpTest = htpTestRepository.findByHtpTestId(htpTestId);
        Child child = childrenService.getById(htpTest.getChildId());
        htpTest.setPdfUrl(pdfService.generatePdf(user, child, htpTest.getAnalysisResult(), htpTest));

        Map<String, String> result = new HashMap<>();
        result.put("url", htpTest.getPdfUrl());

        return result;
    }

    // ✅ HtpTest 저장 (기존 데이터가 없으면 새로 생성)
    private HtpTest saveOrGetHtpTest(Integer userId, Integer childId) {
        List<HtpTest> htpTests = getHtpTestByChildIdAndDate(childId);
        if (!htpTests.isEmpty()) {
            return htpTests.get(0);
        }

        HtpTest newTest = new HtpTest();
        newTest.setUserId(userId);
        newTest.setChildId(childId);

        return htpTestRepository.save(newTest);
    }
}
