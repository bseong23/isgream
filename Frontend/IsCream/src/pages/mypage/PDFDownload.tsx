import TestSelector from "../../components/pdf/TestSelector";
import DateSelector from "../../components/pdf/DateSelector";
import TestList from "../../components/pdf/TestList";
import { DateRange, TestType, TestResult } from "../../components/pdf/types";
import { useState, useEffect } from "react";
// import { patApi } from "../../api/pat";
// import { bigFiveApi } from "../../api/bigFive";

const PDFDownload = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "2025-01-20",
    endDate: "2025-02-13"
  });

  const [selectedTests, setSelectedTests] = useState<TestType[]>([
    { id: "HTP", name: "AI 그림검사", isSelected: true },
    { id: "PAT", name: "부모양육태도 검사", isSelected: false },
    { id: "BFI", name: "성격 5요인 검사", isSelected: false }
  ]);

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTestResults = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const activeTests = selectedTests.filter((test) => test.isSelected);
      console.log("선택된 테스트:", activeTests);

      if (activeTests.length === 0) {
        setTestResults([]);
        return;
      }

      const results = await Promise.all(
        activeTests.map(async (test) => {
          let response;
          console.log("API 호출 시작:", test.id);

          // switch(test.id) {
          //     case 'PAT':
          //         response = await patApi.getResultList(
          //             dateRange.startDate,
          //             dateRange.endDate
          //         );
          //         break;
          //     case 'BFI':
          //         response = await bigFiveApi.getResultList(
          //             dateRange.startDate,
          //             dateRange.endDate
          //         );
          //         break;
          //     case 'HTP':
          //         // HTP API 호출 추가 필요
          //         break;
          // }
          return response?.data;
        })
      );

      console.log("API 응답:", results);

      const formattedResults = results
        .flat()
        .filter(Boolean)
        .map((result) => ({
          id: result.id,
          testType: result.testType,
          date: result.date,
          status: result.status
        }));

      setTestResults(formattedResults);
    } catch (err) {
      console.error("Error fetching test results:", err);
      setError("검사 결과를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(
    () => {
      fetchTestResults();
    } /* [dateRange.startDate, dateRange.endDate]*/
  ); // selectedTests는 제거하고 날짜만 watching

  const handleDateChange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

  const handleTestSelector = (testId: string) => {
    setSelectedTests((prev) => {
      const updated = prev.map((test) =>
        test.id === testId ? { ...test, isSelected: !test.isSelected } : test
      );
      return updated;
    });
    fetchTestResults(); // 테스트 선택 변경 시 직접 호출
  };

  const handleResultSelect = (resultId: string) => {
    console.log("Selected result:", resultId);
    // 여기에 상세 페이지로 이동하는 로직 추가
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[95%] max-w-[706px]">
        <div>
          <DateSelector dateRange={dateRange} onDateChange={handleDateChange} />
        </div>
        <div>
          <TestSelector
            selectedTests={selectedTests}
            onTestSelector={handleTestSelector}
          />
        </div>
        {isLoading ? (
          <div>로딩 중...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <TestList
            testResults={testResults}
            onResultSelect={handleResultSelect}
          />
        )}
      </div>
    </div>
  );
};
export default PDFDownload;
