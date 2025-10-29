import React from 'react'
import '../../styles/Reports/reportpage.css'


const ReportHeader = ({ tabName }) => {
  return (
    <header className="employee-info-header">
      <div className="header-left">
        <div className="breadcrumb">
          <span className="breadcrumb-item">Reports & Analytics</span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-item active">{tabName}</span>
        </div>
        <h1 className="page-title">{tabName}</h1>
      </div>
    </header>
  );
};


export default ReportHeader
