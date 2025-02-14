// 달력 조회 요청 타입
export interface CalendarRequest {
  childId: number;
  year: number;
  month: number;
}

// 달력 데이터 타입
export interface DayInfo {
  emoji: string;
  isMemo: boolean;
  isHtp: boolean;
}

export interface CalendarResponse {
  code: "S0000" | "E4001";
  message: string;
  data?: {
    [key: number]: DayInfo; // key는 일자(day)
  };
}

// 상세 조회 요청 타입
export interface CalendarDetailRequest {
  childId: number;
  selectedDate: string; // 예: "2025-01-21"
}

// 상세 조회 응답 타입
export interface CalendarDetailResponse {
  code: "S0000" | "E4001";
  message: string;
  data?: {
    isMemo: boolean;
    isHtp: boolean;
    houseUrl?: string;
    treeUrl?: string;
    personUrl?: string;
    report?: string;
    memoId?: string;
    memoContent?: string;
  };
}

// 메모 작성 요청 타입
export interface MemoCreateRequest {
  childId: number;
  selectedDate: string;
  memo: string;
}

// 메모 수정 요청 타입
export interface MemoUpdateRequest {
  memoId: number;
  memo: string;
}

// 공통 응답 타입
export interface CommonResponse {
  code: "S0000" | "E4002";
  message: string;
}
