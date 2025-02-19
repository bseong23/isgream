import RadarChart from "../chart/RadarChart";
import Report from "../../components/report/Report";
import { useBigFiveTest } from "../../hooks/bigfive/useBigFiveTest";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect } from "react";

const Personality5 = () => {
  const {
    recentResult: bigFiveData,
    loading: isLoading,
    fetchRecentResult
  } = useBigFiveTest();

  const { selectedChild } = useSelector((state: RootState) => state.child);

  useEffect(() => {
    if (selectedChild) {
      fetchRecentResult();
    }
  }, [selectedChild, fetchRecentResult]);

  // 로딩 상태
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[706px] p-3 my-2 bg-white border border-gray-300 rounded items-center">
        <div>
          <div className="m-3 text-xl">성격 5요인 검사(BFI)</div>
          <div>
            <RadarChart
              data={
                bigFiveData
                  ? [
                      bigFiveData.data.agreeableness, // 우호성
                      bigFiveData.data.emotionalStability, // 정서적 안정성
                      bigFiveData.data.extraversion, // 외향성
                      bigFiveData.data.conscientiousness, // 성실성
                      bigFiveData.data.openness // 개방성
                    ]
                  : [-5, -5, -5, -5, -5]
              }
              title={bigFiveData?.data.testDate || "날짜 없음"}
            />
          </div>
          <div>
            <Report
              text={
                bigFiveData?.data.analysis ||
                "아직 검사 결과가 없습니다. 검사를 진행해주세요."
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personality5;
