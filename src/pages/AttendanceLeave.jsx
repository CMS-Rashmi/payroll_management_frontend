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
      details: 'Check In: 09:00 AM\nCheck Out: 06:00 PM\nHome: 01:00 PM'
    },
    {
      id: 2,
      employee: 'Amettie Black',
      department: 'QA',
      date: '2013-07-27',
      attendanceStatus: 'Approved',
      leaveStatus: '-',
      details: 'Check In: 09:00 AM\nCheck Out: 06:00 PM\nHome: 01:00 PM'
    },
    {
      id: 3,
      employee: 'Theresa Webb',
      department: 'People Ops',
      date: '2016-11-07',
      attendanceStatus: 'Late',
      leaveStatus: '-',
      details: 'Check In: 09:00 AM\nCheck Out: 06:00 PM\nHome: 01:00 PM'
    },
    {
      id: 4,
      employee: 'Kathryn Murphy',
      department: 'IT',
      date: '2014-06-19',
      attendanceStatus: 'Present',
      leaveStatus: '-',
      details: 'Check In: 05:30 PM\nCheck Out: 06:00 PM\nHome: 01:00 PM'
    },
    {
      id: 5,
      employee: 'Courtney Henry',
      department: 'Customer Success',
      date: '2019-07-11',
      attendanceStatus: '-',
      leaveStatus: 'Pending',
      details: 'Type: Sick Leave\nDuration: Full Day\nApproved by: Michael Wilson'
    },
    {
      id: 6,
      employee: 'Jane Cooper',
      department: 'Product',
      date: '2019-08-02',
      attendanceStatus: 'Approved',
      leaveStatus: '-',
      details: 'Reader: Half Day (JAM)\nCheck In: 09:00 AM\nCheck Out: 06:00 PM'
    },
    {
      id: 7,
      employee: 'Jane Cooper',
      department: 'Product',
      date: '2019-08-02',
      attendanceStatus: 'Approved',
      leaveStatus: '-',
      details: 'Check In: 09:00 AM\nCheck Out: 06:00 PM\nHome: 01:00 PM'
    },
    {
      id: 8,
      employee: 'Jane Cooper',
      department: 'Product',
      date: '2019-08-02',
      attendanceStatus: 'Approved',
      leaveStatus: '-',
      details: 'Check In: 09:00 AM\nCheck Out: 06:00 PM\nHome: 01:00 PM'
    },
    {
      id: 9,
      employee: 'Jane Cooper',
      department: 'Product',
      date: '2019-08-02',
      attendanceStatus: 'Approved',
      leaveStatus: '-',
      details: 'Check In: 09:00 AM\nCheck Out: 06:00 PM\nHome: 01:00 PM'
    }
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'Overview') {
      navigate('/employee-information');
    } else if (tab === 'Add Employee') {
      navigate('/add-employee');
    }
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
              <span className="breadcrumb-item">Dashboard</span>
              <span className="breadcrumb-separator">›</span>
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

          {/* Date Range Filter */}
          <div className="date-range-filter">
            <span className="date-range-label">- Date Range:</span>
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

          <div className="attendance-content">
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
                      {/* ✅ Formatted date */}
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

            {/* Action Buttons */}
            <div className="attendance-actions">
              <button className="add-leave-btn">
                + Add Leave
              </button>
              <button className="filter-btn">
                Filter !!!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceLeave;
