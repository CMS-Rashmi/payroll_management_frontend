import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const pieData = {
  labels: ['Base Salary', 'Allowances', 'Bonuses', 'Deductions'],
  datasets: [
    {
      data: [70, 15, 8, 7],
      backgroundColor: ['#60A5FA', '#34D399', '#FBBF24', '#F87171'],
    },
  ],
};

const pieOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: true, text: 'Payroll Breakdown' },
  },
};

const PayrollPieChart = () => {
  return (

      <Pie data={pieData} options={pieOptions} />

  );
}

export default PayrollPieChart;
