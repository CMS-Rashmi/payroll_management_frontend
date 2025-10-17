import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import LineChartStackedBenefits from './LineChartStackedBenefits';
import LineChartCompensation from './LineChartCompensation';
import BarChartDepartment from './BarChartDeparment';
import '../../../styles/Reports/chart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CompensateTrendsChart = () => {
  return (
    <div className="charts-container" style={{height:'150%', width:'100%'}}>

      <div className="chart-outline">
        <LineChartCompensation />
      </div>

      <div className="chart-outline">
        <LineChartStackedBenefits />
      </div>

      <div className="chart-outline">
        <BarChartDepartment />
      </div>
    </div>
  );
};

export default CompensateTrendsChart;
