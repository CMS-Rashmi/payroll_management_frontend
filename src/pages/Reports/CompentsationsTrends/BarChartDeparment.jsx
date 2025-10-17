import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const departmentOptions = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: 'Department Salary Growth',
        },
        legend: {
            position: 'bottom',
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 6000,
        },
    },
};

const departmentData = {
    labels: ['Engineering', 'Sales', 'Finance'],
    datasets: [
        {
            label: '2021 Avg. Salary',
            data: [4200, 3900, 3700],
            backgroundColor: '#4B4B4B',
            barThickness: 10,
            categoryPercentage: 0.6,
            barPercentage: 0.8,
        },
        {
            label: '2022 Avg. Salary',
            data: [4800, 4200, 3900],
            backgroundColor: '#A9A9A9',
            barThickness: 10,
            categoryPercentage: 0.6,
            barPercentage: 0.8,
        },
        {
            label: '2023 Avg. Salary',
            data: [5600, 4700, 4100],
            backgroundColor: '#007BFF',
            barThickness: 10,
            categoryPercentage: 0.6,
            barPercentage: 0.8,
        },
    ],
};

const BarChartDepartment = () => {
    return (
        <Bar data={departmentData} options={departmentOptions} />
    );
};

export default BarChartDepartment;
