import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const barData = {
  labels: ['Engineering', 'Sales', 'Finance', 'HR'],
  datasets: [
    {
      label: 'Total Salary',
      data: [79000, 41000, 63000, 30000],
      backgroundColor: '#4F46E5',
      maxBarThickness: 20,
    },
  ],
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: true, text: 'Department-wise Salary Distribution' },
  },
  scales: {
    x: {
      barPercentage: 0.8,
      categoryPercentage: 0.1,
      grid: {
        drawTicks: false,
        borderDash: [5, 5],
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 20000 },
        grid: {
          drawTicks: false,
          borderDash: [5, 5],
        },

      },
    },
  }
};

const PayrollBarChart = () => {
  return (
    <Bar data={barData} options={barOptions} />
  );
}

export default PayrollBarChart;


