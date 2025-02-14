export interface CalendarResponse {
  code: "S0000" | "E4001";
  message: string;
  data: CalendarData[];
}

export interface CalendarData {
  emoji: string;
  isMemo: boolean;
  isHtp: boolean;
}

export interface DetailResponse {
  code: "S0000" | "E4001";
  message: string;
  data: DetailData;
}

export interface DetailData {
  isMemo: boolean;
  isHtp: boolean;
  houseUrl?: string;
  treeUrl?: string;
  personUrl?: string;
  report?: string;
  memoId?: string;
  memo?: string;
}

// Props 타입들
export interface CalendarProps {
  childId: string;
  className?: string;
}

export interface CalendarHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export interface CalendarGridProps {
  currentDate: Date;
  calendarData: { [key: string]: CalendarData };
  onSelectDay: (day: number | null) => void;
  selectedDay: number | null;
}

export interface DetailViewProps {
  detail: DetailData | null;
  selectedDate: { year: number; month: number; day: number | null };
  onMemoUpdate?: (memo: string) => void; // 메모 업데이트 함수 추가
}
