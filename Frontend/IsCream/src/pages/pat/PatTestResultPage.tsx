import React from "react";
import { useNavigate } from "react-router-dom";
import usePatTestResult from "../../hooks/pat/usePatTestResult";
import BarChart from "../../components/chart/BarChart";
import Report from "../../components/report/Report";

const PatTestResultPage: React.FC = () => {
  const { data, loading, error } = usePatTestResult();
  const navigate = useNavigate();

  if (loading) return <p className="text-center text-lg font-semibold">⏳ 검사 결과를 불러오는 중...</p>;
  if (error) return <p className="text-center text-red-500 font-semibold">❌ 오류 발생: {error}</p>;
  
  // API 응답 데이터 구조에 맞게 조정
  const result = data?.data;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[706px] p-3 my-2 bg-white border border-gray-300 rounded items-center">
        <div>
          <div className="m-3 text-xl">부모 양육 태도 검사 (PAT)</div>
          {result ? (
            <>              <h2 className="text-xl text-center mb-2">{result.testDate}</h2>
              
              <div className="mt-6">
                <BarChart 
                  data={[result.scoreA, result.scoreB, result.scoreC]} 
                  title="부모 양육 태도 검사 점수" 
                />
              </div>

              <div className="mt-6">
                <Report text={result.result} />
              </div>
              
              <button
                className="w-full mt-6 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                onClick={() => navigate("/")}
              >
                돌아가기
              </button>
            </>
          ) : (
            <p className="text-center text-gray-500">❌ 검사 결과를 찾을 수 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatTestResultPage;
