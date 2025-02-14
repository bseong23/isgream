import { useState, useRef, useEffect } from "react";

interface ImageUploadProps {
  maxImages?: number;
  onImagesChange?: (images: File[]) => void;
  initialImages?: string[];
  onExistingImageDelete?: (imageUrl: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  maxImages = 10,
  onImagesChange,
  initialImages = [],
  onExistingImageDelete
}) => {
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialImages);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  useEffect(() => {
    setExistingImages(initialImages);
  }, [initialImages]);

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                reject(new Error("Image compression failed"));
              }
            },
            "image/jpeg",
            0.7
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImageCount = existingImages.length + newImages.length;

    if (files.length + totalImageCount > maxImages) {
      alert(`최대 ${maxImages}장까지 업로드 가능합니다.`);
      return;
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`파일 크기는 5MB를 초과할 수 없습니다: ${file.name}`);
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert(`이미지 파일만 업로드 가능합니다: ${file.name}`);
        return;
      }
    }

    try {
      const compressedFiles = await Promise.all(
        files.map((file) => compressImage(file))
      );

      const updatedNewImages = [...newImages, ...compressedFiles];
      setNewImages(updatedNewImages);
      if (onImagesChange) {
        onImagesChange(updatedNewImages);
      }
    } catch (error) {
      alert("이미지 처리 중 오류가 발생했습니다.");
      console.error("Image compression error:", error);
    }
  };

  const handleDeleteExistingImage = (index: number) => {
    const imageUrl = existingImages[index];
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    if (onExistingImageDelete) {
      onExistingImageDelete(imageUrl);
    }
  };

  const handleDeleteNewImage = (index: number) => {
    setNewImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (onImagesChange) {
        onImagesChange(updated);
      }
      return updated;
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {existingImages.length + newImages.length < maxImages && (
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={handleUploadClick}
                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100"
              >
                <div className="text-gray-400">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </button>
            </div>
          )}

          {existingImages.map((url, index) => (
            <div
              key={`existing-${url}`}
              className="relative flex-shrink-0 w-24 h-24"
            >
              <img
                src={url}
                alt={`기존 이미지 ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleDeleteExistingImage(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}

          {newImages.map((file, index) => (
            <div
              key={`new-${index}`}
              className="relative flex-shrink-0 w-24 h-24"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`새 이미지 ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleDeleteNewImage(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 text-right text-sm text-gray-500">
        {existingImages.length + newImages.length} / {maxImages} 장
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default ImageUpload;
