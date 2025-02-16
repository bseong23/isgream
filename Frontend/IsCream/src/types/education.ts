export interface Education {
  imageUrl: string;
  title: string;
  videoUrl: string;
  description: string;
}

export interface EducationRecommendRequest {
  recommend: boolean;
  childId: number;
}

export interface ApiResponse<T = void> {
  code: "S0000" | "E4001";
  message: string;
  data?: T;
}
