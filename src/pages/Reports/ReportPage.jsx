import React, { useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
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
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-[200px] w-[calc(100vw-210px)] min-h-screen overflow-x-auto bg-gray-100
  md:ml-[200px] md:w-[calc(100vw-210px)]
  sm:ml-[60px] sm:w-[calc(100vw-70px)]
  max-[625px]:ml-[60px] max-[625px]:w-[calc(100vw-70px)]">


        <Header />

        {/* Report Header */}
        <ReportHeader tabName={tabs[activeTab]} />

        {/* Report Content */}
        <div className="p-[10px_14px]">
          <div className="bg-white rounded-lg w-[95%] text-black shadow-sm border border-gray-200">
            <ReportPanel value={activeTab} onChange={setActiveTab} tabs={tabs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
