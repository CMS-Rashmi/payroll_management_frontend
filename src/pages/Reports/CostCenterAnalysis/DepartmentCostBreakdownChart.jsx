import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Engineering',
    Salary: 12000,
    Overhead: 6000,
    Benefits: 3000,
    Bonus: 2000,

  },
  {
    name: 'Sales',
    Salary: 8000,
    Overhead: 3000,
    Benefits: 1500,
    Bonus: 1000,
  },
  {
    name: 'Finance',
    Salary: 5000,
    Overhead: 2000,
    Benefits: 1000,
    Bonus: 500,
  },
];

const DepartmentCostBreakdownChart = () => {
  return (
    <div style={{ width: '100%', height: 350 }}>
      <h3 style={{
        textAlign: 'center',
        marginBottom: '10px',
        fontSize: '18px',
        fontWeight: '600',
        color: '#333'
      }}>
        Department Cost Breakdown
      </h3>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="70%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend verticalAlign="bottom" />
          <Bar dataKey="Salary" stackId="a" fill="#4F46E5" />
          <Bar dataKey="Overhead" stackId="a" fill="#16A34A" />
          <Bar dataKey="Benefits" stackId="a" fill="#F59E0B" />
          <Bar dataKey="Bonus" stackId="a" fill="#9333EA" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentCostBreakdownChart;
