import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/AuditLogs.css';

const AuditLogs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Audit Logs');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    'Overview', 'Add Employee', 'Attendance & Leave Records',
    'Performance & Training', 'Documents & Contracts', 'Audit Logs'
  ];

  const auditData = [
    { id: 1, time: '2023-10-15 09:23:45', event: 'Employee Created', user: 'HR Admin (admin@company.com)', description: 'Created new employee record for John Doe (EMPO01)', module: 'Employee' },
    { id: 2, time: '2023-10-15 10:45:12', event: 'Document Uploaded', user: 'HR Admin (admin@company.com)', description: 'Uploaded Employment Contract for John Doe (EMPO01)', module: 'Document' },
    { id: 3, time: '2023-10-16 11:32:08', event: 'Leave Approved', user: 'Michael Wilson (manager@company.com)', description: 'Approved annual leave request for Jane Smith (EMPO02)', module: 'Leave Mans' },
    { id: 4, time: '2023-10-17 14:15:30', event: 'Performance Review Added', user: 'Michael Wilson (manager@company.com)', description: 'Added performance review for Robert Johnson (EMPO03)', module: 'Performance' },
    { id: 5, time: '2023-10-18 08:45:22', event: 'Employee Updated', user: 'HR Admin (admin@company.com)', description: 'Updated contact information for Emily Davis (EMPO04)', module: 'Employee' },
    { id: 6, time: '2023-10-18 16:30:05', event: 'Document Deleted', user: 'HR Admin (admin@company.com)', description: 'Deleted outdated contract for Emily Davis (EMPO04)', module: 'Documents' },
    { id: 7, time: '2023-10-19 10:05:18', event: 'Failed Login Attempt', user: 'Unknown', description: 'Multiple failed login attempts from unrecognized IP', module: 'Security' }
  ];

  // Format datetime
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Filtered data
  const filteredData = auditData.filter(item => {
    const itemDate = new Date(item.time);

    const matchesStartDate = startDate ? itemDate >= new Date(startDate) : true;
    const matchesEndDate = endDate ? itemDate <= new Date(endDate) : true;

    const matchesSearch = searchTerm
      ? item.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.module.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesStartDate && matchesEndDate && matchesSearch;
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch(tab){
      case 'Overview': navigate('/employee-info'); break;
      case 'Add Employee': navigate('/add-employee'); break;
      case 'Attendance & Leave Records': navigate('/attendance-leave'); break;
      case 'Performance & Training': navigate('/performance-training'); break;
      case 'Documents & Contracts': navigate('/documents-contracts'); break;
      default: break;
    }
  };

  return (
    <div className="audit-logs-container">
      <Sidebar />
      <div className="audit-logs-content">
        {/* Header */}
        <header className="audit-logs-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Employee Information Management</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Audit Logs</span>
            </div>
            <h1 className="page-title">Employee Information Management</h1>
          </div>

          <div className="header-right">
            <div className="notification-icon">🔔</div>
            <div className="user-profile">
              <div className="user-avatar"></div>
              <span className="username">John</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="tab-navigation">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="date-input" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="date-input" />
          <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>User</th>
                <th>Description</th>
                <th>Module</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id}>
                  <td>{formatDateTime(item.time)}</td>
                  <td>{item.event}</td>
                  <td>{item.user}</td>
                  <td>{item.description}</td>
                  <td>{item.module}</td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '15px' }}>No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
