import React, { useEffect, useState } from 'react';
import { apiGet } from '../../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const SalaryHistogram = ({ binSize = 20000 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaries = async () => {
      setLoading(true);
      try {
        const salaries = await apiGet('/reports/payroll/salary-range');

        const bins = {};
        salaries.forEach(s => {
          const bin = Math.floor(s / binSize) * binSize;
          const label = `${bin}-${bin + binSize - 1}`;
          bins[label] = (bins[label] || 0) + 1;
        });

        // Convert to "k" labels
        const chartData = Object.keys(bins)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map(key => {
            const [start, end] = key.split('-').map(Number);
            return {
              salary_range: `${Math.floor(start / 1000)}k-${Math.floor(end / 1000)}k`,
              employee_count: bins[key],
            };
          });

        console.log(chartData);

        setData(chartData);
      } catch (err) {
        console.error('Failed to fetch salary histogram:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, [binSize]);

  if (loading) return <p>Loading salary histogram...</p>;

  return (
    <div style={{ width: '50%', height: 350, padding: 10 }}>
    Basic Salary distribution
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="salary_range" angle={-45} textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="employee_count" fill="#82ca9d" name="Employees" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalaryHistogram;
