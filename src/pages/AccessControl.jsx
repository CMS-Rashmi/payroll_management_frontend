import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/AccessControl.css";

const AccessControl = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  // Permission data
  const [permissions, setPermissions] = useState([
    { name: "View Employee Data", hr: true, finance: false, employee: false, auditor: true },
    { name: "Edit Employee Data", hr: false, finance: true, employee: false, auditor: false },
    { name: "Approve Payroll", hr: true, finance: true, employee: false, auditor: false },
    { name: "Delete Records", hr: true, finance: false, employee: false, auditor: false },
    { name: "Manage User Accounts", hr: true, finance: false, employee: false, auditor: false },
    { name: "Export Data", hr: true, finance: false, employee: false, auditor: true },
    { name: "Import Data", hr: true, finance: false, employee: false, auditor: false },
  ]);

  const handleToggle = (permIndex, role) => {
    const updated = [...permissions];
    updated[permIndex][role] = !updated[permIndex][role];
    setPermissions(updated);
  };

  const handleSave = () => {
    alert("Changes saved successfully!");
  };

  return (
    <div className="access-container">
      <Sidebar />
      <div className="access-content">
        <Header />

        {/* Header Section */}
        <header className="access-header">
          <div>
            <h1 className="page-title">Access Control</h1>
            <p className="subtitle">Manage role-based permissions for system access</p>
          </div>
        </header>

        {/* Tabs Navigation */}
        <div className="access-tabs">
          {tabs.map((t) => (
            <button
              key={t.path}
              className={`tab-btn ${location.pathname === t.path ? "active" : ""}`}
              onClick={() => navigate(t.path)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Role Permissions Table */}
        <section className="permissions-section">
          <div className="permissions-header">
            <h3>Role Permissions</h3>
            <p>Configure what each role can access and modify in the system</p>
          </div>

          <table className="permissions-table">
            <thead>
              <tr>
                <th>Permission / Role</th>
                <th>Admin</th>
                <th>Supervisor</th>
                <th>Employee</th>
                <th>HR</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p, i) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={p.hr}
                        onChange={() => handleToggle(i, "hr")}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={p.finance}
                        onChange={() => handleToggle(i, "finance")}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={p.employee}
                        onChange={() => handleToggle(i, "employee")}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={p.auditor}
                        onChange={() => handleToggle(i, "auditor")}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="save-container">
            <button className="save-btn" onClick={handleSave}>Save Changes</button>
          </div>
        </section>

        {/* Role Management Section */}
        <section className="role-management-section">
          <h3 className="role-management-title">Role Management</h3>
          <p className="role-management-subtitle">Create and modify user roles</p>

          <div className="role-list">
            {[
              { name: "HR Admin", desc: "Full access to HR functions and user management" },
              { name: "Finance", desc: "Access to financial data and payroll processing" },
              { name: "Employee", desc: "Limited access to personal information only" },
              { name: "Auditor", desc: "Read-only access to all system data for audit purposes" },
            ].map((r, i) => (
              <div className="role-item" key={i}>
                <div>
                  <div className="role-title">{r.name}</div>
                  <div className="role-desc">{r.desc}</div>
                </div>
                <div className="action-buttons">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>

          <button className="add-role-btn">+ Add New Role</button>
        </section>
      </div>
    </div>
  );
};

export default AccessControl;
