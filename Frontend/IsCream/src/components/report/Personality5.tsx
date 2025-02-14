import RadarChart from "../chart/RadarChart";
import Report from "../../components/report/Report";
import { bigFiveApi } from '../../api/bigFive';
import { useState, useEffect } from "react";

// BigFive 데이터 타입 정의
interface BigFiveData {
    date: string;
    conscientiousness: number;
    agreeableness: number;
    emotionalStability: number;
    extraversion: number;
    openness: number;
}

const Personality5 = () => {
    // BigFive 데이터를 저장할 state
    const [bigFiveData, setBigFiveData] = useState<BigFiveData | null>(null);
    // 로딩 상태
    const [isLoading, setIsLoading] = useState(true);
    // 에러 상태
    const [error, setError] = useState<string | null>(null);

    // 컴포넌트가 마운트될 때 BigFive 데이터를 가져옴
    useEffect(() => {
        const fetchBigFiveData = async () => {
            try {
                setIsLoading(true);
                const response = await bigFiveApi.getRecentResult();
                console.log("성격 5요인 검사결과 데이터", response);
                setBigFiveData(response.data);
            } catch (err) {
                setError('성격 5요인 결과를 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBigFiveData();
    }, []); // 빈 배열을 의존성 배열로 추가

    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-[706px] p-3 my-2 bg-white border border-gray-300 rounded items-center'>
                <div>
                    <div className="m-3 text-xl">
                        성격 5요인 검사(BFI)
                    </div>
                    {isLoading ? (
                        <div>로딩 중...</div>
                    ) : error ? (
                        <div>{error}</div>
                    ) : (
                        <>
                            <div>
                                <RadarChart
                                    data={bigFiveData ? [
                                        bigFiveData.conscientiousness,
                                        bigFiveData.agreeableness,
                                        bigFiveData.emotionalStability,
                                        bigFiveData.extraversion,
                                        bigFiveData.openness
                                    ] : []}
                                    title={bigFiveData?.date || '날짜 없음'}
                                />
                            </div>
                            <div>
                                <Report
                                    text="일단은 텍스트로 박아두고, 나중에 마크다운으로 바꿀수도 있음"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Personality5;