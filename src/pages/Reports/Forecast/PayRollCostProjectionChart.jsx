import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
    { name: 'Sep 2025', budget: 5000, projectCost: 4000, actualCost: 4200 },
    { name: 'Aug 2025', budget: 5500, projectCost: 4600, actualCost: 4700 },
    { name: 'Jul 2025', budget: 6000, projectCost: 5000, actualCost: 4900 },
    { name: 'Jun 2025', budget: 6500, projectCost: 6100, actualCost: 6300 },
    { name: 'May 2025', budget: 7000, projectCost: 6700, actualCost: 7100 },
    { name: 'Apr 2025', budget: 7200, projectCost: 6900, actualCost: 7000 },
    { name: 'Mar 2025', budget: 7500, projectCost: 7100, actualCost: 6900 },
];

const PayRollCostProjectionChart = () => {

    return (
        <div style={{ width: '100%', height: 450 }}>
            <h3 style={{
                textAlign: 'center',
                marginBottom: '10px',
                fontSize: '18px',
                fontWeight: '600',
                color: '#333'
            }}>
                Payroll Cost Projection
            </h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={data}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />

                    <Line type="monotone" dataKey="budget" stroke="#8884d8" strokeWidth={1} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey="projectCost" stroke="#82ca9d" strokeWidth={1} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey="actualCost" stroke="#ff7300" strokeWidth={1} activeDot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PayRollCostProjectionChart;

