import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/RoleManagement.css";

const RoleManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- Roles Data ---
  const [roles, setRoles] = useState([
    {
      name: "HR",
      description: "Full access to HR functions and user management",
      users: 3,
      permissions: "View Employee Data, Edit Employee Data",
    },
    {
      name: "Admin",
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
  ]);

  // --- Tabs ---
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

  // --- Search Filter State ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- Modal & Edit States ---
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [roleData, setRoleData] = useState({
    name: "",
    description: "",
    users: 0,
    permissions: "",
  });

  // --- Filtering Logic ---
  const filteredRoles = roles.filter((role) => {
    const term = searchTerm.toLowerCase();
    return (
      role.name.toLowerCase().includes(term) ||
      role.description.toLowerCase().includes(term) ||
      role.permissions.toLowerCase().includes(term)
    );
  });

  // --- Handle Add / Update Role ---
  const handleSaveRole = (e) => {
    e.preventDefault();

    if (!roleData.name.trim() || !roleData.description.trim()) return;

    if (isEditing && editingIndex !== null) {
      // Update existing role
      const updated = [...roles];
      updated[editingIndex] = roleData;
      setRoles(updated);
    } else {
      // Add new role
      setRoles([...roles, roleData]);
    }

    // Reset modal
    setShowModal(false);
    setIsEditing(false);
    setEditingIndex(null);
    setRoleData({ name: "", description: "", users: 0, permissions: "" });
  };

  // --- Handle Edit Button ---
  const handleEdit = (index) => {
    const selectedRole = roles[index];
    setRoleData(selectedRole);
    setIsEditing(true);
    setEditingIndex(index);
    setShowModal(true);
  };

  // --- Handle Delete ---
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      const updated = roles.filter((_, i) => i !== index);
      setRoles(updated);
    }
  };

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
            <button
              className="add-role-btn"
              onClick={() => {
                setIsEditing(false);
                setRoleData({ name: "", description: "", users: 0, permissions: "" });
                setShowModal(true);
              }}
            >
              + Add Role
            </button>
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
          <input
            type="text"
            placeholder="Search Roles (by name, description, or permissions)"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* --- Role Table --- */}
        <div className="role-table-section">
          {filteredRoles.length > 0 ? (
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
                {filteredRoles.map((r, i) => (
                  <tr key={i}>
                    <td><span className="role-name">{r.name}</span></td>
                    <td>{r.description}</td>
                    <td><span className="user-count">{r.users} users</span></td>
                    <td>{r.permissions}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn" onClick={() => handleEdit(i)}>
                          Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(i)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">No roles found matching your search.</div>
          )}

          <div className="table-footer">
            Showing {filteredRoles.length} of {roles.length} roles
          </div>
        </div>

        {/* --- Add/Edit Role Modal --- */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{isEditing ? "Edit Role" : "Add New Role"}</h2>
              <form onSubmit={handleSaveRole}>
                <label>
                  Role Name
                  <input
                    type="text"
                    name="name"
                    value={roleData.name}
                    onChange={(e) => setRoleData({ ...roleData, name: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Description
                  <textarea
                    name="description"
                    rows="3"
                    value={roleData.description}
                    onChange={(e) => setRoleData({ ...roleData, description: e.target.value })}
                    required
                  ></textarea>
                </label>

                <label>
                  Users (Count)
                  <input
                    type="number"
                    name="users"
                    value={roleData.users}
                    onChange={(e) => setRoleData({ ...roleData, users: Number(e.target.value) })}
                  />
                </label>

                <label>
                  Permissions (comma-separated)
                  <input
                    type="text"
                    name="permissions"
                    value={roleData.permissions}
                    onChange={(e) => setRoleData({ ...roleData, permissions: e.target.value })}
                  />
                </label>

                <div className="modal-actions">
                  <button type="submit" className="save-btn">
                    {isEditing ? "Update" : "Save"}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowModal(false);
                      setIsEditing(false);
                      setEditingIndex(null);
                      setRoleData({ name: "", description: "", users: 0, permissions: "" });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleManagement;
