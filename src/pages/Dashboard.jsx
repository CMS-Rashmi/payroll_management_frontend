import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');

  const handleNavigation = (itemId) => {
    setActiveMenuItem(itemId);
    console.log('Navigate to:', itemId);
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeItem={activeMenuItem} onNavigate={handleNavigation} />
      
      <div className="dashboard-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Employee Information Management</span>
            </div>
            <h1 className="page-title">Dashboard</h1>
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
          <button className="tab-btn active">Manage Employee</button>
          <button className="tab-btn">Attendance</button>
          <button className="tab-btn">Leave</button>
          <button className="tab-btn">salary and bonus</button>
          <button className="tab-btn">payroll process</button>
          <button className="tab-btn">payslip</button>
          <button className="tab-btn">Holiday Calendar</button>
          <button className="tab-btn">Reports</button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Left Column */}
          <div className="left-column">
            {/* Employee Info Card */}
            <div className="employee-card">
              <div className="employee-avatar"></div>
              <div className="employee-info">
                <h3>Nimal Perera</h3>
                <p>HR Manager</p>
              </div>
            </div>

            {/* Employee Details */}
            <div className="employee-details">
              <h4>Info</h4>
              <div className="detail-item">
                <span className="detail-icon">🏢</span>
                <div className="detail-text">
                  <span className="detail-label">HR</span>
                  <span className="detail-sublabel">Department</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">👤</span>
                <div className="detail-text">
                  <span className="detail-label">Human Resource Manager</span>
                  <span className="detail-sublabel">role</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">🆔</span>
                <div className="detail-text">
                  <span className="detail-label">CMS 129099</span>
                  <span className="detail-sublabel">Employee ID</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">📄</span>
                <div className="detail-text">
                  <span className="detail-label">200070301290</span>
                  <span className="detail-sublabel">NIC</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">🏦</span>
                <div className="detail-text">
                  <span className="detail-label">29049080</span>
                  <span className="detail-sublabel">Peoples Bank</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">💵</span>
                <div className="detail-text">
                  <span className="detail-label salary">$ 40,000</span>
                  <span className="detail-sublabel">Salary</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">⏰</span>
                <div className="detail-text">
                  <span className="detail-label">Regular</span>
                  <span className="detail-sublabel">Work Shift</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">📋</span>
                <div className="detail-text">
                  <span className="detail-label">Permanent</span>
                  <span className="detail-sublabel">type</span>
                </div>
              </div>
              
              <h4>Contact</h4>
              <div className="detail-item">
                <span className="detail-icon">✉️</span>
                <div className="detail-text">
                  <span className="detail-label">Email</span>
                  <span className="detail-sublabel">alwissuryatmaja@gmail.com</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">📱</span>
                <div className="detail-text">
                  <span className="detail-label">Phone</span>
                  <span className="detail-sublabel">+6282283386756</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Employees</h3>
                <div className="stat-number">1,200</div>
                <div className="stat-change positive">+2.00% From Last month</div>
              </div>
              
              <div className="stat-card">
                <h3>Projected Headcount</h3>
                <div className="stat-number">500</div>
                <div className="stat-change positive">+5 from current (495)</div>
              </div>
              
              <div className="stat-card">
                <h3>Ongoing Projects</h3>
                <div className="stat-number">10</div>
                <div className="stat-change neutral">This month</div>
              </div>
            </div>

            {/* Leave Cards */}
            <div className="leave-cards">
              <div className="leave-card green">
                <h4>Total Employees on Leave</h4>
                <div className="leave-number">34</div>
                <div className="leave-breakdown">
                  <span className="paid">Paid 11</span>
                  <span className="unpaid">Unpaid 4</span>
                </div>
              </div>
              
              <div className="leave-card blue">
                <h4>Pending Leave Requests</h4>
                <div className="leave-number">20</div>
                <div className="leave-breakdown">
                  <span className="paid">Paid 62</span>
                  <span className="unpaid">Unpaid 76</span>
                </div>
              </div>
              
              <div className="leave-card teal">
                <h4>Approved Leave Requests</h4>
                <div className="leave-number">87</div>
                <div className="leave-breakdown">
                  <span className="paid">Paid 50</span>
                  <span className="unpaid">Unpaid 51</span>
                </div>
              </div>
            </div>

            {/* Growth Cards */}
            <div className="growth-cards">
              <div className="growth-card">
                <h4>Avg. Salary Growth</h4>
                <div className="growth-percentage">+ 15.2 %</div>
                <p>Over past 24 months</p>
              </div>
              
              <div className="growth-card">
                <h4>Avg. Profit Growth</h4>
                <div className="growth-percentage">+ 15.2 %</div>
                <p>Over past 24 months</p>
              </div>
              
              <div className="growth-card">
                <h4>Avg. Salary Growth</h4>
                <div className="growth-percentage">+ 15.2 %</div>
                <p>Over past 24 months</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
              <div className="chart-container">
                <h4>Department-wise Salary Distribution</h4>
                <div className="chart-placeholder blue-chart">
                  <div className="chart-bars">
                    <div className="bar" style={{height: '60%'}}></div>
                    <div className="bar" style={{height: '80%'}}></div>
                    <div className="bar" style={{height: '100%'}}></div>
                    <div className="bar" style={{height: '45%'}}></div>
                    <div className="bar" style={{height: '55%'}}></div>
                  </div>
                  <div className="chart-labels">
                    <span>Engineering</span>
                    <span>Sales</span>
                    <span>Finance</span>
                  </div>
                </div>
              </div>
              
              <div className="chart-container">
                <h4>Department Budget Allocation</h4>
                <div className="chart-placeholder green-chart">
                  <div className="chart-bars">
                    <div className="bar green" style={{height: '90%'}}></div>
                    <div className="bar green" style={{height: '70%'}}></div>
                    <div className="bar green" style={{height: '85%'}}></div>
                    <div className="bar green" style={{height: '60%'}}></div>
                    <div className="bar green" style={{height: '75%'}}></div>
                  </div>
                  <div className="chart-labels">
                    <span>Engineering</span>
                    <span>Sales</span>
                    <span>Finance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;