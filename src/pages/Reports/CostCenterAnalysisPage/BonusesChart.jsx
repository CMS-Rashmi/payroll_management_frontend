import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { apiGetWithParams } from '../../../services/api';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const COLORS = ['#FF1493', '#00C49F', '#FF8042', '#FFBB28', '#A28EFF', '#FF6B6B', '#FFA500'];

const BonusesChart = ({ year }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBonuses = async () => {
      setLoading(true);
      try {
        const res = await apiGetWithParams('/reports/bonuses/by-type', { year });
        setData(res.map(d => ({ ...d, total_amount: Number(d.total_amount) || 0 })));
      } catch (err) {
        console.error('Error fetching bonuses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBonuses();
  }, [year]);

  if (loading) return <p>Loading Bonuses...</p>;

  const filtered = data.filter(d => d.total_amount > 0);
  if (!filtered.length) return <p>No bonuses data</p>;

  const chartData = {
    labels: filtered.map(d => d.type),
    datasets: [
      {
        label: 'Total Amount (LKR)',
        data: filtered.map(d => d.total_amount),
        backgroundColor: COLORS.slice(0, filtered.length),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y', // horizontal bars
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.formattedValue}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Total Amount (LKR)' },
        beginAtZero: true,
      },
      y: {
        title: { display: true, text: 'Bonus Type' },
        ticks: { autoSkip: false },
      },
    },
  };

  return (
    <div style={{ width: '600px', margin: '20px' }}>
      <h3 style={{ textAlign: 'center' }}>Bonuses by Type</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default BonusesChart;
