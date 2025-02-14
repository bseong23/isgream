import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

// ✅ Chart.js 요소 등록
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  data?: number[];
  labels?: string[];
  title?: string;
  className?: string;
}

const COLOR_PROPS = {
  backgroundColor: "rgba(137, 215, 133, 0.2)",
  borderColor: "#89D785",
  pointBackgroundColor: "#89D785",
  pointBorderColor: "#fff",
  pointHoverBackgroundColor: "#fff",
  pointHoverBorderColor: "#89D785"
};

const DEFAULT_LABELS = ["우호성", "정서적 안정성", "외향성", "성실성", "개방성"];
const DEFAULT_DATA = [4.5, 3.2, 4.0, 2.8, 3.5];

const RadarChart: React.FC<RadarChartProps> = ({
  data = DEFAULT_DATA,
  labels = DEFAULT_LABELS,
  title = "심리 분석 결과",
  className = ""
}) => {

  const formattedData = data.map(value => Number(value.toFixed(2)));

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: formattedData,
        backgroundColor: COLOR_PROPS.backgroundColor,
        borderColor: COLOR_PROPS.borderColor,
        borderWidth: 2,
        pointBackgroundColor: COLOR_PROPS.pointBackgroundColor,
        pointBorderColor: COLOR_PROPS.pointBorderColor,
        pointHoverBackgroundColor: COLOR_PROPS.pointHoverBackgroundColor,
        pointHoverBorderColor: COLOR_PROPS.pointHoverBorderColor
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: -5,
        suggestedMax: 5,
        ticks: {
          stepSize: 1
        },
        grid:{
          
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: title
      },
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        callbacks: {
          label: (context: any) => {
            return `${context.raw}`; // 값만 표시
          },
          title: () => '' // title(날짜) 제거
        }
      }
    }
  };

  return (
    <div  className="w-full flex justify-center">
      <div
        className={`w-full h-full min-h-[250px] bg-white flex justify-center ${className}`}
      >
        <Radar data={chartData} options={options} className="w-full"/>
      </div>
    </div>
  );
};

export default RadarChart;
