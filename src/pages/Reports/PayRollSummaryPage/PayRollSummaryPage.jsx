import React, { useState } from 'react';
import PayrollSummaryCards from './PayrollSummaryCards';
import SalaryHistogram from './SalaryHistogram';
import DaySelector from '../DaySelector';

const PayRollSummaryPage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const handleMonthYearChange = ({ month: selectedMonth, year: selectedYear }) => {
    setMonth(selectedMonth);
    setYear(selectedYear);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', padding:0, marginBottom: '5px' }}>
        <DaySelector type='monthYear' onChange={handleMonthYearChange} />
      </div>

      <PayrollSummaryCards month={month} year={year} />

      <SalaryHistogram />
    </div>
  );
};

export default PayRollSummaryPage;
