export interface HTPAnalysis {
    order: number;
    time: string;
    type: "house" | "tree" | "male" | "female";
    description: string;
  }
  
  // 🔥 서버에서 받은 `result` 문자열을 JSON 객체 배열로 변환하는 함수
  export const parseHTPResult = (resultString: string): HTPAnalysis[] => {
    const sections = resultString.split("----"); // 검사 결과를 구분자로 나눔
    return sections.map((section) => {
      const match = section.match(/검사 순서: (\d+)\n검사 시간: ([\d.]+)\n검사 유형: (\w+)\n(.+)/s);
      return match
        ? {
            order: Number(match[1]), // 검사 순서
            time: match[2] + "초", // 검사 시간
            type: match[3] as "house" | "tree" | "male" | "female", // 검사 유형
            description: match[4].trim(), // 분석 내용
          }
        : null;
    }).filter(Boolean) as HTPAnalysis[];
  };
  