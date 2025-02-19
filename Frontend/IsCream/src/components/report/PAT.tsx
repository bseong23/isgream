import React, { useEffect, useState } from "react";
import BarChart from "../chart/BarChart";
import Report from "../../components/report/Report";
import { patApi } from "../../api/pat";

// PAT 데이터 타입 정의
interface PATData {
  testDate: string;
  scoreA: number;
  scoreB: number;
  scoreC: number;
  result: string;
}

const PAT: React.FC = () => {
  // PAT 데이터를 저장할 state
  const [patData, setPATData] = useState<PATData | null>(null);
  // 컴포넌트가 마운트될 때 PAT 데이터를 가져옴
  useEffect(() => {
    const fetchPATData = async () => {
      try {
        const response = await patApi.getRecentResult();
        console.log("pat검사결과데이터: ", response);
        setPATData(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPATData();
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[706px] min-h-[400px] p-3 my-2 bg-white border border-gray-300 rounded items-center">
        <div>
          <div className="m-3 text-xl">부모 양육 태도 검사(PAT)</div>
          <div>
            <BarChart
              data={
                patData
                  ? [patData.scoreA, patData.scoreB, patData.scoreC]
                  : [0, 0, 0]
              }
              title={patData?.testDate || "날짜 없음"}
            />
          </div>
          <div>
            <Report text={patData?.result || "아직 검사 결과가 없습니다. 검사를 진행해주세요."} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PAT;
