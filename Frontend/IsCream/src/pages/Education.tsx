// pages/education/index.tsx
import EducationList from "../components/education/EducationList";
import EducationFilter from "../components/education/EducationFilter";
import { useState } from "react";

const EducationPage = () => {
  const [isRecommended, setIsRecommended] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      {/* 필터 */}
      <div className="mt-4">
        <EducationFilter
          isRecommended={isRecommended}
          onToggle={setIsRecommended}
        />
      </div>

      {/* 교육 목록 */}
      <div className="px-4 pb-20">
        <EducationList isRecommended={isRecommended} />
      </div>
    </div>
  );
};

export default EducationPage;
