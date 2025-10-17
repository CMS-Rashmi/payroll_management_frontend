import React, { useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import ReportFilters from './ReportFilters';
import ReportCards from './ReportCards';
import ChartsList from './ChartsList';
import { Download, Printer } from 'lucide-react';
import '../../styles/Reports/button.css';
import '../../styles/Reports/reportpage.css';
import ReportHeader from './ReportHeader';


const ReportPage = () => {

  const [selectedReport, setSelectedReport] = useState('Payroll Summary');

  return (
    <div className="report-page">
      <Sidebar />

      <div className="employee-info-content">
        <Header />

        <ReportHeader />

        <div style={{ padding: '25px 24px' }}>
          <div className='report-content'>

            <ReportFilters reportType={selectedReport} setReportType={setSelectedReport} />

            <ReportCards reportType={selectedReport} />

            <ChartsList reportType={selectedReport} />

            <div className='buttonsSection'>
              <button onClick={() => alert('Download functionality to be implemented')} className='button'>
                <Download size={16} /> Download
              </button>

              <button onClick={() => alert('Print functionality to be implemented')} className='button'>
                <Printer size={16} /> Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
