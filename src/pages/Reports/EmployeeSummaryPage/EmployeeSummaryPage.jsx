import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaMale, FaFemale } from 'react-icons/fa';

import { apiGetWithParams } from '../../../services/api';
import TotalCard from './TotalCard';
import DepartmentPicker from '../DepartmentPicker';

const EmployeeSummaryPage = () => {
  const [data, setData] = useState(null);
  const [selectedDeptId, setSelectedDeptId] = useState('all');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const params = selectedDeptId !== 'all' ? { departmentId: selectedDeptId } : {};
        const res = await apiGetWithParams('/reports/employees', params);
        setData(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInsights();
  }, [selectedDeptId]);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      {/* Department Picker */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
        <DepartmentPicker onChange={setSelectedDeptId} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TotalCard name="Employees" amount={data.total_employees} />
          <TotalCard name="Departments" amount={data.total_departments} />
        </div>

        {/* Gender Distribution */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
          {data.gender?.map((g) => (
            <div key={g.gender} style={{ textAlign: 'center' }}>
              {g.gender === 'Male' ? (
                <FaMale style={{ fontSize: '50px', color: '#3399FF' }} />
              ) : (
                <FaFemale style={{ fontSize: '50px', color: '#FF9933' }} />
              )}
              <div style={{ marginTop: '5px', fontWeight: 'bold', fontSize: '18px' }}>
                {g.total}
              </div>
            </div>
          ))}
        </div>

        {/* Donut Charts */}
        <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
          <DonutChart title="Employee Type" data={data.types || []} labelKey="type" />
          <DonutChart title="Employee Grade" data={data.grades || []} labelKey="grade" />
        </div>
      </div>
    </div>
  );
};

// Donut Chart Component showing counts
const DonutChart = ({ title, data, labelKey }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ minWidth: '200px', textAlign: 'center' }}>
        <h3>{title}</h3>
        <p>No data available</p>
      </div>
    );
  }

  const COLORS = data.map((_, i) => `hsl(${(i * 360) / data.length}, 70%, 60%)`);

  return (
    <div style={{ width: '250px', textAlign: 'center' }}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey={labelKey}
            cx="50%"
            cy="50%"
            innerRadius={60}  
            outerRadius={100}
            label={({ value }) => value} 
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} employees`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmployeeSummaryPage;
