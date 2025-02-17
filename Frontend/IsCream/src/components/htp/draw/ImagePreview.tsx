import React from "react";

interface ImagePreviewProps {
  image: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image }) => {
  return <img src={image} alt="Captured" className="h-[220px] object-contain mb-4" />;
};

export default ImagePreview;
