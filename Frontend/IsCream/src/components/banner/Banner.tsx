import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Banner1 from "../../assets/image/banner1.png";
import Banner2 from "../../assets/image/banner2.png";
import Banner3 from "../../assets/image/banner3.png";
// import Banner4 from "../../assets/image/banner4.png";
import Banner5 from "../../assets/image/banner5.png";

interface BannerProps {
  requireChild?: boolean;
  haveChild?: boolean;
}

interface SlideType {
  image: string;
  to: string;
  isVertical?: boolean;
}

const Banner: React.FC<BannerProps> = ({ requireChild = true, haveChild = false }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent, to: string) => {
    // AI 분석이나 양육태도, Big5 검사는 자녀가 필요한 서비스
    const requiresChild = ['/ai-analysis', '/big5-test'].includes(to);
    
    if (requiresChild && requireChild && !haveChild) {
      e.preventDefault();
      alert("자녀 등록 후 이용 가능한 서비스입니다.");
      navigate("/mypage");
      return;
    }
  };

  const originalSlides: SlideType[] = [
    { image: Banner1, to: "/ai-analysis", isVertical: true },
    { image: Banner2, to: "/ai-analysis", isVertical: true },
    // { image: Banner4, to: "/parenting-test" },
    { image: Banner3, to: "/big5-test" },
    { image: Banner5, to: "/pat" }
  ];

  const slides = [
    originalSlides[originalSlides.length - 1],
    ...originalSlides,
    originalSlides[0]
  ];

  const [currentSlide, setCurrentSlide] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const moveToSlide = useCallback(
    (index: number) => {
      // 애니메이션 중 추가 슬라이드 이동 방지
      if (isTransitioning) return;

      setCurrentSlide(index);
      setIsTransitioning(true);
    },
    [isTransitioning]
  );

  const handleTransitionEnd = () => {
    setIsTransitioning(false);

    // 첫 번째 가짜 슬라이드일 때 (맨 마지막 실제 슬라이드로 이동)
    if (currentSlide === 0) {
      // 트랜지션 없이 즉시 마지막 실제 슬라이드로 이동
      setCurrentSlide(slides.length - 2);
    }
    // 마지막 가짜 슬라이드일 때 (맨 첫 번째 실제 슬라이드로 이동)
    else if (currentSlide === slides.length - 1) {
      // 트랜지션 없이 즉시 첫 번째 실제 슬라이드로 이동
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
    <div className="max-w-[706px] mx-auto pt-2 bg-white">
      <div className="max-w-screen-md mx-auto relative">
        <div
          className="w-full relative overflow-hidden rounded-[15px]"
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
                onClick={(e) => handleClick(e, slide.to)}
              >
                <div className="relative w-auto h-full flex items-center justify-center">
                  <img
                    src={slide.image}
                    alt={`배너 이미지 ${index}`}
                    className={`h-full rounded-[15px] ${
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
