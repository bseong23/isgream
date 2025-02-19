import { DateRange } from "./types";
// import { useState } from 'react';
import Input from "../input/input";

interface DateSelectorProps {
  dateRange: DateRange;
  onDateChange: (range: DateRange) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  dateRange,
  onDateChange
}) => {
  const handleStartDateChange = (value: string) => {
    if (dateRange.endDate && dateRange.endDate < value) {
      onDateChange({
        startDate: value,
        endDate: value
      });
    } else {
      onDateChange({
        ...dateRange,
        startDate: value
      });
    }
  };

  const handleEndDateChange = (value: string) => {
    if (!dateRange.startDate || value >= dateRange.startDate) {
      onDateChange({
        ...dateRange,
        endDate: value
      });
    }
  };

  return (
    <div className="flex items-center space-x-2 my-5">
      <div className="sm:w-auto flex items-center relative">
        {/* <Calendar className="h-5 w-5 text-gray-500" /> */}
        <Input
          type="calendar"
          placeholder="시작일을 선택하세요"
          required={true}
          value={dateRange.startDate}
          onChange={handleStartDateChange}
          className="w-full border-none"
        />
        <label className="absolute left-2 -top-2.5 px-1 text-sm transition-all text-gray-500 bg-white">
          시작일
        </label>
      </div>
      <span className="text-gray-500">~</span>
      <div className="flex items-center relative">
        {/* <Calendar className="h-5 w-5 text-gray-500" /> */}
        <Input
          type="calendar"
          placeholder="종료일을 선택하세요"
          required={true}
          value={dateRange.endDate}
          onChange={handleEndDateChange}
          className="w-full border-none"
        />
        <label className="absolute left-2 -top-2.5 px-1 text-sm transition-all text-gray-500 bg-white">
          종료일
        </label>
      </div>
    </div>
  );
};

export default DateSelector;
