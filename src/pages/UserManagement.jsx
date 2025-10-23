import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/UserManagement.css";

const UserManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const users = [
    { name: "Rashmi Jayathunga", email: "rashmi.jayathunga@company.com", role: "HR Admin", status: "Active", lastLogin: "2023-09-15 09:32:41" },
    { name: "Kamal Perera", email: "kamal.perera@company.com", role: "Finance", status: "Active", lastLogin: "2023-09-15 09:32:41" },
    { name: "Nimesha Fernando", email: "nimesha.fernando@company.com", role: "IT Support", status: "Inactive", lastLogin: "2023-09-15 09:32:41" },
    { name: "Sajini Weerasinghe", email: "sajini.weerasinghe@company.com", role: "Operations Manager", status: "Active", lastLogin: "2023-09-15 09:32:41" },
    { name: "Chathura Ranasinghe", email: "chathura.ranasinghe@company.com", role: "Marketing Executive", status: "Inactive", lastLogin: "2023-09-15 09:32:41" },
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
    <div className="user-container">
      <Sidebar />
      <div className="user-content">
        <Header />

        {/* Header */}
        <header className="user-header">
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="subtitle">Manage user accounts and their access levels</p>
          </div>
        </header>

        {/* Tabs */}
        <div className="user-tabs">
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

        {/* Search + Filters + Add User (one line) */}
        <div className="user-filter-bar">
          <input className="search-box" placeholder="Search Users" />

          <select className="filter-select" defaultValue="All Roles">
            <option>All Roles</option>
            <option>HR Admin</option>
            <option>Finance</option>
            <option>IT Support</option>
            <option>Operations Manager</option>
            <option>Marketing Executive</option>
          </select>

          <select className="filter-select" defaultValue="All Status">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button className="add-user-btn">+ Add User</button>
        </div>

        {/* Table */}
        <div className="user-table-section">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th className="th-actions">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td>
                    <div className="user-name">{u.name}</div>
                    <div className="user-email">{u.email}</div>
                  </td>
                  <td>{u.role}</td>
                  <td className="td-center">
                    <span className={`status ${u.status === "Active" ? "active" : "inactive"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="td-mono">{u.lastLogin}</td>
                  <td className="action-buttons">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="table-footer">
            Showing 1 to {users.length} of {users.length} results
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
