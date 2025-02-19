import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideData {
  type: string;
  imageUrl: string;
  report: string[];
}

interface HTPSliderProps {
  houseUrl?: string;
  treeUrl?: string;
  maleUrl?: string;
  femaleUrl?: string;
  processedReport: string[][];
  date: {
    year: number;
    month: number;
    day: number;
  };
}

const typeToKorean = {
  House: "집",
  Tree: "나무",
  Male: "남자",
  Female: "여자"
} as const;

const HTPSlider: React.FC<HTPSliderProps> = ({
  houseUrl,
  treeUrl,
  maleUrl,
  femaleUrl,
  processedReport,
  date
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 데이터 가공
  const slides: SlideData[] = processedReport.reduce(
    (acc: SlideData[], section) => {
      const typeInfo = section.find((line) => line.includes("검사 유형:"));
      const type = typeInfo?.split(":")?.[1]?.trim();

      let imageUrl = "";
      if (type === "House" && houseUrl) imageUrl = houseUrl;
      if (type === "Tree" && treeUrl) imageUrl = treeUrl;
      if (type === "Male" && maleUrl) imageUrl = maleUrl;
      if (type === "Female" && femaleUrl) imageUrl = femaleUrl;

      if (type && imageUrl) {
        acc.push({
          type,
          imageUrl,
          report: section.filter((line) => !line.includes("검사 유형:"))
        });
      }
      return acc;
    },
    []
  );

  if (slides.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        표시할 데이터가 없습니다.
      </div>
    );
  }

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative h-full">
      <h3 className="font-medium mb-6 text-lg md:text-xl px-4 md:px-0">
        {date.year}년 {date.month}월 {date.day}일의 HTP 검사
      </h3>

      <div className="relative h-[calc(100%-4rem)]">
        <div className="h-full overflow-y-auto px-4 md:px-8 pt-12">
          <div className="flex flex-col items-center">
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 md:px-8 mb-4 z-10">
              <button
                onClick={goToPrevSlide}
                className="bg-white hover:bg-gray-100 rounded-full p-1 md:p-2 transition-all shadow-md"
              >
                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
              </button>

              <div className="mb-4 text-lg font-medium">
                {
                  typeToKorean[
                    slides[currentSlide].type as keyof typeof typeToKorean
                  ]
                }{" "}
                그림
              </div>
              <button
                onClick={goToNextSlide}
                className="bg-white hover:bg-gray-100 rounded-full p-1 md:p-2 transition-all shadow-md"
              >
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
              </button>
            </div>
            <img
              src={slides[currentSlide].imageUrl}
              alt={`${
                typeToKorean[
                  slides[currentSlide].type as keyof typeof typeToKorean
                ]
              } 그림`}
              className="w-full sm:w-4/5 md:w-3/5 lg:w-1/2 mx-auto mb-6 border border-[#BEBEBE] rounded-lg"
            />

            <div className="w-full">
              {slides[currentSlide].report.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-gray-600 mb-2 text-base md:text-lg lg:text-2xl whitespace-pre-line"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HTPSlider;
