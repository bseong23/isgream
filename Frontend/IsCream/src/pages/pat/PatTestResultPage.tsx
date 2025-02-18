import React from "react";
import { useNavigate } from "react-router-dom";
import usePatTestResult from "../../hooks/pat/usePatTestResult";
import BarChart from "../../components/chart/BarChart"; // ✅ BarChart 컴포넌트 추가

const PatTestResultPage: React.FC = () => {
  const { result, loading, error } = usePatTestResult();
  const navigate = useNavigate();

  if (loading) return <p className="text-center text-lg font-semibold">⏳ 검사 결과를 불러오는 중...</p>;
  if (error) return <p className="text-center text-red-500 font-semibold">❌ 오류 발생: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">📊 검사 결과</h1>

      {result ? (
        <div className="p-4 border rounded-lg bg-gray-100">
          <h2 className="text-xl font-bold text-center mb-2">당신의 부모 유형: {result.type}</h2>
          <p className="text-center text-gray-600">{result.description}</p>

          {/* ✅ BarChart 추가 */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-center mb-4">📊 유형별 점수</h3>
            <BarChart data={[result.scoreA, result.scoreB, result.scoreC]} title="부모 양육 태도 검사 점수" />
          </div>

          <button
            className="w-full mt-6 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={() => navigate("/")}
          >
            🔙 홈으로 돌아가기
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500">❌ 검사 결과를 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default PatTestResultPage;
