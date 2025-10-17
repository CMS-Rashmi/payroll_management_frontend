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
    current: 105000,
    projected: 98000,
  },
  {
    name: 'Sales',
    current: 50000,
    projected: 75000,
  },
  {
    name: 'Finance',
    current: 28000,
    projected: 27000,
  },
];

const DepartmentBudgetChart = () => {
  return (
    <div style={{ width: '100%', height: 350 }}>
      <h3 style={{
        textAlign: 'center',
        marginBottom: '10px',
        fontSize: '18px',
        fontWeight: '600',
        color: '#333'
      }}>
        Department Budget Comparison
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="current" fill="#8884d8" name="Current Budget" />
          <Bar dataKey="projected" fill="#82ca9d" name="Projected Budget" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentBudgetChart;
