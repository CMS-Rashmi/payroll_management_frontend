import React, { useState } from 'react';
import PayrollSummaryCards from './PayrollSummaryCards';
import MonthYearPicker from '../MonthYearPicker';
import SalaryHistogram from './SalaryHistogram';

const PayRollSummaryPage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const handleMonthYearChange = ({ month: selectedMonth, year: selectedYear }) => {
    console.log('Selected Month:', selectedMonth);
    console.log('Selected Year:', selectedYear);
    setMonth(selectedMonth);
    setYear(selectedYear);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', padding:0, marginBottom: '5px' }}>
        <MonthYearPicker onChange={handleMonthYearChange} />
      </div>

      <PayrollSummaryCards month={month} year={year} />

      <SalaryHistogram />
    </div>
  );
};

export default PayRollSummaryPage;
