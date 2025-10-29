import React, { useState } from 'react';
import PayRollSummaryPage from './PayRollSummaryPage/PayRollSummaryPage';
import CompensateTrendsPage from './CompentsationTrendsPage/CompensateTrendsPage';
import CostCenterAnalysisPage from './CostCenterAnalysisPage/CostCenterAnalysisPage';
import ForecastingPage from './ForecastingPage/ForecastingPage';
import EmployeePage from './EmployeePage/EmployeePage';
import '../../styles/Reports/tabs.css'

function CustomTabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <div className="tab-panel">{children}</div>}
    </div>
  );
}

function ReportPanel() {
  const [value, setValue] = useState(0);

  const handleChange = (index) => {
    setValue(index);
  };

  const tabs = [
    'Employee Summary',
    'Payroll Summary',
    'Compensate Trends',
    'Cost Center Analysis',
    'Forecasting & Budgeting',
  ];

  return (
    <div className="tabs-container">
      <div className="tab-list" role="tablist">
        {tabs.map((label, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={value === index}
            aria-controls={`simple-tabpanel-${index}`}
            id={`simple-tab-${index}`}
            className={`tab-button ${value === index ? 'active' : ''}`}
            onClick={() => handleChange(index)}
          >
            {label}
          </button>
        ))}
      </div>

      <CustomTabPanel value={value} index={0}>
        <EmployeePage/>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <PayRollSummaryPage/>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <CompensateTrendsPage />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={3}>
        <CostCenterAnalysisPage />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={4}>
        <ForecastingPage/>
      </CustomTabPanel>
    </div>
  );
}

export default ReportPanel;
