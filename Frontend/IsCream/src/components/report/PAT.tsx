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
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  // 에러 상태
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트가 마운트될 때 PAT 데이터를 가져옴
  useEffect(() => {
    const fetchPATData = async () => {
      try {
        setIsLoading(true);
        console.log("pat검사 결과 조회 시작");
        
        const response = await patApi.getRecentResult();
        console.log("pat검사결과데이터: ", response);

        setPATData(response.data);
      } catch (err) {
        setError("PAT 결과를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPATData();
  }, []);

  // // 로딩 중일 때
  // if (isLoading) {
  //   return (
  //     <div className="w-full flex justify-center">
  //       <div className="w-full max-w-[706px] p-3 my-2 bg-white border border-gray-300 rounded items-center">
  //         로딩 중...
  //       </div>
  //     </div>
  //   );
  // }

  // // 에러가 있을 때
  // if (error) {
  //   return (
  //     <div className="w-full flex justify-center">
  //       <div className="w-full max-w-[706px] p-3 my-2 bg-white border border-gray-300 rounded items-center text-red-500">
  //         {error}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[706px] p-3 my-2 bg-white border border-gray-300 rounded items-center">
        <div>
          <div className="m-3 text-xl">부모 양육 태도 검사(PAT)</div>
          <div>
            <BarChart
              data={
                patData ? [patData.scoreA, patData.scoreB, patData.scoreC] : [0,0,0]
              }
              title={patData?.testDate || "날짜 없음"}
            />
          </div>
          <div>
            <Report text={patData?.result || "보고서가 없습니다."} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PAT;
