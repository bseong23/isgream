import { useEffect } from "react";
import RadarChart from "../chart/RadarChart";
import Report from "../report/Report";
import { useBigFiveTest } from "../../hooks/bigfive/useBigFiveTest";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const BigFiveResult = () => {
  const {
    recentResult: resultData,
    loading,
    fetchRecentResult
  } = useBigFiveTest();

  const { selectedChild } = useSelector((state: RootState) => state.child);

  useEffect(() => {
    if (selectedChild) {
      fetchRecentResult();
    }
  }, [selectedChild, fetchRecentResult]);

  // 로딩 상태
  if (loading) {
    return <div>결과를 불러오는 중...</div>;
  }

  // 결과 데이터가 없는 경우
  if (!resultData) {
    return <div>검사 결과를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="w-full flex mt-10 justify-center">
      <div className="w-full max-w-[706px] p-3 my-2 bg-white border border-gray-300 rounded items-center">
        <div>
          <div className="m-3 text-xl">성격 5요인 검사(BFI) 결과</div>
          <div>
            <RadarChart
              data={[
                resultData.data.conscientiousness,
                resultData.data.agreeableness,
                resultData.data.emotionalStability,
                resultData.data.extraversion,
                resultData.data.openness
              ]}
              title={resultData.data.testDate || "검사 결과"}
            />
          </div>
          <div>
            <Report
              text={resultData.data.analysis || "분석 결과가 없습니다."}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BigFiveResult;
