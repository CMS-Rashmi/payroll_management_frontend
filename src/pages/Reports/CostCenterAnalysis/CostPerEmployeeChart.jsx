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
  Rectangle,
} from 'recharts';
import '../../../styles/Reports/chart.css';
const data = [
  { name: 'Engineering', cost: 7603 },
  { name: 'Sales', cost: 7980 },
  { name: 'Finance', cost: 7050 },
];

const getIntroOfDepartment = (label) => {
  if (label === 'Engineering') return 'Engineering drives product development and innovation.';
  if (label === 'Sales') return 'Sales focuses on revenue generation and client relationships.';
  if (label === 'Finance') return 'Finance manages budgets, forecasting, and compliance.';
  return '';
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: '#fff',
      padding: '6px',
      border: '1px solid #ccc',
      fontSize: '12px',
      borderRadius: '6px',
      color: 'black',
    }}>
      <p>{`${label} : $${payload[0].value.toLocaleString()}`}</p>
      <p>{getIntroOfDepartment(label)}</p>
      <p >This reflects the average cost per employee in this department.</p>
    </div>
  );
};

const CostPerEmployeeChart = () => {
  return (
    <div style={{ width: '100%', height: 350 }}>
      <h3 style={{
        textAlign: 'center',
        marginBottom: '10px',
        fontSize: '18px',
        fontWeight: '600',
        color: '#333'
      }}>
        Cost Per Employee
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          barCategoryGap="70%"
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >

          <Rectangle x={0} y={0} width="10%" height="10%" fill="#f2f2f2" />

          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="cost" barSize={10} fill="#8884d8" name="Cost Per Employee" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostPerEmployeeChart;
