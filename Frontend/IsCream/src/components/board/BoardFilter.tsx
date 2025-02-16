import React from "react";

interface BoardFilterProps {
  text: string;
  active: boolean;
  onClick: () => void;
}

const BoardFilter: React.FC<BoardFilterProps> = ({ text, active, onClick }) => (
  <button
    className={`px-2 py-1 text-sm ${
      active ? "text-black-bold" : "text-gray-400"
    }`}
    onClick={onClick}
  >
    {text}
  </button>
);

export default BoardFilter;
