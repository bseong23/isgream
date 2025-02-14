import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCalendar } from "../../hooks/calendar/useCalendar";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import DetailView from "./DetailView";
import { CalendarProps } from "./types";
import { format } from "date-fns";
import type { DayInfo } from "@/types/calendar";
import type { CalendarResponse } from "@/types/calendar"; // 이 타입을 추가해주세요

const Calendar: React.FC<CalendarProps> = ({ className }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  const { selectedChild } = useSelector((state: RootState) => state.child);
  const { fetchCalendar, loading, error } = useCalendar(
    Number(selectedChild?.childId) || 0
  );

  const initialSelectedDay =
    today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear()
      ? today.getDate()
      : null;

  const [selectedDay, setSelectedDay] = useState<number | null>(
    initialSelectedDay
  );
  const [calendarData, setCalendarData] = useState<Record<number, DayInfo>>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!selectedChild) return;
      const yearMonth = format(currentDate, "yyyy-MM");
      try {
        const response = await fetchCalendar(yearMonth);
        if (response?.code === "S0000" && response.data) {
          setCalendarData(response.data);
        }
      } catch (error) {
        console.error("Calendar fetch error:", error);
      }
    };
    fetchInitialData();
  }, [selectedChild, currentDate, fetchCalendar]);

  const handleDayClick = (day: number | null) => {
    setSelectedDay(day);
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    setSelectedDay(null);
  };

  if (!selectedChild) {
    return <div>선택된 자녀가 없습니다.</div>;
  }

  // fetchCalendar를 DetailViewProps에 맞는 타입으로 변환
  const typedFetchCalendar = async (
    yearMonth: string
  ): Promise<CalendarResponse> => {
    return fetchCalendar(yearMonth) as Promise<CalendarResponse>;
  };

  return (
    <div className={`w-[95%] max-w-2xl mx-auto p-4 ${className}`}>
      <CalendarHeader
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />

      <CalendarGrid
        currentDate={currentDate}
        calendarData={calendarData}
        onSelectDay={handleDayClick}
        selectedDay={selectedDay}
      />

      <div className="mt-4 min-h-[200px] p-4 px-1">
        <DetailView
          childId={Number(selectedChild.childId)}
          selectedDate={{
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1,
            day: selectedDay
          }}
          fetchCalendar={typedFetchCalendar}
          currentDate={currentDate}
          setCalendarData={setCalendarData}
        />
      </div>

      {loading && <div>로딩 중...</div>}
      {error && <div>에러: {error}</div>}
    </div>
  );
};

export default Calendar;
