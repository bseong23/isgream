export interface PatTestQuestion {
  id: number;
  question: string;
  answer1: string;
  answer2: string;
  answer3: string;
}

// ✅ API 응답 구조에 맞게 `data` 속성 추가
export interface PatTestQuestionList {
  data: PatTestQuestion[]; // `data` 속성이 배열을 포함하도록 설정
}
