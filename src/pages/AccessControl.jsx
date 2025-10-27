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

  // --- Permission Data ---
  const [permissions, setPermissions] = useState([
    { name: "View Employee Data", hr: true, finance: false, employee: false, auditor: true },
    { name: "Edit Employee Data", hr: false, finance: true, employee: false, auditor: false },
    { name: "Approve Payroll", hr: true, finance: true, employee: false, auditor: false },
    { name: "Delete Records", hr: true, finance: false, employee: false, auditor: false },
    { name: "Manage User Accounts", hr: true, finance: false, employee: false, auditor: false },
    { name: "Export Data", hr: true, finance: false, employee: false, auditor: true },
    { name: "Import Data", hr: true, finance: false, employee: false, auditor: false },
  ]);

  // --- Role Data ---
  const [roles, setRoles] = useState([
    { name: "HR Admin", desc: "Full access to HR functions and user management" },
    { name: "Finance", desc: "Access to financial data and payroll processing" },
    { name: "Employee", desc: "Limited access to personal information only" },
    { name: "Auditor", desc: "Read-only access to all system data for audit purposes" },
  ]);

  // --- Modal States ---
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // --- Add/Edit Mode ---
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // --- New Permission Form ---
  const [newPermission, setNewPermission] = useState({
    name: "",
    hr: false,
    finance: false,
    employee: false,
    auditor: false,
  });

  // --- New Role Form ---
  const [newRole, setNewRole] = useState({
    name: "",
    desc: "",
  });

  // --- Toggle Checkboxes ---
  const handleToggle = (permIndex, role) => {
    const updated = [...permissions];
    updated[permIndex][role] = !updated[permIndex][role];
    setPermissions(updated);
  };

  // --- Save Permissions Changes ---
  const handleSave = () => {
    alert("Changes saved successfully!");
  };

  // --- Add New Permission ---
  const handleAddPermission = (e) => {
    e.preventDefault();
    if (newPermission.name.trim() === "") return alert("Please enter a permission name.");

    setPermissions([...permissions, newPermission]);
    setNewPermission({ name: "", hr: false, finance: false, employee: false, auditor: false });
    setShowPermissionModal(false);
  };

  // --- Add or Edit Role ---
  const handleAddOrEditRole = (e) => {
    e.preventDefault();
    if (newRole.name.trim() === "" || newRole.desc.trim() === "")
      return alert("Please fill in all fields.");

    let updatedRoles = [...roles];

    if (isEditing && editIndex !== null) {
      // Update existing role
      updatedRoles[editIndex] = newRole;
    } else {
      // Add new role
      updatedRoles.push(newRole);
    }

    setRoles(updatedRoles);
    setNewRole({ name: "", desc: "" });
    setShowRoleModal(false);
    setIsEditing(false);
    setEditIndex(null);
  };

  // --- Open Edit Role Modal ---
  const handleEditRole = (index) => {
    setNewRole({ ...roles[index] });
    setEditIndex(index);
    setIsEditing(true);
    setShowRoleModal(true);
  };

  // --- Delete Role ---
  const handleDeleteRole = (index) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the role "${roles[index].name}"?`
    );
    if (confirmDelete) {
      const updatedRoles = roles.filter((_, i) => i !== index);
      setRoles(updatedRoles);
    }
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

        {/* --- Permissions Section --- */}
        <section className="permissions-section">
          <div className="permissions-header">
            <div>
              <h3 className="permissions-title">Role Permissions</h3>
              <p className="permissions-subtitle">
                Configure what each role can access and modify in the system
              </p>
            </div>
            <button className="add-permission-btn" onClick={() => setShowPermissionModal(true)}>
              + Add Permission
            </button>
          </div>

          <table className="permissions-table">
            <thead>
              <tr>
                <th>Permission / Role</th>
                <th>HR</th>
                <th>Finance</th>
                <th>Employee</th>
                <th>Auditor</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p, i) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td>
                    <label className="switch">
                      <input type="checkbox" checked={p.hr} onChange={() => handleToggle(i, "hr")} />
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
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </section>

        {/* --- Role Management Section --- */}
        <section className="role-management-section">
          <div className="role-management-header">
            <div>
              <h3 className="role-management-title">Role Management</h3>
              <p className="role-management-subtitle">Create and modify user roles</p>
            </div>
            <button
              className="add-role-btn"
              onClick={() => {
                setNewRole({ name: "", desc: "" });
                setIsEditing(false);
                setShowRoleModal(true);
              }}
            >
              + Add New Role
            </button>
          </div>

          <div className="role-list">
            {roles.map((r, i) => (
              <div className="role-item" key={i}>
                <div>
                  <div className="role-title">{r.name}</div>
                  <div className="role-desc">{r.desc}</div>
                </div>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEditRole(i)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteRole(i)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* === Add Permission Modal === */}
        {showPermissionModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Add New Permission</h2>
              <form onSubmit={handleAddPermission}>
                <label>
                  Permission Name
                  <input
                    type="text"
                    value={newPermission.name}
                    onChange={(e) =>
                      setNewPermission({ ...newPermission, name: e.target.value })
                    }
                    placeholder="Enter permission name"
                    required
                  />
                </label>

                <label className="checkbox-group">
                  <span>Assign to Roles:</span>
                  <div className="role-checkboxes">
                    {["hr", "finance", "employee", "auditor"].map((roleKey) => (
                      <label key={roleKey}>
                        <input
                          type="checkbox"
                          checked={newPermission[roleKey]}
                          onChange={() =>
                            setNewPermission({
                              ...newPermission,
                              [roleKey]: !newPermission[roleKey],
                            })
                          }
                        />{" "}
                        {roleKey.charAt(0).toUpperCase() + roleKey.slice(1)}
                      </label>
                    ))}
                  </div>
                </label>

                <div className="modal-actions">
                  <button type="submit" className="save-btn">
                    Save
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowPermissionModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* === Add/Edit Role Modal === */}
        {showRoleModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{isEditing ? "Edit Role" : "Add New Role"}</h2>
              <form onSubmit={handleAddOrEditRole}>
                <label>
                  Role Name
                  <input
                    type="text"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    placeholder="Enter role name"
                    required
                  />
                </label>

                <label>
                  Description
                  <textarea
                    rows="3"
                    value={newRole.desc}
                    onChange={(e) => setNewRole({ ...newRole, desc: e.target.value })}
                    placeholder="Enter role description"
                    required
                  ></textarea>
                </label>

                <div className="modal-actions">
                  <button type="submit" className="save-btn">
                    {isEditing ? "Update" : "Save"}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowRoleModal(false);
                      setIsEditing(false);
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

export default AccessControl;
