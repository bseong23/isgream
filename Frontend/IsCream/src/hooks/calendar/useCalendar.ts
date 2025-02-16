import { useState, useCallback } from "react";
import { calendarApi } from "../../api/calendar";
import type {
  CalendarRequest,
  CalendarResponse,
  CalendarDetailRequest,
  CalendarDetailResponse,
  MemoCreateRequest,
  MemoUpdateRequest,
  CommonResponse
} from "@/types/calendar";
import axios from "axios";

export const useCalendar = (childId: number) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 달력 데이터 조회
  const fetchCalendar = useCallback(
    async (yearMonth: string): Promise<CalendarResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        const date = new Date(yearMonth);
        const body: CalendarRequest = {
          childId,
          year: date.getFullYear(),
          month: date.getMonth() + 1
        };

        console.log("요청 데이터:", body);
        const response = await calendarApi.PostCalendar(body);
        console.log("응답:", response);
        return response;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("에러 응답:", err.response?.data);
          console.error("상태 코드:", err.response?.status);
          console.error("요청 설정:", err.config);
        } else {
          console.error("예상치 못한 에러:", err);
        }

        const errorMessage =
          err instanceof Error
            ? err.message
            : "달력 데이터 조회 중 오류가 발생했습니다.";

        setError(errorMessage);
        console.error("Calendar fetch error:", err);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [childId]
  );

  // 상세 데이터 조회
  const fetchCalendarDetail = useCallback(
    async (selectedDate: string): Promise<CalendarDetailResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const requestBody: CalendarDetailRequest = {
          childId,
          selectedDate
        };
        const response = await calendarApi.getCalendarDetail(requestBody);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "상세 데이터 조회 중 오류가 발생했습니다.";

        setError(errorMessage);
        console.error("Calendar detail fetch error:", err);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [childId]
  );

  // 메모 생성
  const createMemo = useCallback(
    async (
      selectedDate: string,
      memo: string
    ): Promise<CommonResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const params: MemoCreateRequest = {
          childId,
          selectedDate,
          memo
        };
        const response = await calendarApi.createMemo(params);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "메모 작성 중 오류가 발생했습니다.";

        setError(errorMessage);
        console.error("Create memo error:", err);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [childId]
  );

  // 메모 수정
  const updateMemo = useCallback(
    async (memoId: number, memo: string): Promise<CommonResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const params: MemoUpdateRequest = {
          memoId,
          memo
        };
        const response = await calendarApi.updateMemo(params);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "메모 수정 중 오류가 발생했습니다.";

        setError(errorMessage);
        console.error("Update memo error:", err);

        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 메모 삭제
  const deleteMemo = useCallback(
    async (memoId: number): Promise<CommonResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await calendarApi.deleteMemo(memoId);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "메모 삭제 중 오류가 발생했습니다.";

        setError(errorMessage);
        console.error("Delete memo error:", err);

        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    fetchCalendar,
    fetchCalendarDetail,
    createMemo,
    updateMemo,
    deleteMemo
  };
};
