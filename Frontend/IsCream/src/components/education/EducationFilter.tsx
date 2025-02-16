import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface EducationFilterProps {
  isRecommended: boolean;
  onToggle: (value: boolean) => void;
}

const EducationFilter = ({ isRecommended, onToggle }: EducationFilterProps) => {
  const selectedChild = useSelector(
    (state: RootState) => state.child.selectedChild
  );

  return (
    <div className="max-w-2xl mx-auto mb-6 px-4">
      <label className="inline-flex items-center cursor-pointer gap-3">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            checked={isRecommended}
            onChange={(e) => onToggle(e.target.checked)}
            className="appearance-none w-7 h-7 border-2 border-green-700 rounded-full bg-white transition-colors cursor-pointer"
          />
          {isRecommended && (
            <svg
              className="absolute w-5 h-5 pointer-events-none"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="#15803d" // text-green-700 색상
                strokeWidth="2" // 선 두께 증가
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span className="ml-2 text-2xl">
          <span className="text-green-700">
            {selectedChild?.nickname || "우리 아이"}
          </span>
          에게 추천하는 영상만 보기
        </span>
      </label>
    </div>
  );
};

export default EducationFilter;
