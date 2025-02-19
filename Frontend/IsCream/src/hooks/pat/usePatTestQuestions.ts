import { useEffect, useState } from "react";
import { api } from "../../utils/common/axiosInstance";
import { PatTestQuestionList } from "../../types/patTest";

const usePatTestQuestions = () => {
  const [questions, setQuestions] = useState<PatTestQuestionList>({ data: [] }); // ✅ 빈 객체 `{ data: [] }` 설정
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔍 usePatTestQuestions Hook Loaded");

    const fetchQuestions = async () => {
      try {
        console.log("🚀 Fetching questions...");

        const response = await api.get("/pat-tests/questions"); // ✅ axiosInstance 사용

        console.log("📡 Response status:", response.status);
        setQuestions(response.data);
      } catch (err) {
        console.error("❌ Error fetching questions:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
        console.log("🎯 Fetching complete.");
      }
    };

    fetchQuestions();
  }, []);

  return { questions, loading, error };
};

export default usePatTestQuestions;
