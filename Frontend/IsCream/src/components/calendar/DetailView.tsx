import React, { useState, useEffect } from "react";
import { CalendarDetailResponse } from "../../types/calendar";
import { useCalendar } from "../../hooks/calendar/useCalendar";
import MemoEditor from "./MemoEditor";
import { format } from "date-fns";
import type { DayInfo } from "@/types/calendar";
import { CalendarResponse } from "../../types/calendar";
import HTPSlider from "./HtpSlider";

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
  const [processedReport, setProcessedReport] = useState<string[][]>([]);

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

  useEffect(() => {
    if (detail?.report) {
      // \n 문자열을 실제 개행으로 변환
      const processedText = detail.report
        .replace(/\\n/g, "\n")
        .replace(/^"|"$/g, ""); // 시작과 끝의 따옴표 제거

      // 섹션 분리
      const sections = processedText.split("----").map((section) =>
        section
          .trim()
          .split("\n")
          .filter((line) => line.length > 0)
      );

      setProcessedReport(sections);
    }
  }, [detail?.report]);

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
    <div className="">
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

      <div className="border border-[#E6E6E6] bg-white -mt-[1px] rounded-b-[15px] rounded-r-[15px]">
        {activeTab === "htp" && (
          <div className="p-6">
            {detail?.isHtp ? (
              <>
                {detail.report &&
                detail.houseUrl &&
                detail.treeUrl &&
                detail.maleUrl &&
                detail.femaleUrl ? (
                  <HTPSlider
                    houseUrl={detail.houseUrl}
                    treeUrl={detail.treeUrl}
                    maleUrl={detail.maleUrl}
                    femaleUrl={detail.femaleUrl}
                    processedReport={processedReport}
                    date={
                      selectedDate as {
                        year: number;
                        month: number;
                        day: number;
                      }
                    }
                  />
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    아직 검사를 모두 진행하지 않으셨습니다!
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
          <div className="p-6 overflow-y-auto">
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
