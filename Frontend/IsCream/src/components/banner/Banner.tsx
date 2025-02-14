import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HTPimage from "../../assets/image/HTP검사.png";
import ParentingAttitude from "../../assets/image/육아양육태도검사.png";
import Big5 from "../../assets/image/성격5요인검사.png";

//123123
const Banner = () => {
  const slides = [
    { image: HTPimage, to: "/ai-analysis" },
    { image: ParentingAttitude, to: "/parenting-test" },
    { image: Big5, to: "/big5-test" }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return; // 일시 정지 상태면 타이머를 설정하지 않음

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]); // isPaused 의존성 추가

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsPaused(true); // 터치 시작시 일시 정지
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false); // 터치 종료시 재생 재개
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe) {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-[706px] relative">
        <div
          className="w-full relative overflow-hidden"
          style={{ aspectRatio: "706/363" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out flex"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {slides.map((slide, index) => (
              <Link
                key={index}
                to={slide.to}
                className="min-w-full h-full relative bg-white flex items-center justify-center"
              >
                <img
                  src={slide.image}
                  alt="배너 이미지"
                  className="w-full h-full object-cover rounded-[15px]"
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-2 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors 
                ${currentSlide === index ? "bg-black" : "bg-gray-300"}`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
