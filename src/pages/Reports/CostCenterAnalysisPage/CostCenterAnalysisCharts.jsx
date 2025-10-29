import React from 'react';
import DeductionsChart from './DeductionsChart';
import AllowancesChart from './AllowanceChart';
import BonusesChart from './BonusesChart';


const CostCenterAnalysisCharts = ({ year = new Date().getFullYear() }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '20px',
      }}
    >
      <DeductionsChart year={year} />
      <AllowancesChart year={year} />
      <BonusesChart year={year} />
    </div>
  );
};

export default CostCenterAnalysisCharts;
