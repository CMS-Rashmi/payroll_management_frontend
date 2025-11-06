import React from 'react';
import PayRollSummaryPage from './PayRollSummaryPage/PayRollSummaryPage';
import CompensateTrendsPage from './CompentsationTrendsPage/CompensateTrendsPage';
import CostCenterAnalysisPage from './CostCenterAnalysisPage/CostCenterAnalysisPage';
import ForecastingPage from './ForecastingPage/ForecastingPage';
import EmployeeSummaryPage from './EmployeeSummaryPage/EmployeeSummaryPage';

function CustomTabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <div className="p-4 bg-white rounded-b-[10px] shadow-md">
          {children}
        </div>
      )}
    </div>
  );
}

function ReportPanel({ value, onChange, tabs }) {
  return (
    <div className="flex flex-col w-full h-full text-[14px] ml-[var(--sidebar-width)] w-[calc(100vw-var(--sidebar-width))] max-lg:ml-0 max-lg:w-full">
      {/* Tab List */}
      <div
        className="flex gap-1 border-b-2 border-gray-200 p-0.5 mb-[10px] bg-white sticky top-0 z-10"
        role="tablist"
      >
        {tabs.map((label, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={value === index}
            aria-controls={`simple-tabpanel-${index}`}
            id={`simple-tab-${index}`}
            onClick={() => onChange(index)}
            className={`px-3 py-1.5 text-sm font-medium rounded-t-md border-b-2 transition-all duration-100
              ${
                value === index
                  ? 'border-blue-600 text-blue-600 font-semibold bg-gray-50'
                  : 'border-transparent text-gray-500 hover:bg-gray-100 hover:text-blue-600'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <CustomTabPanel value={value} index={0}>
        <EmployeeSummaryPage />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <PayRollSummaryPage />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <CompensateTrendsPage />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={3}>
        <CostCenterAnalysisPage />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={4}>
        <ForecastingPage />
      </CustomTabPanel>
    </div>
  );
}

export default ReportPanel;
