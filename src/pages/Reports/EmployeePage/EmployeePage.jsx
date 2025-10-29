import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaMale, FaFemale } from 'react-icons/fa';

import { apiGetWithParams } from '../../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);


const EmployeePage = ({ departmentId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await apiGetWithParams('/reports/employees', { departmentId });
        setData(res);
        console.log(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInsights();
  }, [departmentId]);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
      {/* Top cards */}
      <div>

        <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
          <div
            style={{
              backgroundColor: '#f0f0f0', // light gray background
              padding: '15px 25px',
              borderRadius: '50%',      // rounded corners
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              textAlign: 'center',
              minWidth: '120px',
              fontWeight: 'bold',
            }}
          >
            Employees <br /> {data.total_employees}
          </div>

          <div
            style={{
              backgroundColor: '#f0f0f0',
              padding: '15px 25px',
              borderRadius: '50%',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              textAlign: 'center',
              minWidth: '120px',
              fontWeight: 'bold',
            }}
          >
            Departments <br /> {data.total_departments}
          </div>
        </div>


        {/* Gender distribution */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0px', marginTop:'15px', marginLeft:'10px' }}>
          {data.gender?.map((g) => {
            const percent = data.total_employees ? ((g.total / data.total_employees) * 100).toFixed(0) : 0;
            return (
              <div key={g.gender} style={{ textAlign: 'center' }}>
                {g.gender === 'Male' ? (
                  <FaMale style={{ fontSize: '50px', color: '#3399FF' }} />
                ) : (
                  <FaFemale style={{ fontSize: '50px', color: '#FF9933' }} />
                )}
                <div style={{ marginTop: '5px', fontWeight: 'bold', fontSize: '18px' }}>
                  {percent}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Doughnut charts for type and grade */}
      <div style={{ display: 'flex', gap: '50px' }}>
        <DoughnutChart title="Employee Type" data={data.types || []} labelKey="type" />
        <DoughnutChart title="Employee Grade" data={data.grades || []} labelKey="grade" />
      </div>
    </div>
  );
};

const DoughnutChart = ({ title, data, labelKey }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ minWidth: '200px', textAlign: 'center' }}>
        <h3>{title}</h3>
        <p>No data available</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d[labelKey]),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF'],
      },
    ],
  };

  return (
    <div style={{ width: '200px' }}>
      <h3>{title}</h3>
      <Doughnut data={chartData} />
    </div>
  );
};


export default EmployeePage;
