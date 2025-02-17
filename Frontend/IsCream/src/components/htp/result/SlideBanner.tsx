import React from "react";

interface SlideBannerProps {
  images: string[];
}

const SlideBanner: React.FC<SlideBannerProps> = ({ images }) => {
  return (
    <div className="slide-banner">
      {images.map((image, index) => (
        <div key={index} className="slide">
          <img src={image} alt={`Slide ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default SlideBanner;
