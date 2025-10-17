import React from 'react'
import TotalCostDistributionChart from './TotalCostDistributionChart';
import DepartmentCostBreakdownChart from './DepartmentCostBreakdownChart';
import CostPerEmployeeChart from './CostPerEmployeeChart';
import '../../../styles/Reports/chart.css';


const CostCenterAnalysisChart = () => {
  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <div className="chart-outline">
        <DepartmentCostBreakdownChart />
      </div>

      <div className="chart-outline">
        <TotalCostDistributionChart />
      </div>

      <div className="chart-outline">
        <CostPerEmployeeChart />
      </div>

    </div>
  );
}

export default CostCenterAnalysisChart
