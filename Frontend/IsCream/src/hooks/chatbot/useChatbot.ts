import { useState } from "react";
import { chatbot } from "../../api/chatbot";
import { ChatMessage } from "../../types/chatbot";

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "bot-init",
      content: "아이 상담에 관한 내용을 말해주세요!",
      sender: "bot"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendQuery = async () => {
    if (!query.trim()) return;

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: query,
      sender: "user"
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const result = await chatbot.sendQuery(query);

      // 봇 메시지 추가
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        content: result.data,
        sender: "bot"
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "챗봇 서비스 연결 중 오류가 발생했습니다.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setQuery("");
    }
  };

  const toggleChatbot = () => {
    setIsOpen((prev) => {
      if (!prev && messages.length === 0) {
        setMessages([
          {
            id: "bot-init",
            content: "아이 상담에 관한 내용을 말해주세요!",
            sender: "bot"
          }
        ]);
      }
      return !prev;
    });
  };

  return {
    isOpen,
    query,
    messages,
    isLoading,
    error,
    setQuery,
    sendQuery,
    toggleChatbot
  };
};
