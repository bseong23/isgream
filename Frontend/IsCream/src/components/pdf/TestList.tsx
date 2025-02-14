import { TestResult } from "./types";
// import { FileText } from 'lucide-react';
import { Download } from "lucide-react";
import { useState } from "react";

// 스타일 추가
const checkboxStyle = {
  accentColor: "#009E28",
  cursor: "pointer",
  borderColor: "#009E28"
};

interface TestListProps {
  testResults: TestResult[];
  onResultSelect: (resultId: string) => void;
}

const TestList: React.FC<TestListProps> = ({ testResults, onResultSelect }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()} - ${String(date.getMonth() + 1).padStart(2, "0")} - ${String(date.getDate()).padStart(2, "0")} (${["일", "월", "화", "수", "목", "금", "토"][date.getDay()]})`;
  };

  const handleSelectAll = () => {
    if (selectedItems.length === testResults.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(testResults.map((result) => result.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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
        <button className="text-gray-400 hover:text-[#009E28] active:text-[#009E28] transition-colors">
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* 검사 결과 목록 */}
      {testResults.map((result) => (
        <div
          key={result.id}
          className="flex items-center p-4 border-b border-gray-200"
        >
          <input
            type="checkbox"
            checked={selectedItems.includes(result.id)}
            onChange={() => handleSelectItem(result.id)}
            style={checkboxStyle}
            className="w-4 h-4 border-gray-300 rounded mr-4"
          />
          <div
            className="flex-1 cursor-pointer"
            onClick={() => onResultSelect(result.id)}
          >
            <div className="font-medium text-gray-900">
              {formatDate(result.date)}
            </div>
            <div className="gap-2 items-center mt-2">
              <div className="text-sm text-gray-600">{result.testType}</div>
              <div className="text-sm text-gray-500">
                대상 - {result.status}
              </div>
            </div>
          </div>
          <button
            onClick={() => onResultSelect(result.id)}
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
