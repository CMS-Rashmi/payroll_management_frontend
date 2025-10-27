import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/SecurityAccessControl.css";

const SecurityAccessControl = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Tabs navigation
  const tabs = [
    { label: "Security & Access Control", path: "/security-access-control" },
    { label: "User Management", path: "/user-management" },
    { label: "Role Management", path: "/role-management" },
    { label: "Access Control", path: "/access-control" },
    { label: "Security Logs", path: "/security-logs" },
    { label: "Audit Log", path: "/audit-log" },
    { label: "Encryption Status", path: "/encryption-status" },
    { label: "Backup & Recovery", path: "/backup-recovery" },
  ];

  // Recent activity data
  const activities = [
    { name: "Kamal Perera", action: "Updated user permissions", time: "2023-09-15 14:32:41" },
    { name: "Maneesha Gamage", action: "Created new role", time: "2023-09-15 11:15:22" },
    { name: "Admin", action: "System backup completed", time: "2023-09-15 14:32:41" },
    { name: "Admin", action: "Login from unrecognized location", time: "2023-09-15 03:00:00" },
  ];

  // ✅ Handlers for Quick Access card clicks
  const handleAddUser = () => navigate("/user-management");
  const handleAddRole = () => navigate("/role-management");
  const handleAccessControl = () => navigate("/access-control");

  return (
    <div className="security-container">
      <Sidebar />
      <div className="security-content">
        <Header />

        {/* --- Header --- */}
        <header className="security-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Administration</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Security & Access Control</span>
            </div>
            <h1 className="page-title">Security & Access Control</h1>
          </div>
        </header>

        {/* --- Tabs Navigation --- */}
        <div className="security-tabs">
          {tabs.map((t) => (
            <button
              key={t.label}
              className={`tab-btn ${location.pathname === t.path ? "active" : ""}`}
              onClick={() => navigate(t.path)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* --- Overview Section --- */}
        <div className="security-overview">
          <div className="box" onClick={() => navigate("/user-management")}>
            <div className="box-icon">👤</div>
            <div>
              <div className="box-stat">58</div>
              <p>View all users →</p>
            </div>
          </div>

          <div className="box active-box" onClick={() => navigate("/role-management")}>
            <div className="box-icon">🧑‍💼</div>
            <div>
              <div className="box-stat">4</div>
              <p>Manage roles →</p>
            </div>
          </div>

          <div className="box alert" onClick={() => navigate("/security-logs")}>
            <div className="box-icon">⚠️</div>
            <div>
              <div className="box-stat">2</div>
              <p>View alerts →</p>
            </div>
          </div>

          <div className="box encryption" onClick={() => navigate("/encryption-status")}>
            <div className="box-icon">🔒</div>
            <div>
              <div className="box-stat active-text">Active</div>
              <p>View details →</p>
            </div>
          </div>
        </div>

        {/* --- Quick Access --- */}
        <h3 className="section-title">Quick Access</h3>
        <div className="quick-access">
          <div className="quick-card" onClick={handleAddUser}>
            Add New User <span>Create user account</span>
          </div>

          <div className="quick-card" onClick={handleAddRole}>
            Add New Role <span>Define Permissions</span>
          </div>

          <div className="quick-card" onClick={handleAccessControl}>
            Access Control <span>Manage Permissions</span>
          </div>
        </div>

        {/* --- Recent Activities --- */}
        <h3 className="section-title">Recent Activities</h3>
        <div className="activity-list">
          {activities.map((a, i) => (
            <div key={i} className="activity-item">
              <div className="activity-left">
                <a href="#!" className="activity-name">{a.name}</a>
                <span className="activity-action">{a.action}</span>
              </div>
              <div className="activity-time">{a.time}</div>
            </div>
          ))}
          <div className="view-all">View all Activities →</div>
        </div>

        {/* --- System Status --- */}
        <h3 className="section-title">System Status</h3>
        <div className="system-status">
          <div className="status-row">
            <span>Last System Backup</span>
            <span>2023-09-15 03:00:00</span>
          </div>
          <div className="status-row">
            <span>Encryption Status</span>
            <span className="active">Active</span>
          </div>
          <div className="status-row">
            <span>Last Login Activity</span>
            <span>2023-09-15 14:32:41</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAccessControl;
