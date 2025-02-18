// src/hooks/useBigFiveTest.ts
import { useState, useCallback } from "react";
import { bigFiveApi } from "../../api/bigFive";
import {
  BigFiveQuestion,
  BigFiveTestResultRequest,
  BigFiveTestResultResponse,
  BigFiveRecentResultResponse
} from "../../types/bigfive";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const useBigFiveTest = () => {
  const [questions, setQuestions] = useState<BigFiveQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] =
    useState<BigFiveTestResultResponse | null>(null);
  const [recentResult, setRecentResult] =
    useState<BigFiveRecentResultResponse | null>(null);

  const selectedChild = useSelector(
    (state: RootState) => state.child.selectedChild
  );

  // 질문 목록 가져오기
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bigFiveApi.getQuestionList();
      console.log("질문 목록 응답:", response);

      // 타입을 명시적으로 지정
      setQuestions(response.data);
    } catch (err) {
      console.error("질문 목록 로드 에러:", err);
      setError(err instanceof Error ? err.message : "문제 목록 조회 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  // 검사 결과 제출
  const submitTestResult = useCallback(
    async (resultData: Omit<BigFiveTestResultRequest, "childId">) => {
      if (!selectedChild) {
        setError("선택된 자녀가 없습니다.");
        return null;
      }

      setLoading(true);
      setError(null);
      try {
        const completeResultData: BigFiveTestResultRequest = {
          ...resultData,
          childId: selectedChild.childId
        };

        const response = await bigFiveApi.submitTestResult(completeResultData);
        setTestResult(response);
        return response;
      } catch (err) {
        setError(err instanceof Error ? err.message : "검사 결과 제출 실패");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [selectedChild]
  );

  // 최근 검사 결과 조회
  const fetchRecentResult = useCallback(async () => {
    if (!selectedChild) {
      setError("선택된 자녀가 없습니다.");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await bigFiveApi.getRecentResult(selectedChild.childId);
      setRecentResult(response);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "최근 검사 결과 조회 실패");
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedChild]);

  return {
    questions,
    loading,
    error,
    testResult,
    recentResult,
    fetchQuestions,
    submitTestResult,
    fetchRecentResult
  };
};
