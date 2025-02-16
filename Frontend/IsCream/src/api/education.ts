import { api } from "../utils/common/axiosInstance";
import type {
  Education,
  EducationRecommendRequest,
  ApiResponse
} from "@/types/education";

export const educationKeys = {
  all: ["education"] as const,
  recommendations: () => [...educationKeys.all, "recommendations"] as const,
  recommendation: (childId: number, recommend: boolean) =>
    [...educationKeys.recommendations(), childId, recommend] as const
};

export const educationApi = {
  getEducationRecommendations: (data: EducationRecommendRequest) =>
    api.post<ApiResponse<Education[]>>("/educations", {
      recommend: data.recommend,
      childId: data.childId
    })
};
