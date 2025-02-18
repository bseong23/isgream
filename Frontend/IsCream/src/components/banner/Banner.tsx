import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ParentingAttitude from "../../assets/image/부모양육태도.png";
import Big5 from "../../assets/image/성격5요인검사.png";
import HTP from "../../assets/image/그림일기.png";

interface SlideType {
  image: string;
  to: string;
  isVertical?: boolean;
}

const Banner = () => {
  const originalSlides: SlideType[] = [
    { image: HTP, to: "/ai-analysis", isVertical: true },
    { image: ParentingAttitude, to: "/parenting-test", isVertical: true },
    { image: Big5, to: "/big5-test" }
  ];

  const slides = [
    originalSlides[originalSlides.length - 1],
    ...originalSlides,
    originalSlides[0]
  ];

  const [currentSlide, setCurrentSlide] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const moveToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsTransitioning(true);
  }, []);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentSlide === 0) {
      setCurrentSlide(slides.length - 2);
    } else if (currentSlide === slides.length - 1) {
      setCurrentSlide(1);
    }
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      moveToSlide(currentSlide + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, currentSlide, moveToSlide]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsPaused(true);
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      moveToSlide(currentSlide + 1);
    }
    if (isRightSwipe) {
      moveToSlide(currentSlide - 1);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const getSlideStyle = (index: number) => {
    const isActive = index === currentSlide;
    const diff = index - currentSlide;

    return {
      transformStyle: "preserve-3d" as const,
      transform: `
        scale(${isActive ? 1 : 0.85}) 
        translateX(${diff * 10}%) 
        translateZ(${isActive ? 0 : -100}px)
        rotateY(${diff * 5}deg)
      `,
      transition: isTransitioning ? "all 0.5s ease-out" : "none",
      opacity: isActive ? 1 : 0.8,
      zIndex: isActive ? 1 : 0
    };
  };

  return (
    <div className="w-full bg-white">
      <div className="max-w-screen-md mx-auto relative">
        <div
          className="w-full relative overflow-hidden rounded-lg sm:rounded-xl"
          style={{
            aspectRatio: "16/9",
            perspective: "1000px"
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="absolute inset-0 w-full h-full flex transform-gpu"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              transformStyle: "preserve-3d",
              transition: isTransitioning ? "transform 0.5s ease-out" : "none"
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTransitionEnd={handleTransitionEnd}
          >
            {slides.map((slide, index) => (
              <Link
                key={index}
                to={slide.to}
                className="min-w-full h-full relative bg-white flex items-center justify-center"
                style={getSlideStyle(index)}
              >
                <div className="relative w-auto h-full flex items-center justify-center">
                  <img
                    src={slide.image}
                    alt={`배너 이미지 ${index}`}
                    className={`h-full rounded-lg ${
                      slide.isVertical ? "max-w-[90%" : "w-full"
                    } object-contain`}
                    loading={index <= 1 ? "eager" : "lazy"}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 sm:space-x-3">
          {originalSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => moveToSlide(index + 1)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 
                ${
                  currentSlide === index + 1 ||
                  (currentSlide === slides.length - 1 && index === 0) ||
                  (currentSlide === 0 && index === originalSlides.length - 1)
                    ? "bg-blue-500 scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
