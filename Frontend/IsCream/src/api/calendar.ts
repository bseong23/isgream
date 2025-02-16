// api/calendar.ts
import { api } from "../utils/common/axiosInstance";
import type {
  CalendarRequest,
  CalendarResponse,
  CalendarDetailRequest,
  CalendarDetailResponse,
  MemoCreateRequest,
  MemoUpdateRequest,
  CommonResponse
} from "../types/calendar";

// React Query용 key factory
export const calendarKeys = {
  all: ["calendar"] as const,
  month: (childId: number, yearMonth: string) =>
    [...calendarKeys.all, childId, yearMonth] as const,
  detail: (childId: number, selectedDate: string) =>
    [...calendarKeys.all, "detail", childId, selectedDate] as const
};

// API 함수들
export const calendarApi = {
  // 월별 달력 조회
  PostCalendar: async (params: CalendarRequest): Promise<CalendarResponse> => {
    const response = await api.post(`/calendars`, {
      childId: params.childId,
      year: params.year,
      month: params.month
    });
    return response.data;
  },

  // 날짜별 상세 정보 조회
  getCalendarDetail: async (
    data: CalendarDetailRequest
  ): Promise<CalendarDetailResponse> => {
    const response = await api.post("/calendars/detail", data);
    return response.data;
  },

  // 메모 작성
  createMemo: async (data: MemoCreateRequest): Promise<CommonResponse> => {
    const response = await api.post("/calendars/memo", data);
    return response.data;
  },

  // 메모 수정
  updateMemo: async (data: MemoUpdateRequest): Promise<CommonResponse> => {
    const response = await api.put("/calendars/memo", data);
    return response.data;
  },

  // 메모 삭제
  deleteMemo: async (memoId: number): Promise<CommonResponse> => {
    const response = await api.delete(`/calendars/memo/${memoId}`);
    return response.data;
  }
};
