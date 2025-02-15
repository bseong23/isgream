package com.ssafy.iscream.patTest.service;

import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.common.exception.MinorException.DataException;
import com.ssafy.iscream.patTest.domain.PatQuestion;
import com.ssafy.iscream.patTest.domain.PatTest;
import com.ssafy.iscream.patTest.dto.request.PatTestCreateReq;
import com.ssafy.iscream.patTest.dto.response.PatTestQuestionRes;
import com.ssafy.iscream.patTest.dto.response.PatTestRes;
import com.ssafy.iscream.patTest.repository.PatQuestionRepository;
import com.ssafy.iscream.patTest.repository.PatTestRepository;
import com.ssafy.iscream.pdf.service.PatTestPdfService;
import com.ssafy.iscream.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatTestService {

    private final PatQuestionRepository patQuestionRepository;
    private final PatTestRepository patTestRepository;
    private final PatTestPdfService patTestPdfService;

    // PAT 검사 질문 조회
    public List<PatTestQuestionRes> getPatTestList() {
        List<PatQuestion> questions = patQuestionRepository.findAll();
        return questions.stream()
                .map(q -> new PatTestQuestionRes(
                        q.getQuestion(),
                        q.getAnswer1(),
                        q.getAnswer2(),
                        q.getAnswer3()
                ))
                .collect(Collectors.toList());
    }

    // PAT 검사 결과 제출
    @Transactional
    public PatTestRes postPatTestResult(User user, PatTestCreateReq patTestCreateReq) {
        PatTest patTest = PatTest.builder()
                .userId(user.getUserId())
                .testDate(LocalDate.now())
                .aScore(patTestCreateReq.getScoreA())
                .bScore(patTestCreateReq.getScoreB())
                .cScore(patTestCreateReq.getScoreC())
                .result(calculateResult(patTestCreateReq.getScoreA(), patTestCreateReq.getScoreB(), patTestCreateReq.getScoreC()))
                .build();

        patTestRepository.save(patTest);

        return new PatTestRes(
                patTest.getTestDate().toString(),
                patTest.getAScore(),
                patTest.getBScore(),
                patTest.getCScore(),
                patTest.getResult().getDescription()
        );
    }

    // PAT 검사 결과 최신 조회
    public PatTestRes getPatTestResult(User user) {
        PatTest patTest = patTestRepository.findLatestByUserId(user.getUserId())
                .orElseThrow(() -> new DataException(ErrorCode.DATA_NOT_FOUND));

        return new PatTestRes(
                patTest.getTestDate().toString(),
                patTest.getAScore(),
                patTest.getBScore(),
                patTest.getCScore(),
                patTest.getResult().getDescription()
        );
    }

    // PAT 검사 결과 리스트 조회
    public List<PatTestRes> getPatTestResultList(User user, LocalDate startDate, LocalDate endDate) {
        List<PatTest> patTestList = patTestRepository.findByUserIdAndDate(user.getUserId(), startDate, endDate);
        return patTestList.stream()
                .map(l -> new PatTestRes(
                        l.getTestDate().toString(),
                        l.getAScore(),
                        l.getBScore(),
                        l.getCScore(),
                        l.getResult().getDescription()
                ))
                .collect(Collectors.toList());
    }

    // PAT 검사 결과 PDF 조회
    @Transactional
    public Map<String, String> getPatTestPdfUrl(User user, Integer patTestId) {
        PatTest patTest = patTestRepository.findById(patTestId).orElseThrow();
        patTest.setPdfUrl(patTestPdfService.generatePdf(user, patTest));

        Map<String, String> result = new HashMap<>();
        result.put("url", patTest.getPdfUrl());

        return result;
    }


    private PatTest.ResultType calculateResult(int scoreA, int scoreB, int scoreC){
        int maxScore = Math.max(Math.max(scoreA, scoreB), scoreC);

        if (maxScore == scoreA) {
            return PatTest.ResultType.A;
        }

        if (maxScore == scoreB) {
            return PatTest.ResultType.B;
        }

        return PatTest.ResultType.C;
    }
    
    
}
