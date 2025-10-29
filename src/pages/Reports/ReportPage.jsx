import React, { useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import '../../styles/Reports/button.css';
import '../../styles/Reports/reportpage.css';
import ReportHeader from './ReportHeader';
import ReportPanel from './ReportsPanel';

const ReportPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    'Employee Summary',
    'Payroll Summary',
    'Compensate Trends',
    'Cost Center Analysis',
    'Forecasting & Budgeting',
  ];

  return (
    <div className="report-page">
      <Sidebar />
      <div className="report-info-content">
        <Header />

        <ReportHeader tabName={tabs[activeTab]} />

        <div style={{ padding: '10px 14px' }}>
          <div className='report-content'>

            <ReportPanel value={activeTab} onChange={setActiveTab} tabs={tabs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
