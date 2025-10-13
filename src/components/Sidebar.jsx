import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../components/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { id: 'employee-information', label: 'Employee Information', icon: '👤', path: '/employee-info' },
    { id: 'salary-compensation', label: 'Salary Compensation', icon: '💰', path: '/earnings' },
    { id: 'payroll-processing', label: 'Payroll Processing', icon: '📊', path: '/payroll-processing' },
    { id: 'time-attendance', label: 'Time & Attendance', icon: '⏰', path: '/time-attendance', hasSubmenu: true },
    { id: 'compliance-reporting', label: 'Compliance & Reporting', icon: '📋', path: '/compliance-reporting' },
    { id: 'report-analytics', label: 'Report & Analytics', icon: '📈', path: '/report-analytics' },
    { id: 'administration', label: 'Administration', icon: '⚙️', path: '/administration', hasSubmenu: true },
    { id: 'security-access', label: 'Security & Access', icon: '🔒', path: '/security-access', hasSubmenu: true }
  ];

  const handleItemClick = (path) => {
    navigate(path);
  };

  // ✅ Group related paths
  const employeeInfoPaths = [
    '/employee-info', '/add-employee', '/attendance-leave', '/performance-training', '/documents-contracts', '/audit-logs'
  ];

  const salaryCompensationPaths = [
    '/earnings', '/deductions', '/allowances', '/overtime-adjustments', '/compensation-adjustment', '/net-salary-summary'
  ];

  // ✅ Determine active item
  const getActiveItem = () => {
    const currentPath = location.pathname;
    if (employeeInfoPaths.some(p => currentPath.startsWith(p))) return 'employee-information';
    if (salaryCompensationPaths.some(p => currentPath.startsWith(p))) return 'salary-compensation';
    return menuItems.find(item => currentPath === item.path)?.id || 'dashboard';
  };

  const activeItem = getActiveItem();

  // ✅ Handle Logout
  const handleLogout = () => {
    // You can clear localStorage/sessionStorage here if needed
    // localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="cms-logo">
          <div className="logo-icon">CMS</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.id} className="nav-item-container">
            <div
              className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => handleItemClick(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.hasSubmenu && <span className="submenu-arrow">▼</span>}
            </div>
          </div>
        ))}
      </nav>

      {/* ✅ Logout Button at the Bottom */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
