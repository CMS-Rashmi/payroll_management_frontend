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

const COLORS = [
    '#0088FE',
    '#00C49F',
    '#A28EFF',
    '#FFBB28',
    '#FF8042',
    '#FF6B6B',
    '#8884D8',
    '#82CA9D',
    '#A4DE6C',
    '#D0ED57'
];

const AllowancesChart = ({ year }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllowances = async () => {
            setLoading(true);
            try {
                const res = await apiGetWithParams('/reports/allowances/by-type', { year });
                setData(res.map(d => ({ ...d, total_amount: Number(d.total_amount) || 0 })));
            } catch (err) {
                console.error('Error fetching allowances:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllowances();
    }, [year]);

    if (loading) return <p>Loading Allowances...</p>;

    const filtered = data.filter(d => d.total_amount > 0);
    if (!filtered.length) return <p>No allowances data</p>;

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
        indexAxis: 'y', // 🔥 flips the chart to horizontal
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
                title: { display: true, text: 'Allowance Type' },
                ticks: { autoSkip: false },
            },
        },
    };

    return (
        <div style={{ width: '600px', margin: '20px' }}>
            <h3 style={{ textAlign: 'center' }}>Allowances by Type</h3>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default AllowancesChart;
