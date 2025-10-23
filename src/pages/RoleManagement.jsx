import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/RoleManagement.css";

const RoleManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const roles = [
    {
      name: "HR Admin",
      description: "Full access to HR functions and user management",
      users: 3,
      permissions: "View Employee Data, Edit Employee Data",
    },
    {
      name: "Finance",
      description: "Access to financial data and payroll processing",
      users: 2,
      permissions: "View Employee Data, Approve Payroll",
    },
    {
      name: "Employee",
      description: "Limited access to personal information only",
      users: 2,
      permissions: "View Personal Data",
    },
    {
      name: "Auditor",
      description: "Read-only access to all system data for audit purposes",
      users: 3,
      permissions: "View Employee Data, View Reports, Export Data",
    },
  ];

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

  return (
    <div className="role-container">
      <Sidebar />
      <div className="role-content">
        <Header />

        {/* --- Header --- */}
        <header className="role-header">
          <div className="header-left">
            <h1 className="page-title">Role Management</h1>
            <p className="subtitle">Manage system roles and their permissions</p>
          </div>
          <div className="header-right">
            <button className="add-role-btn">Add Role</button>
          </div>
        </header>

        {/* --- Tabs --- */}
        <div className="role-tabs">
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

        {/* --- Search Bar --- */}
        <div className="role-search-bar">
          <input type="text" placeholder="Search Roles" className="search-input" />
        </div>

        {/* --- Role Table --- */}
        <div className="role-table-section">
          <table className="role-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Description</th>
                <th>Users</th>
                <th>Permissions</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r, i) => (
                <tr key={i}>
                  <td>
                    <span className="role-name">{r.name}</span>
                  </td>
                  <td>{r.description}</td>
                  <td>
                    <span className="user-count">{r.users} users</span>
                  </td>
                  <td>{r.permissions}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="table-footer">
            Showing {roles.length} of {roles.length} roles
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
