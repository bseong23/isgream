import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  className,
  placeholder = "장소를 검색하세요"
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative h-[75px] mx-auto ${className}`}
    >
      <div className="relative w-full h-full flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full h-[45px] pl-4 pr-12 rounded-lg border border-gray-200 focus:outline-none text-gray-700"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-gray-500"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path
              d="M21 21L16.65 16.65"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
