import { TestType } from "./types";
// import { useState } from 'react';

interface TestSelectorProps {
  selectedTests: TestType[];
  onTestSelector: (testId: string) => void;
}

const TestSelector: React.FC<TestSelectorProps> = ({
  selectedTests,
  onTestSelector
}) => {
  return (
    <div className="w-full flex flex-wrap gap-2">
      <button
        onClick={() => onTestSelector("HTP")}
        className={`px-3 py-2 rounded-full border border-[#009E28] text-xs 
                    ${
                      selectedTests.find((test) => test.id === "HTP")
                        ?.isSelected
                        ? "bg-[#009E28] text-white"
                        : "bg-white text-[#009E28]"
                    }`}
      >
        AI 그림검사(HTP)
      </button>

      <button
        onClick={() => onTestSelector("PAT")}
        className={`px-3 py-2 rounded-full border border-[#009E28] text-xs 
                    ${
                      selectedTests.find((test) => test.id === "PAT")
                        ?.isSelected
                        ? "bg-[#009E28] text-white"
                        : "bg-white text-[#009E28]"
                    }`}
      >
        부모양육태도 검사(PAT)
      </button>

      <button
        onClick={() => onTestSelector("BFI")}
        className={`px-3 py-2 rounded-full border border-[#009E28] text-xs 
                    ${
                      selectedTests.find((test) => test.id === "BFI")
                        ?.isSelected
                        ? "bg-[#009E28] text-white"
                        : "bg-white text-[#009E28]"
                    }`}
      >
        성격 5요인 검사(BFI)
      </button>
    </div>
  );
};

export default TestSelector;
