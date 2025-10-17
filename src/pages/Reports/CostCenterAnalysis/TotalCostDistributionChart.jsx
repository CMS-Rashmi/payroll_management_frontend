import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Engineering', value: 34 },
  { name: 'Finance', value: 11 },
  { name: 'HR', value: 11 },
  { name: 'Sales', value: 27 },
  { name: 'Marketing', value: 17 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA66CC'];



const costdistributiondata = {
  labels: ['Engineering', 'Finance', 'HR', 'Sales', 'Marketing'],
  datasets: [
    {
      label: 'Cost Distribution',
      data: [31, 14, 11, 27, 17],
      backgroundColor: [
        '#36A2EB', // Engineering
        '#FF6384', // Finance
        '#FFCE56', // HR
        '#4BC0C0', // Sales
        '#9966FF', // Marketing
      ],
      borderWidth: 1,
    },
  ],
};

const costdistributionoptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: {
      display: true,
      text: 'Total Cost Distribution',
    },
  },
};

const TotalCostDistributionChart = () => {
  return (
    <div style={{ width: '100%', height: 350 }}>
      <h3 style={{
        textAlign: 'center',
        marginBottom: '10px',
        fontSize: '18px',
        fontWeight: '600',
        color: '#333'
      }}>
        Total Cost Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalCostDistributionChart;
