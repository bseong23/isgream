// src/types/bigFive.ts
export interface BigFiveQuestion {
  question: string;
  questionType: string; // ENUM 타입
}

export interface BigFiveQuestionsResponse {
  code: "S0000" | "E4002";
  message: string;
  data: BigFiveQuestion[]; // 배열로 직접 정의
}

export interface BigFiveTestResultRequest {
  childId: number;
  conscientiousness: number;
  agreeableness: number;
  emotionalStability: number;
  extraversion: number;
  openness: number;
}

export interface BigFiveTestResultResponse {
  code: "S0000" | "E4001";
  message: string;
  data: {
    testDate: string;
    conscientiousness: number; // double (평균과의 편차)
    agreeableness: number; // double (평균과의 편차)
    emotionalStability: number; // double (평균과의 편차)
    extraversion: number; // double (평균과의 편차)
    openness: number; // double (평균과의 편차)
    analysis: string;
  };
}

export interface BigFiveRecentResultResponse {
  code: "S0000" | "E4001";
  message: string;
  data: {
    testDate: string;
    conscientiousness: number; // double (평균과의 편차)
    agreeableness: number; // double (평균과의 편차)
    emotionalStability: number; // double (평균과의 편차)
    extraversion: number; // double (평균과의 편차)
    openness: number; // double (평균과의 편차)
    analysis: string; // 참고: 'analysys' 오타 수정
  };
}

export interface GetTestListResponse {
  code: "S0000" | "E4001";
  message: string;
  data: {
    date: string;
    id: string;
    status: string;
    testType: string;
  }[];
}
