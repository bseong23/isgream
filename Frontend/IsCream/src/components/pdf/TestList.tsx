import { TestResult } from "./types";
import { Download } from "lucide-react";
import { useState } from "react";
import { pdfApi } from "../../api/pdf";

// 스타일 추가
const checkboxStyle = {
  accentColor: "#009E28",
  cursor: "pointer",
  borderColor: "#009E28"
};

interface TestListProps {
  testResults: TestResult[];
  onResultSelect: (resultId: string) => void;
  nickname?: string;
}

const TestList: React.FC<TestListProps> = ({
  testResults,
  /*onResultSelect,*/ nickname
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()} - ${String(date.getMonth() + 1).padStart(2, "0")} - ${String(date.getDate()).padStart(2, "0")} (${["일", "월", "화", "수", "목", "금", "토"][date.getDay()]})`;
  };

  const handleSelectAll = () => {
    if (selectedItems.length === testResults.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(testResults.map((result) => result.testId.toString()));
    }
  };

  const handleSelectItem = (testId: number) => {
    // 매개변수 타입을 number로 변경
    const testIdStr = testId.toString();
    setSelectedItems((prev) =>
      prev.includes(testIdStr)
        ? prev.filter((item) => item !== testIdStr)
        : [...prev, testIdStr]
    );
  };

  const getFileName = (
    type: string,
    childName: string | undefined,
    nickname: string | undefined,
    date: string
  ) => {
    const name = childName?.trim() || nickname || "미상";
    return `${type}_결과_${name}_${date}.pdf`;
  };

  const downloadPDF = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadPDFs = async () => {
    try {
      const downloadPromises = selectedItems.map(async (testIdStr) => {
        const testId = parseInt(testIdStr);
        const test = testResults.find((r) => r.testId === testId);

        if (!test) return;

        let pdfBlob;
        const fileName = getFileName(
          test.type,
          test.childName,
          nickname,
          test.date
        );

        switch (test.type) {
          case "HTP":
            pdfBlob = await pdfApi.pdfHTP(testId);
            downloadPDF(pdfBlob, fileName);
            break;
          case "PAT":
            pdfBlob = await pdfApi.pdfPat(testId);
            downloadPDF(pdfBlob, fileName);
            break;
          case "BFI":
            pdfBlob = await pdfApi.pdfBigFive(testId);
            downloadPDF(pdfBlob, fileName);
            break;
        }
      });

      await Promise.all(downloadPromises);
    } catch (error) {
      console.error("PDF 다운로드 실패:", error);
    }
  };

  const handleSingleDownload = async (
    testId: number,
    type: string,
    childName: string | undefined,
    date: string
  ) => {
    try {
      let pdfBlob;
      const fileName = getFileName(type, childName, nickname, date);

      switch (type) {
        case "HTP":
          pdfBlob = await pdfApi.pdfHTP(testId);
          downloadPDF(pdfBlob, fileName);
          break;
        case "PAT":
          pdfBlob = await pdfApi.pdfPat(testId);
          downloadPDF(pdfBlob, fileName);
          break;
        case "BFI":
          pdfBlob = await pdfApi.pdfBigFive(testId);
          downloadPDF(pdfBlob, fileName);
          break;
      }
    } catch (error) {
      console.error("PDF 다운로드 실패:", error);
  }
};

  return (
    <div className="my-5">
      {/* 전체 선택 헤더 */}
      <div className="flex items-center p-4 border-b border-gray-200 justify-between">
        <input
          type="checkbox"
          checked={selectedItems.length === testResults.length}
          onChange={handleSelectAll}
          style={checkboxStyle}
          className="w-4 h-4 border-gray-300 rounded mr-4"
        />
        <div className="font-medium text-gray-900 flex-1 cursor-pointer">
          전체선택
        </div>
        <button
          onClick={handleDownloadPDFs}
          disabled={selectedItems.length === 0}
          className={`text-gray-400 hover:text-[#009E28] active:text-[#009E28] transition-colors"${
            selectedItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* 검사 결과 목록 */}
      {testResults.map((result) => (
        <div
          key={result.testId}
          className="flex items-center p-4 border-b border-gray-200"
        >
          <input
            type="checkbox"
            checked={selectedItems.includes(result.testId.toString())} // testId 사용
            onChange={() => handleSelectItem(result.testId)} // testId 전달
            style={checkboxStyle}
            className="w-4 h-4 border-gray-300 rounded mr-4"
          />
          <div
            className="flex-1 cursor-pointer"
            onClick={() =>
              handleSingleDownload(
                result.testId,
                result.type,
                result.childName || nickname,
                result.date
              )
            }
          >
            <div className="font-medium text-gray-900">{result.title}</div>
            <div className="gap-2 items-center mt-2">
              <div className="text-sm text-gray-600">
                {formatDate(result.date)}
              </div>
              <div className="text-sm text-gray-500">
                검사자 :{" "}
                {result.childName?.trim() ? result.childName : nickname}
              </div>
            </div>
          </div>
          <button
            onClick={() =>
              handleSingleDownload(
                result.testId,
                result.type,
                result.childName || nickname,
                result.date
              )
            }
            className="text-gray-400 hover:text-[#009E28] active:text-[#009E28] transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ))}

      {testResults.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          검사 결과가 없습니다.
        </div>
      )}
    </div>
  );
};

export default TestList;
