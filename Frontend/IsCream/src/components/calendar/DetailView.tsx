import React, { useState, useEffect } from "react";
import { CalendarDetailResponse } from "../../types/calendar";
import { useCalendar } from "../../hooks/calendar/useCalendar";
import MemoEditor from "./MemoEditor";
import { format } from "date-fns";
import type { DayInfo } from "@/types/calendar";
import { CalendarResponse } from "../../types/calendar";

interface DetailViewProps {
  childId: number;
  selectedDate: {
    year: number;
    month: number;
    day: number | null;
  };
  fetchCalendar: (yearMonth: string) => Promise<CalendarResponse>;
  currentDate: Date;
  setCalendarData: React.Dispatch<
    React.SetStateAction<Record<number, DayInfo>>
  >;
}

const DetailView: React.FC<DetailViewProps> = ({
  childId,
  selectedDate,
  fetchCalendar,
  currentDate,
  setCalendarData
}) => {
  const [activeTab, setActiveTab] = useState<"htp" | "memo">("htp");
  const [detail, setDetail] = useState<CalendarDetailResponse["data"] | null>(
    null
  );
  const { fetchCalendarDetail } = useCalendar(childId);

  useEffect(() => {
    const fetchDetail = async () => {
      if (selectedDate.day) {
        const formattedDate = `${selectedDate.year}-${String(selectedDate.month).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`;
        const response = await fetchCalendarDetail(formattedDate);
        if (response && response.data) {
          setDetail(response.data);
        }
      }
    };

    fetchDetail();
  }, [selectedDate, childId, fetchCalendarDetail]);

  const handleMemoSave = async (memo: string) => {
    if (selectedDate.day) {
      // 메모 저장 후 상세 정보 업데이트
      console.log("Saving memo:", memo);

      const formattedDate = `${selectedDate.year}-${String(selectedDate.month).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`;
      const response = await fetchCalendarDetail(formattedDate);
      if (response && response.data) {
        setDetail(response.data);
      }

      // 달력 데이터 업데이트
      const yearMonth = format(currentDate, "yyyy-MM");
      const calendarResponse = await fetchCalendar(yearMonth);
      if (calendarResponse?.code === "S0000" && calendarResponse.data) {
        setCalendarData(calendarResponse.data);
      }
    }
  };

  if (!selectedDate.day) {
    return (
      <div className="text-gray-500 text-center py-8">날짜를 선택해주세요</div>
    );
  }

  return (
    <div className="relative">
      <div className="relative top-0 flex">
        <button
          className={`px-8 py-3 ${
            activeTab === "htp"
              ? "bg-white rounded-t-[25px] border border-[#E6E6E6] border-b-0"
              : "bg-[#F9F9F9] rounded-t-[25px] border border-[#E6E6E6] cursor-pointer hover:bg-[#E6E6E6]"
          }`}
          onClick={() => setActiveTab("htp")}
        >
          HTP 검사
        </button>
        <button
          className={`px-8 py-3 ${
            activeTab === "memo"
              ? "bg-white rounded-t-[25px] border border-[#E6E6E6] border-b-0"
              : "bg-[#F9F9F9] rounded-t-[25px] border border-[#E6E6E6] cursor-pointer hover:bg-[#E6E6E6]"
          }`}
          onClick={() => setActiveTab("memo")}
        >
          메모
        </button>
      </div>

      <div className="border border-[#E6E6E6] bg-white -mt-[1px] rounded-b-[15px] rounded-r-[15px] h-[350px]">
        {activeTab === "htp" && (
          <div className="p-6 h-full overflow-y-auto">
            {detail?.isHtp ? (
              <>
                <h3 className="font-medium mb-6">
                  {selectedDate.year}년 {selectedDate.month}월{" "}
                  {selectedDate.day}일의 HTP 검사
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {detail.houseUrl && (
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">집</h4>
                      <img
                        src={detail.houseUrl}
                        alt="House"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  )}
                  {detail.treeUrl && (
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">나무</h4>
                      <img
                        src={detail.treeUrl}
                        alt="Tree"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  )}
                  {detail.personUrl && (
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">사람</h4>
                      <img
                        src={detail.personUrl}
                        alt="Person"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  )}
                </div>
                {detail.report && (
                  <div className="h-[300px] mb-1">
                    <h4 className="font-medium mb-2">검사 결과</h4>
                    <div className="h-full overflow-y-auto pb-10 pr-2">
                      <p className="whitespace-pre-line text-gray-600">
                        {detail.report}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500 text-center py-8">
                HTP 검사를 진행하지 않았습니다
              </div>
            )}
          </div>
        )}

        {activeTab === "memo" && (
          <div className="p-6 h-full overflow-y-auto">
            <MemoEditor
              initialMemo={detail?.memoContent || ""}
              memoId={detail?.memoId}
              selectedDate={
                selectedDate as { year: number; month: number; day: number }
              }
              onSave={handleMemoSave}
              onCancel={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailView;
