import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: true, text: 'Compensation Trends' },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1500 },
      grid: {
        drawTicks: false,
        borderDash: [5, 5],
      },
    },
  },
};

const data = {
  labels: [ 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Base Salary',
      data: [5000, 5200, 5400, 5600, 5800],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      tension: 0.3,
    },
    {
      label: 'Bonus',
      data: [4000, 3500, 4000, 4500, 5000],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      tension: 0.3,
    },
  ],
};

const LineChartCompensation = () => {
  return (
      <Line data={data} options={options} />
  );
};

export default LineChartCompensation;
