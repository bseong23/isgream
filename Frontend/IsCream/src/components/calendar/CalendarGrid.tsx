import React from "react";
import { CalendarGridProps } from "./types";

// 감정 상태에 따른 이모티콘 매핑
const emotionToEmoji = {
  HAPPY: "😄", // 기쁨
  SAD: "😢", // 슬픔
  MAD: "😡", // 화남
  FEAR: "😨", // 두려움
  NORMAL: "😐" // 보통/중립
};

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  calendarData,
  onSelectDay,
  selectedDay
}) => {
  // 요일 배열 정의
  const weekDays = [
    { day: "일", className: "text-red-500" },
    { day: "월", className: "" },
    { day: "화", className: "" },
    { day: "수", className: "" },
    { day: "목", className: "" },
    { day: "금", className: "" },
    { day: "토", className: "text-blue-500" }
  ];

  // 해당 월의 날짜 배열을 생성하는 함수
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: (number | null)[] = [];
    // 첫 주의 시작 전 빈 칸 채우기
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    // 해당 월의 날짜 채우기
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    return days;
  };

  // 일요일 체크
  const isSunday = (index: number) => {
    return index % 7 === 0;
  };

  // 토요일 체크
  const isSaturday = (index: number) => {
    return index % 7 === 6;
  };

  return (
    <>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map(({ day, className }) => (
          <div key={day} className={`text-center font-medium ${className}`}>
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth().map((day, index) => {
          const dayData = day ? calendarData[day] : null;

          return (
            <div
              key={index}
              className={`
              aspect-square rounded-[15px] p-1 
              ${!day ? "border-white" : "border text-[#333333] cursor-pointer"}
              ${isSunday(index) ? "text-red-400" : ""}
              ${isSaturday(index) ? "text-blue-400" : ""}
              relative
              ${selectedDay === day ? "border-2 border-green-700" : ""}
            `}
              onClick={() => day && onSelectDay(day)}
            >
              <div className={`relative w-full h-full flex items-start`}>
                <span
                  className={`absolute top-0 left-0 
                  text-xs 
                  sm:text-sm 
                  md:text-base 
                  lg:text-lg 
                  xl:text-xl
                `}
                >
                  {day}
                </span>

                {dayData?.isHtp && dayData.emoji && (
                  <div
                    className="absolute bottom-0 right-0 
                    text-base 
                    sm:text-xl 
                    md:text-2xl 
                    lg:text-3xl 
                    xl:text-4xl
                  "
                  >
                    {emotionToEmoji[
                      dayData.emoji as keyof typeof emotionToEmoji
                    ] || "😐"}
                  </div>
                )}

                <div className="absolute top-1 right-1 flex gap-1">
                  {dayData?.isMemo && (
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CalendarGrid;
