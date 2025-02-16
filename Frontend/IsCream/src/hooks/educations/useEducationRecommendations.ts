// hooks/education/useEducationRecommendations.ts
import { useQuery } from "@tanstack/react-query";
import { educationApi, educationKeys } from "../../api/education";
import type { EducationRecommendRequest } from "../../types/education";

export const useEducationRecommendations = (
  params: EducationRecommendRequest
) => {
  return useQuery({
    queryKey: educationKeys.recommendation(params.childId, params.recommend),
    queryFn: () => educationApi.getEducationRecommendations(params),
    enabled: !!params.childId
  });
};
