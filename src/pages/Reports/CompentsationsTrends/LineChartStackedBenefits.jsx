import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const stackedOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: true, text: 'Stacked Benefits Over Time' },
    tooltip: {
      callbacks: {
        label: (context) => `$${context.parsed.y.toLocaleString()} ${context.dataset.label}`,
      },
    },
  },
  scales: {
    x: {
      title: { display: true, text: 'Year' },
    },
    y: {
      stacked: true,
      title: { display: true, text: 'Benefit Value (USD)' },
      ticks: {
        callback: (value) => `$${value.toLocaleString()}`,
        stepSize: 200
      },
      beginAtZero: true,
    },
  },
};

const stackedData = {
  labels: ['2021', '2022', '2023'],
  datasets: [
    {
      label: 'Healthcare',
      data: [400, 500, 600],
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      fill: true,
      stack: 'benefits',
      tension: 0.3,
    },
    {
      label: 'Retirement',
      data: [250, 250, 300],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      fill: true,
      stack: 'benefits',
      tension: 0.3,
    },
    {
      label: 'Insurance',
      data: [500, 120, 150],
      borderColor: 'rgba(255, 159, 64, 1)',
      backgroundColor: 'rgba(255, 159, 64, 0.5)',
      fill: true,
      stack: 'benefits',
      tension: 0.3,
    },
    {
      label: 'Other Benefits',
      data: [50, 80, 100],
      borderColor: 'rgba(153, 102, 255, 1)',
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      fill: true,
      stack: 'benefits',
      tension: 0.3,
    },
  ],
};

const LineChartStackedBenefits = () => {
  return (

    <Line data={stackedData} options={stackedOptions} />

  )
};

export default LineChartStackedBenefits;
