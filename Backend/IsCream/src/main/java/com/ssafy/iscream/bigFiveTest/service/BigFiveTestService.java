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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
                .testDate(LocalDate.now())
                .conscientiousness(bigFiveTestCreateReq.getConscientiousness() - consAvg)
                .agreeableness(bigFiveTestCreateReq.getAgreeableness() - agreeAvg)
                .emotionalStability(bigFiveTestCreateReq.getEmotionalStability() - emoAvg)
                .extraversion(bigFiveTestCreateReq.getExtraversion() - extraAvg)
                .openness(bigFiveTestCreateReq.getOpenness() - openAvg)
                .build();

        BigFiveTest save = bigFiveTestRepository.save(bigFiveTest);
        updateAnalysis(save.getTestId());

        return new BigFiveTestRes(
                bigFiveTest.getTestDate().toString(),
                bigFiveTest.getConscientiousness(),
                bigFiveTest.getAgreeableness(),
                bigFiveTest.getEmotionalStability(),
                bigFiveTest.getExtraversion(),
                bigFiveTest.getOpenness(),
                bigFiveTest.getAnalysis()
        );
    }


    // 성격 5요인 테스트 최근 결과 조회
    public BigFiveTestRes getBigFiveTestResult(Integer childId) {
        BigFiveTest bigFiveTest = bigFiveTestRepository.findFirstByChildIdOrderByTestDateDesc(childId);
        if (bigFiveTest == null) {
            throw new DataException(ErrorCode.DATA_NOT_FOUND);
        }

        return new BigFiveTestRes(
                bigFiveTest.getTestDate().toString(),
                bigFiveTest.getConscientiousness(),
                bigFiveTest.getAgreeableness(),
                bigFiveTest.getEmotionalStability(),
                bigFiveTest.getExtraversion(),
                bigFiveTest.getOpenness(),
                bigFiveTest.getAnalysis()
        );
    }


    @Transactional
    public Map<String, String> getBigFivePdfUrl(User user, Integer bigFiveTestId) {
        BigFiveTest bigFiveTest = bigFiveTestRepository.findById(bigFiveTestId).get();
        Child child = childrenService.getById(bigFiveTest.getChildId());
        bigFiveTest.setPdfUrl(bigFiveTestPdfService.generatePdf(user, child, bigFiveTest));

        Map<String, String> result = new HashMap<>();
        result.put("url", bigFiveTest.getPdfUrl());

        return result;
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

    // childIds 해당하는 pdf url 목록 조회
    public List<String> getBigFiveTestPdfUrl(List<Integer> childIds) {
        return bigFiveTestRepository.findPdfUrlByChildIdIn(childIds);
    }
    private void updateAnalysis(Integer testId) {
        // 테스트 결과 가져오기
        BigFiveTest bigFiveTest = bigFiveTestRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("테스트 결과를 찾을 수 없습니다."));

        // 해석 생성
        String analysis = generateBigFiveAnalysis(bigFiveTest);
        bigFiveTest.setAnalysis(analysis);

        // 업데이트 저장
        bigFiveTestRepository.save(bigFiveTest);
    }

    private String generateBigFiveAnalysis(BigFiveTest bigFiveTest) {
        double conscientiousness = bigFiveTest.getConscientiousness();
        double agreeableness = bigFiveTest.getAgreeableness();
        double emotionalStability = bigFiveTest.getEmotionalStability();
        double extraversion = bigFiveTest.getExtraversion();
        double openness = bigFiveTest.getOpenness();

        StringBuilder analysis = new StringBuilder();
        analysis.append("성격 해석: \n");

        // 성실성 해석
        analysis.append("성실성 (Conscientiousness):\n");
        analysis.append(getTraitAnalysis(conscientiousness, "계획적이고 신중한 성향", "즉흥적인 성향"));
        analysis.append("\n");

        // 친화성 해석
        analysis.append("친화성 (Agreeableness):\n");
        analysis.append(getTraitAnalysis(agreeableness, "협력적이고 배려하는 성향", "경쟁적이고 독립적인 성향"));
        analysis.append("\n");

        // 정서적 안정성 해석
        analysis.append("정서적 안정성 (Emotional Stability):\n");
        analysis.append(getTraitAnalysis(emotionalStability, "감정적으로 안정적이며 스트레스에 강한 성향", "감정 기복이 크고 불안감이 높은 성향"));
        analysis.append("\n");

        // 외향성 해석
        analysis.append("외향성 (Extraversion):\n");
        analysis.append(getTraitAnalysis(extraversion, "활발하고 사교적인 성향", "조용하고 내향적인 성향"));
        analysis.append("\n");

        // 개방성 해석
        analysis.append("개방성 (Openness):\n");
        analysis.append(getTraitAnalysis(openness, "창의적이고 새로운 경험을 선호하는 성향", "전통적이고 익숙한 방식을 선호하는 성향"));
        analysis.append("\n");

        return analysis.toString();
    }

    /**
     * 편차 값을 기반으로 성격 특성 해석을 생성하는 메서드
     */
    private static String getTraitAnalysis(double deviation, String highTrait, String lowTrait) {
        if (deviation >= 1.0) {
            return "- 평균보다 상당히 높음: " + highTrait + "이 강한 편입니다.\n";
        } else if (deviation >= 0.5) {
            return "- 평균보다 다소 높음: " + highTrait + " 경향이 있습니다.\n";
        } else if (deviation >= -0.5) {
            return "- 평균적인 수준: 특정 성향이 두드러지지 않으며 균형을 이루고 있습니다.\n";
        } else if (deviation >= -1.0) {
            return "- 평균보다 다소 낮음: " + lowTrait + " 경향이 있습니다.\n";
        } else {
            return "- 평균보다 상당히 낮음: " + lowTrait + "이 강한 편입니다.\n";
        }
    }

    public BigFiveTest getLastBigFiveTest(Integer childId) {
        return bigFiveTestRepository.findFirstByChildIdOrderByCreatedAtDesc(childId);
    }
}

