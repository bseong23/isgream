import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideData {
  type: string;
  imageUrl: string;
  report: string[];
}

interface HTPSliderProps {
  slides: SlideData[];
  date: {
    year: number;
    month: number;
    day: number;
  };
}

const HTPSlider: React.FC<HTPSliderProps> = ({ slides, date }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative h-full">
      <h3 className="font-medium mb-6">
        {date.year}년 {date.month}월 {date.day}일의 HTP 검사
      </h3>

      <div className="relative h-[calc(100%-4rem)]">
        {/* Navigation Dots */}
        <div className="absolute top-0 left-0 right-0 flex justify-center gap-2 mb-4 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index ? "bg-blue-500 w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div className="h-full overflow-y-auto px-8 pt-6">
          <div className="flex flex-col items-center">
            <img
              src={slides[currentSlide].imageUrl}
              alt={slides[currentSlide].type}
              className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mx-auto mb-6 border border-[#BEBEBE] rounded-lg"
            />
            <div className="w-full">
              {slides[currentSlide].report.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-gray-600 mb-2 text-2xl whitespace-pre-line"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-2 top-1/3 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNextSlide}
          className="absolute right-2 top-1/3 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default HTPSlider;
