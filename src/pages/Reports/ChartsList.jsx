import React from 'react';
import CompensationTrendsChart from './CompentsationsTrends/CompensateTrendsChart';
import CostCenterAnalysisChart from './CostCenterAnalysis/CostCenterAnalysisChart';
import ForecastBudgetCharts from './Forecast/ForecastBudgetCharts';
import PayRollSummaryCharts from './PayRollSummary/PayRollSummaryCharts';

const ChartsList = ({ reportType }) => {


  const renderChart = () => {
    switch (reportType) {
      case 'Payroll Summary':
        return <PayRollSummaryCharts />;
      case 'Compensation Trends':
        return <CompensationTrendsChart />;
      case 'Cost Center Analysis':
        return <CostCenterAnalysisChart />;
      case 'Forecasting & Budgeting':
        return <ForecastBudgetCharts />;
      default:
        return <PayRollSummaryCharts />;
    }
  };

  return (
    <div>
      {renderChart()}
    </div>
  );
};

export default ChartsList;
