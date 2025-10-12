import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/PerformanceTraining.css';

const PerformanceTraining = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Performance & Training');

  const tabs = [
    'Overview',
    'Add Employee',
    'Attendance & Leave Records',
    'Performance & Training',
    'Documents & Contracts',
    'Audit Logs',
  ];

  const performanceData = [
    {
      id: 1,
      employee: 'Jeremy Neigh (EMP01)',
      department: 'Engineering - Senior Developer',
      rating: '4.5 ★',
      lastReview: '2023-06-15 by Michael Wilson',
      strengths: '• Technical expertise • Problem solving • Team collaboration',
      improvements: '• Documentation • Time management',
    },
    {
      id: 2,
      employee: 'Annette Black (EMP02)',
      department: 'Marketing - Manager',
      rating: '4.2 ★',
      lastReview: '2023-05-20 by Robert Johnson',
      strengths: '• Leadership • Communication • Strategic planning',
      improvements: '• Delegation',
    },
    {
      id: 3,
      employee: 'Theresa Webb (EMP03)',
      department: 'HR - Specialist',
      rating: '4.3 ★',
      lastReview: '2023-07-05 by Emily Davis',
      strengths: '• Conflict resolution • Policy knowledge • Recruitment',
      improvements: '• Technology adoption • Process improvement',
    },
  ];

  const trainingData = [
    {
      id: 1,
      employee: 'Jeremy Neigh (EMP01)',
      trainingCourse: 'Advanced React Development',
      status: 'Completed',
      dateRange: '2023-04-10 to 2023-04-15',
      score: '95%',
      certificate: 'Available',
    },
    {
      id: 2,
      employee: 'Annette Black (EMP02)',
      trainingCourse: 'Digital Marketing Masterclass',
      status: 'In Progress',
      dateRange: '2023-10-01 to 2023-11-15',
      score: 'N/A',
      certificate: 'Not Available',
    },
    {
      id: 3,
      employee: 'Theresa Webb (EMP03)',
      trainingCourse: 'HR Compliance Update 2023',
      status: 'Scheduled',
      dateRange: '2023-11-20 to 2023-11-22',
      score: 'N/A',
      certificate: 'Not Available',
    },
  ];

  // ✅ Helper to format dates into MM/DD/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return dateStr;

    // handle ranges like "2023-04-10 to 2023-04-15"
    if (dateStr.includes('to')) {
      const [start, end] = dateStr.split('to').map(d => d.trim());
      return `${formatDate(start)} to ${formatDate(end)}`;
    }

    // handle "date by reviewer"
    const [datePart, byPart] = dateStr.split(' by');
    const date = new Date(datePart);

    if (isNaN(date)) return dateStr; // if invalid date, return original

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return byPart ? `${month}/${day}/${year} by${byPart}` : `${month}/${day}/${year}`;
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'Overview') {
      navigate('/employee-info');
    } else if (tab === 'Add Employee') {
      navigate('/add-employee');
    } else if (tab === 'Attendance & Leave Records') {
      navigate('/attendance-leave');
    } else if (tab === 'Documents & Contracts') {
      navigate('/documents-contracts');
    } else if (tab === 'Audit Logs') {
      navigate('/audit-logs');
    }
  };

  const handleAddPerformanceReview = () => {
    alert('Add Performance Review functionality coming soon!');
  };

  const handleScheduleTraining = () => {
    alert('Schedule Training functionality coming soon!');
  };

  return (
    <div className="performance-training-container">
      <Sidebar />

      <div className="performance-training-content">
        {/* Header */}
        <header className="performance-training-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Employee Information Management</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Performance & Training</span>
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
          {tabs.map((tab) => (
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
        <div className="performance-training-main-content">
          <div className="section-header">
            <h2>Performance & Training</h2>
          </div>

          {/* Performance Ratings */}
          <div className="performance-section">
            <div className="subsection-header-with-button">
              <h3 className="subsection-header">Performance Ratings</h3>
              <button className="add-performance-btn" onClick={handleAddPerformanceReview}>
                + Add Performance Review
              </button>
            </div>

            <div className="table-container">
              <table className="performance-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department / Position</th>
                    <th>Rating</th>
                    <th>Last Review</th>
                    <th>Strengths</th>
                    <th>Improvements</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.employee}</td>
                      <td>{item.department}</td>
                      <td><span className="rating-stars">{item.rating}</span></td>
                      <td>{formatDate(item.lastReview)}</td> {/* ✅ formatted */}
                      <td>{item.strengths}</td>
                      <td>{item.improvements}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* Training Records */}
          <div className="training-section">
            <div className="subsection-header-with-button">
              <h3 className="subsection-header">Training Records</h3>
              <button className="schedule-training-btn" onClick={handleScheduleTraining}>
                + Assign New Training
              </button>
            </div>

            <div className="table-container">
              <table className="training-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Training Course</th>
                    <th>Status</th>
                    <th>Date Range</th>
                    <th>Score</th>
                    <th>Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.employee}</td>
                      <td>{item.trainingCourse}</td>
                      <td>
                        <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{formatDate(item.dateRange)}</td> {/* ✅ formatted */}
                      <td>{item.score}</td>
                      <td>{item.certificate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTraining;
