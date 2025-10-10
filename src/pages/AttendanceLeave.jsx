import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/AttendanceLeave.css';

const AttendanceLeave = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Attendance & Leave Records');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const tabs = [
    'Overview', 'Add Employee', 'Attendance & Leave Records',
    'Performance & Training', 'Documents & Contracts', 'Audit Logs'
  ];

  // ✅ Date formatter function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const attendanceData = [
    {
      id: 1,
      employee: 'Jeremy Neigh',
      department: 'Support',
      date: '2018-09-23',
      attendanceStatus: 'Present',
      leaveStatus: '-',
      details: 'Check In: 09:00 AM\nCheck Out: 06:00 PM\nHours: 9h 0m'
    },
    {
      id: 2,
      employee: 'Annette Black',
      department: 'QA',
      date: '2013-07-27',
      attendanceStatus: '-',
      leaveStatus: 'Approved',
      details: 'Type: Annual Leave\nDuration: Full Day\nApproved by: Michael Wilson'
    },
    {
      id: 3,
      employee: 'Theresa Webb',
      department: 'People Ops',
      date: '2016-11-07',
      attendanceStatus: 'Late',
      leaveStatus: '-',
      details: 'Check In: 10:15 AM\nCheck Out: 06:30 PM\nHours: 8h 15m'
    },
    {
      id: 4,
      employee: 'Kathryn Murphy',
      department: 'IT',
      date: '2014-06-19',
      attendanceStatus: 'Present',
      leaveStatus: '-',
      details: 'Check In: 08:45 AM\nCheck Out: 05:30 PM\nHours: 8h 45m'
    },
    {
      id: 5,
      employee: 'Courtney Henry',
      department: 'Customer Success',
      date: '2019-07-11',
      attendanceStatus: '-',
      leaveStatus: 'Pending',
      details: 'Type: Sick Leave\nDuration: Half Day (AM)\nRequested: 2023-10-14'
    },
    {
      id: 6,
      employee: 'Jane Cooper',
      department: 'Product',
      date: '2019-08-02',
      attendanceStatus: '-',
      leaveStatus: 'Approved',
      details: 'Check In: 09:00 AM\nCheck Out: 06:00 PM\nHours: 9h 0m'
    }
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'Overview') navigate('/employee-info');
    else if (tab === 'Add Employee') navigate('/add-employee');
    else if (tab === 'Attendance & Leave Records') navigate('/attendance-leave');
    else if (tab === 'Performance & Training') navigate('/performance-training');
    else if (tab === 'Documents & Contracts') navigate('/documents-contracts');
    else if (tab === 'Audit Logs') navigate('/audit-logs');
  };

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
  };

  return (
    <div className="attendance-leave-container">
      <Sidebar />

      <div className="attendance-leave-content">
        {/* Header */}
        <header className="attendance-leave-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Employee Information Management</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Attendance & Leave Records</span>
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

        {/* Tab Navigation */}
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

        {/* Main Content */}
        <div className="attendance-leave-main-content">
          <div className="section-header">
            <h2>Attendance & Leave Records</h2>
          </div>

          {/* ✅ Toolbar (Date Range + Buttons) */}
          <div className="attendance-toolbar">
            <div className="left-toolbar">
              <span className="date-range-label">📅 Date Range:</span>
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
              <span className="date-range-to">to</span>
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
              />
            </div>

            <div className="right-toolbar">
              <button className="filter-btn">Filter</button>
              <button
                className="add-leave-btn1"
                onClick={() => navigate('/add-leave')}
              >
                + Add Leave
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="attendance-table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Attendance Status</th>
                  <th>Leave Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map(record => (
                  <tr
                    key={record.id}
                    className={selectedRecord?.id === record.id ? 'selected' : ''}
                    onClick={() => handleRecordClick(record)}
                  >
                    <td>{record.employee}</td>
                    <td>{record.department}</td>
                    <td>{formatDate(record.date)}</td>
                    <td>
                      <span className={`status-badge ${record.attendanceStatus.toLowerCase()}`}>
                        {record.attendanceStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${record.leaveStatus.toLowerCase()}`}>
                        {record.leaveStatus}
                      </span>
                    </td>
                    <td>{record.details.split('\n')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceLeave;
