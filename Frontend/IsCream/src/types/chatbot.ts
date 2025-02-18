export interface ChatbotRequest {
  question: string;
}

export interface ChatbotResponse {
  code: "S0000" | "E4001";
  message: string;
  data: string; // 데이터가 문자열로 오고 있음
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
}
