import React, { useState, useEffect } from 'react';
import MonthSelector from './MonthSelector';
import '../../styles/Reports/reportpage.css';

const ReportFilters = ({ reportType, setReportType }) => {
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');

  const [filterReportType, setFilterReportType] = useState(reportType || 'Payroll Summary');

  useEffect(() => {
    if (setReportType) {
      setReportType(filterReportType);
    }
  }, [filterReportType, setReportType]);

  const departments = ['HR', 'Finance', 'Engineering', 'Sales', 'Marketing'];

  const designations = ['Manager', 'Software Engineer', 'Accountant'];

  const reportTypes = [
    'Payroll Summary',
    'Compensation Trends',
    'Cost Center Analysis',
    'Forecasting & Budgeting',
  ];

  return (
    <div className='report-filters-container'>



      {/* Department Filter */}
      <div className='report-filter'>
        <span>Department:</span>
        <select
          className="report-filter-select"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>



      {/* Month Filter */}
      <div className='report-filter'>
        <span>Month:</span>
        <MonthSelector filterMonth={filterMonth} setFilterMonth={setFilterMonth} />
      </div>



      {/* Designation Filter */}
      <div className='report-filter'>
        <span>Designation:</span>
        <select
          className="report-filter-select"
          value={filterDesignation}
          onChange={(e) => setFilterDesignation(e.target.value)}
        >
          <option value="">All Designations</option>
          {designations.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>



      {/* Report Type Filter */}
      <div className='report-filter'>
        <span>Report Type:</span>
        <select
          className="report-filter-select"
          value={filterReportType}
          onChange={(e) => setFilterReportType(e.target.value)}
        >
          {reportTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

    </div>
  );
};

export default ReportFilters;
