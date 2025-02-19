import React from "react";
import { CalendarGridProps } from "./types";
import seal from "../../assets/icons/도장.png";

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
               aspect-square rounded-[15px] p-1 relative
               ${!day ? "border-white" : "border text-[#333333] cursor-pointer"}
               ${isSunday(index) ? "text-red-400" : ""}
               ${isSaturday(index) ? "text-blue-400" : ""}
               ${selectedDay === day ? "border-2 border-green-700" : ""}
             `}
              onClick={() => day && onSelectDay(day)}
            >
              <div className="relative w-full h-full flex items-start">
                {/* 날짜 */}
                <span className="absolute text-sm sm:text-base md:text-lg lg:text-xl">
                  {day}
                </span>

                {/* 도장 이미지와 점 표시 */}
                {dayData?.isHtp && (
                  <div className="absolute bottom-0 right-0 w-[90%] h-[90%] md:flex items-center justify-center hidden">
                    <img
                      src={seal}
                      alt="도장"
                      className="w-full h-full object-contain transition-transform duration-200 hover:scale-105"
                    />
                  </div>
                )}

                {/* 점 표시 (작은 화면) */}
                <div className="absolute top-1 right-1 flex gap-1">
                  {dayData?.isMemo && (
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  )}
                  {dayData?.isHtp && (
                    <div className="md:hidden">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    </div>
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
