import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// ✅ Chart.js에 필요한 요소 등록
Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface BarChartProps {
  data?: number[];
  title?: string;
  className?: string;
}

const COLOR_PROPS = {
  colors: ["#84CAFF", "#FED300", "#89D785"]
};

const LABELS = ["A형", "B형", "C형"];

const BarChart: React.FC<BarChartProps> = ({
  data = [0, 0, 0],
  title = "0000.00.00",
  className = ""
}) => {
  const maxValue = Math.max(...data);
  const roundedMax = Math.ceil((maxValue + 5) / 5) * 5;

  const chartData = {
    labels: LABELS,
    datasets: [
      {
        label: "데이터",
        data: data,
        backgroundColor: COLOR_PROPS.colors
      }
    ]
  };

  const options = {
    responsive: true,
    aspectRatio: 1.2,
    plugins: {
      title: {
        display: true,
        text: title
      },
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: roundedMax,
        grid: {
          color: "rgba(0, 0, 0, 0.1)"
        },
        ticks: {
          stepSize: 5
        }
      },
      x: {
        grid: {
          drawBorder: false,
          display: true,
          drawOnChartArea: true,
          drawTicks: false,
          lineWidth: 1,
          color: "rgba(0, 0, 0, 0.1)",
          offset: false
        },
        ticks: {
          padding: 10,
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div  className="w-full flex justify-center ">
      <div
        className={`w-[80%] h-full bg-white flex justify-center ${className}`}
      >
        <Bar data={chartData} options={options} className="w-full"/>
      </div>
    </div>
  );
};

export default BarChart;
