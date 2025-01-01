/* eslint-disable react/prop-types */
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EnrollmentBarChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.day),
    datasets: [
      {
        label: "Enrollments",
        data: data.map((item) => item.enrolled),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className=" bg-white rounded-lg p-4">
      <h1 className=" text-3xl font-bold text-blue-950 text-center pb-5">
        Enrollment Chart
      </h1>
      <Bar
        data={chartData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default EnrollmentBarChart;
