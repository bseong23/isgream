import React from "react";

interface GenderSelectionModalProps {
  onSelectGender: (gender: "male" | "female") => void;
  onClose: () => void;
}

const GenderSelectionModal: React.FC<GenderSelectionModalProps> = ({
  onSelectGender,
  onClose
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-white/30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 flex flex-col items-center">
        <h2 className="text-lg font-bold mb-4">성별을 선택하세요</h2>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => onSelectGender("male")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            남성
          </button>
          <button
            onClick={() => onSelectGender("female")}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600"
          >
            여성
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-gray-600 text-sm hover:underline"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default GenderSelectionModal;
