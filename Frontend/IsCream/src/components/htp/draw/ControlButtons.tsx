import React from "react";

interface ControlButtonsProps {
  onCapture: () => void;
  onSave: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ onCapture, onSave }) => {
  return (
    <div className="flex gap-3 mt-4">
      <button onClick={onCapture} className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg shadow-md">
        촬영하기
      </button>
      <button onClick={onSave} className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg shadow-md">
        저장하기
      </button>
    </div>
  );
};

export default ControlButtons;
