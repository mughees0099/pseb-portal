import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const GenderDonutChart = ({ malePercentage, femalePercentage }) => {
  const data = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [malePercentage, femalePercentage],
        backgroundColor: ["#3498db", "#e74c3c"], // Blue for Male, Red for Female
        borderColor: ["#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
  };

  return (
    <div className=" bg-white rounded-lg p-4">
      <h1 className=" text-3xl font-bold text-blue-950 text-center pb-5">
        Gender
      </h1>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default GenderDonutChart;
