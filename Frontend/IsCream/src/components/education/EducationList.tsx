import { useSelector } from "react-redux";
import { RootState } from "@/store";
import type { Education } from "@/types/education";
import type { FC } from "react";
import EducationCard from "./EducationCard";
import { useEducationRecommendations } from "../../hooks/educations/useEducationRecommendations";

interface EducationListProps {
  isRecommended: boolean;
  onFilterChange?: (isRecommended: boolean) => void;
}

const EducationList: FC<EducationListProps> = ({
  isRecommended = false // 기본값을 false로 설정
  // onFilterChange
}) => {
  const selectedChild = useSelector(
    (state: RootState) => state.child.selectedChild
  );

  const { data: educationData, isLoading } = useEducationRecommendations({
    recommend: isRecommended,
    childId: selectedChild?.childId ? Number(selectedChild.childId) : 0
  });

  const handleVideoClick = (videoUrl: string): void => {
    window.open(videoUrl, "_blank");
  };

  if (!selectedChild) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <p>선택된 아이가 없습니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <p>로딩 중...</p>
      </div>
    );
  }

  const educations = educationData?.data?.data ?? [];
  // const childName = selectedChild.nickname; // 아이 이름 가져오기

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        {educations.map((education: Education, index: number) => (
          <EducationCard
            key={index}
            {...education}
            onVideoClick={handleVideoClick}
          />
        ))}
      </div>
    </div>
  );
};

export default EducationList;
