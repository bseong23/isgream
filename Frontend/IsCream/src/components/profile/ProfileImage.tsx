import { useRef, useState, forwardRef } from "react";
import defaultImg from '../../assets/image/character2.png';

interface ProfileImageProps{
  initialProfileImage?: string;
  onImageUpload?: (file: File) => void;
}

const ProfileImage = forwardRef<{ uploadImage: () => Promise<File | null> }, ProfileImageProps>(({
  initialProfileImage = defaultImg,
  onImageUpload
}, ref) => {
  
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(initialProfileImage);
  const [file, setFile] = useState<File | undefined>(undefined);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

  const handleUploadButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];

      if(selectedFile.size > MAX_FILE_SIZE) {
        alert('파일 사이즈는 5MB를 넘을 수 없습니다.');
        return;
      }

      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        alert('JPG, PNG, GIF 형식의 이미지만 업로드 가능합니다.');
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      onImageUpload?.(selectedFile);
    }
  };

  const uploadImage = async () => {
    return file || null;
  };

  // ref로 uploadImage 메서드 노출
  if (ref) {
    (ref as any).current = { uploadImage };
  }
  
  return (
    <div className="w-11/12 flex justify-center mb-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
          <img
            src={preview}
            className="w-full h-full object-cover"
          />
        </div>

        <button
          className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-gray-300 shadow-sm hover:bg-gray-50"
          onClick={handleUploadButtonClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/gif"
          className="hidden"
        />
      </div>
    </div>
  );
});

ProfileImage.displayName = 'ProfileImage';

export default ProfileImage;