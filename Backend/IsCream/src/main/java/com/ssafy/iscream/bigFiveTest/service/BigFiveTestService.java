package com.ssafy.iscream.bigFiveTest.service;

import com.ssafy.iscream.bigFiveTest.domain.BigFiveQuestion;
import com.ssafy.iscream.bigFiveTest.domain.BigFiveScore;
import com.ssafy.iscream.bigFiveTest.domain.BigFiveTest;
import com.ssafy.iscream.bigFiveTest.dto.request.BigFiveTestCreateReq;
import com.ssafy.iscream.bigFiveTest.dto.response.BigFiveTestQuestionRes;
import com.ssafy.iscream.bigFiveTest.dto.response.BigFiveTestRes;
import com.ssafy.iscream.bigFiveTest.repository.BigFiveQuestionRepository;
import com.ssafy.iscream.bigFiveTest.repository.BigFiveScoreRepository;
import com.ssafy.iscream.bigFiveTest.repository.BigFiveTestRepository;
import com.ssafy.iscream.children.domain.Child;
import com.ssafy.iscream.children.service.ChildrenService;
import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.common.exception.MinorException.DataException;
import com.ssafy.iscream.pdf.service.BigFiveTestPdfService;
import com.ssafy.iscream.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BigFiveTestService {

    private final BigFiveQuestionRepository bigFiveQuestionRepository;
    private final BigFiveTestRepository bigFiveTestRepository;
    private final BigFiveScoreRepository bigFiveScoreRepository;
    private final BigFiveTestPdfService bigFiveTestPdfService;
    private final ChildrenService childrenService;

    // 성격 5요인 질문 목록 조회
    public List<BigFiveTestQuestionRes> getBigFiveTestList() {
        List<BigFiveQuestion> questions = bigFiveQuestionRepository.findAll();
        return questions.stream()
                .map(q -> new BigFiveTestQuestionRes(
                        q.getQuestion(),
                        q.getQuestionType()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public BigFiveTestRes postBigFiveTestResult(User user, BigFiveTestCreateReq bigFiveTestCreateReq) {

        double consAvg = updateBigFiveScore("CONSCIENTIOUSNESS", bigFiveTestCreateReq.getConscientiousness());
        double agreeAvg = updateBigFiveScore("AGREEABLENESS", bigFiveTestCreateReq.getAgreeableness());
        double emoAvg = updateBigFiveScore("EMOTIONAL_STABILITY", bigFiveTestCreateReq.getEmotionalStability());
        double extraAvg = updateBigFiveScore("EXTRAVERSION", bigFiveTestCreateReq.getExtraversion());
        double openAvg = updateBigFiveScore("OPENNESS", bigFiveTestCreateReq.getOpenness());

        System.out.printf("%s %s %s %s %s\n", consAvg, agreeAvg, emoAvg, extraAvg, openAvg);

        BigFiveTest bigFiveTest = BigFiveTest.builder()
                .userId(user.getUserId())
                .childId(bigFiveTestCreateReq.getChildId())
                .date(LocalDate.now().toString())
                .conscientiousness(bigFiveTestCreateReq.getConscientiousness() - consAvg)
                .agreeableness(bigFiveTestCreateReq.getAgreeableness() - agreeAvg)
                .emotionalStability(bigFiveTestCreateReq.getEmotionalStability() - emoAvg)
                .extraversion(bigFiveTestCreateReq.getExtraversion() - extraAvg)
                .openness(bigFiveTestCreateReq.getOpenness() - openAvg)
                .build();

        bigFiveTestRepository.save(bigFiveTest);

        return new BigFiveTestRes(
                bigFiveTest.getDate(),
                bigFiveTest.getConscientiousness(),
                bigFiveTest.getAgreeableness(),
                bigFiveTest.getEmotionalStability(),
                bigFiveTest.getExtraversion(),
                bigFiveTest.getOpenness()
        );
    }


    // 성격 5요인 테스트 최근 결과 조회
    public BigFiveTestRes getBigFiveTestResult(Integer childId) {
        BigFiveTest bigFiveTest = bigFiveTestRepository.findFirstByChildIdOrderByTestDateDesc(childId);
        if (bigFiveTest == null) {
            throw new DataException(ErrorCode.DATA_NOT_FOUND);
        }

        return new BigFiveTestRes(
                bigFiveTest.getDate(),
                bigFiveTest.getConscientiousness(),
                bigFiveTest.getAgreeableness(),
                bigFiveTest.getEmotionalStability(),
                bigFiveTest.getExtraversion(),
                bigFiveTest.getOpenness()
        );
    }


    @Transactional
    public String getBigFivePdfUrl(User user, Integer bigFiveTestId) {
        BigFiveTest bigFiveTest = bigFiveTestRepository.findById(bigFiveTestId).get();
        Child child = childrenService.getById(bigFiveTest.getChildId());
        bigFiveTest.setPdfUrl(bigFiveTestPdfService.generatePdf(user, child, bigFiveTest));
        return bigFiveTest.getPdfUrl();
    }


    private double updateBigFiveScore(String type, double score) {
        BigFiveScore bigFiveScore = bigFiveScoreRepository.findByBigFiveType(type);

        if (bigFiveScore == null) {
            bigFiveScore = BigFiveScore.builder()
                    .bigFiveType(type)
                    .totalUsers(0)
                    .totalScore(0.0)
                    .averageScore(0.0)
                    .build();
        }

        bigFiveScore.setTotalUsers(bigFiveScore.getTotalUsers() + 1);
        bigFiveScore.setTotalScore(bigFiveScore.getTotalScore() + score);
        bigFiveScore.setAverageScore(bigFiveScore.getTotalScore() / bigFiveScore.getTotalUsers());

        bigFiveScoreRepository.save(bigFiveScore);
        return bigFiveScore.getAverageScore();
    }

    // childId에 해당하는 결과 목록 조회
    public List<BigFiveTest> getBigFiveTestListByChildId(Integer childId) {
        return bigFiveTestRepository.findByChildId(childId);
    }
}

