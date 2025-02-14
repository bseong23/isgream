import React, { useState, useRef, useEffect } from "react";
import { CalendarHeaderProps } from "./types";

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onDateChange
}) => {
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const yearButtonRef = useRef<HTMLButtonElement>(null);
  const monthButtonRef = useRef<HTMLButtonElement>(null);
  const yearPopupRef = useRef<HTMLDivElement>(null);
  const monthPopupRef = useRef<HTMLDivElement>(null);

  // 년도 선택 옵션 (현재 년도 ±10년)
  const years = Array.from(
    { length: 9 },
    (_, i) => currentDate.getFullYear() - 5 + i
  );

  // 월 선택 옵션
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 연도 선택 팝업
      if (
        showYearSelect &&
        !yearButtonRef.current?.contains(event.target as Node) &&
        !yearPopupRef.current?.contains(event.target as Node)
      ) {
        setShowYearSelect(false);
      }
      // 월 선택 팝업
      if (
        showMonthSelect &&
        !monthButtonRef.current?.contains(event.target as Node) &&
        !monthPopupRef.current?.contains(event.target as Node)
      ) {
        setShowMonthSelect(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showYearSelect, showMonthSelect]);

  const handleYearChange = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    onDateChange(newDate);
    setShowYearSelect(false);
  };

  const handleMonthChange = (month: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month - 1);
    onDateChange(newDate);
    setShowMonthSelect(false);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    onDateChange(newDate);
  };

  return (
    <div className="flex justify-between items-center mb-8 relative">
      <button
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        onClick={handlePrevMonth}
      >
        ◀
      </button>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            ref={yearButtonRef}
            className="text-2xl font-bold hover:bg-gray-100 px-2 py-1 rounded"
            onClick={() => {
              setShowYearSelect(!showYearSelect);
              setShowMonthSelect(false);
            }}
          >
            {currentDate.getFullYear()}년
          </button>

          {showYearSelect && (
            <div
              ref={yearPopupRef}
              className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg z-50 w-48"
            >
              <div className="grid grid-cols-3 gap-2 p-2">
                {years.map((year) => (
                  <button
                    key={year}
                    className={`px-1 py-1 rounded text-center w-full
                     ${year === currentDate.getFullYear() ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                    onClick={() => handleYearChange(year)}
                  >
                    {year}년
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            ref={monthButtonRef}
            className="text-2xl font-bold hover:bg-gray-100 px-2 py-1 rounded"
            onClick={() => {
              setShowMonthSelect(!showMonthSelect);
              setShowYearSelect(false);
            }}
          >
            {currentDate.getMonth() + 1}월
          </button>

          {showMonthSelect && (
            <div
              ref={monthPopupRef}
              className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg z-50 w-48"
            >
              <div className="grid grid-cols-3 gap-2 p-4">
                {months.map((month) => (
                  <button
                    key={month}
                    className={`px-1 py-1 rounded text-center w-full
                     ${month === currentDate.getMonth() + 1 ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                    onClick={() => handleMonthChange(month)}
                  >
                    {month}월
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        onClick={handleNextMonth}
      >
        ▶
      </button>
    </div>
  );
};

export default CalendarHeader;
