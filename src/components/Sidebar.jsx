import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../components/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false); // ✅ Added: to handle hover expand/collapse

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { id: 'employee-information', label: 'Employee Information', icon: '👤', path: '/employee-info' },
    { id: 'salary-compensation', label: 'Salary Compensation', icon: '💰', path: '/earnings' },
    { id: 'payroll-processing', label: 'Payroll Processing', icon: '📊', path: '/payroll-processing' },
    {
      id: 'time-attendance',
      label: 'Time & Attendance',
      icon: '⏰',
      path: '/time-attendance',
      hasSubmenu: true,
      submenu: [
        { label: 'Attendance', path: '/attendance-overview' },
        { label: 'Leave', path: '/employee-leaves' },
      ],
    },
    { id: 'compliance-reporting', label: 'Compliance & Reporting', icon: '📋', path: '/compliance-reporting' },
    { id: 'report-analytics', label: 'Report & Analytics', icon: '📈', path: '/report-analytics' },
    { id: 'administration', label: 'Administration', icon: '⚙️', path: '/administration', hasSubmenu: true },
    { id: 'security-access-control', label: 'Security & Access', icon: '🔒', path: '/security-access-control' },
  ];

  const employeeInfoPaths = [
    '/employee-info', '/add-employee', '/attendance-leave', '/performance-training', '/documents-contracts', '/audit-logs'
  ];

  const salaryCompensationPaths = [
    '/earnings', '/deductions', '/allowances', '/overtime-adjustments', '/compensation-adjustment', '/net-salary-summary'
  ];

  const getActiveItem = () => {
    const currentPath = location.pathname;
    if (employeeInfoPaths.some(p => currentPath.startsWith(p))) return 'employee-information';
    if (salaryCompensationPaths.some(p => currentPath.startsWith(p))) return 'salary-compensation';
    if (currentPath.startsWith('/attendance-overview') || currentPath.startsWith('/leave')) return 'time-attendance';
    return menuItems.find(item => currentPath === item.path)?.id || 'dashboard';
  };

  const activeItem = getActiveItem();

  const handleItemClick = (path) => navigate(path);

  const toggleSubmenu = (id) => setOpenSubmenu(openSubmenu === id ? null : id);

  const handleLogout = () => navigate('/');

  return (
    <div
      className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`} // ✅ dynamic class
      onMouseEnter={() => setIsExpanded(true)} // expand on hover
      onMouseLeave={() => setIsExpanded(false)} // collapse when leaving
    >
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
              onClick={() => {
                if (item.hasSubmenu) toggleSubmenu(item.id);
                else handleItemClick(item.path);
              }}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.hasSubmenu && (
                <span className="submenu-arrow">{openSubmenu === item.id ? '▲' : '▼'}</span>
              )}
            </div>

            {/* ✅ Render Submenu only when expanded */}
            {item.hasSubmenu && openSubmenu === item.id && item.submenu && isExpanded && (
              <div className="submenu">
                {item.submenu.map((sub) => (
                  <div
                    key={sub.path}
                    className={`submenu-item ${location.pathname === sub.path ? 'active' : ''}`}
                    onClick={() => handleItemClick(sub.path)}
                  >
                    {sub.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          🚪 <span className="logout-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;