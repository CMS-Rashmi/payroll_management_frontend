import React from 'react';
import PayrollPieChart from './PayRollPieChart';
import PayrollBarChart from './PayRollBarChart';
import '../../../styles/Reports/chart.css';

const PayRollSummaryCharts = () => {
  return (
    <div className='charts-container'>
      <div
        style={{
          height: 250,
          width: 250,
          margin: 0,
          padding: 0,
        }}
        className="chart-outline"
      >
        <PayrollPieChart />
      </div>

      <div
        style={{
          flex: 1,
          height: 250,
          margin: 0,
          padding: 0,
          display: 'flex',
          alignItems: 'stretch',
        }}
        className="chart-outline"
      >
        <PayrollBarChart />
      </div>
    </div>
  );
};

export default PayRollSummaryCharts;
