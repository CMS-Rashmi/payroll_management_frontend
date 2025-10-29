import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/UserManagement.css";

const UserManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([
    { name: "Rashmi Jayathunga", email: "rashmi.jayathunga@company.com", role: "HR Admin", status: "Active", lastLogin: "2023-09-15 09:32:41" },
    { name: "Kamal Perera", email: "kamal.perera@company.com", role: "Finance", status: "Active", lastLogin: "2023-09-15 09:32:41" },
    { name: "Nimesha Fernando", email: "nimesha.fernando@company.com", role: "IT Support", status: "Inactive", lastLogin: "2023-09-15 09:32:41" },
    { name: "Sajini Weerasinghe", email: "sajini.weerasinghe@company.com", role: "Operations Manager", status: "Active", lastLogin: "2023-09-15 09:32:41" },
    { name: "Chathura Ranasinghe", email: "chathura.ranasinghe@company.com", role: "Marketing Executive", status: "Inactive", lastLogin: "2023-09-15 09:32:41" },
  ]);

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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // --- Modal States ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "HR Admin",
    status: "Active",
  });

  // --- Filtering Logic ---
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "All Roles" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "All Status" || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // --- Handle Add or Update User ---
  const handleAddUser = (e) => {
    e.preventDefault();

    if (isEditing && editingIndex !== null) {
      // Update existing user
      const updatedUsers = [...users];
      updatedUsers[editingIndex] = { ...newUser, lastLogin: users[editingIndex].lastLogin };
      setUsers(updatedUsers);
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      // Add new user
      const addedUser = { ...newUser, lastLogin: "Never" };
      setUsers([...users, addedUser]);
    }

    setShowAddModal(false);
    setNewUser({ name: "", email: "", role: "HR Admin", status: "Active" });
  };

  // --- Handle Edit ---
  const handleEdit = (index) => {
    setIsEditing(true);
    setEditingIndex(index);
    setNewUser({
      name: users[index].name,
      email: users[index].email,
      role: users[index].role,
      status: users[index].status,
    });
    setShowAddModal(true);
  };

  // --- Handle Delete ---
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((_, i) => i !== index);
      setUsers(updatedUsers);
    }
  };

  return (
    <div className="user-container">
      <Sidebar />
      <div className="user-content">
        <Header />

        <header className="user-header">
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="subtitle">Manage user accounts and their access levels</p>
          </div>
        </header>

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

        <div className="user-filter-bar">
          <input
            className="search-box"
            placeholder="Search Users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="filter-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option>All Roles</option>
            <option>HR Admin</option>
            <option>Finance</option>
            <option>IT Support</option>
            <option>Operations Manager</option>
            <option>Marketing Executive</option>
          </select>

          <select
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button className="add-user-btn" onClick={() => {
            setIsEditing(false);
            setShowAddModal(true);
            setNewUser({ name: "", email: "", role: "HR Admin", status: "Active" });
          }}>
            + Add User
          </button>
        </div>

        <div className="user-table-section">
          {filteredUsers.length > 0 ? (
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
                {filteredUsers.map((u, i) => (
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
                      <button className="edit-btn" onClick={() => handleEdit(i)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(i)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">No users found matching your filters.</div>
          )}
          <div className="table-footer">
            Showing {filteredUsers.length} of {users.length} results
          </div>
        </div>

        {/* --- Add/Edit Modal --- */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{isEditing ? "Edit User" : "Add New User"}</h2>
              <form onSubmit={handleAddUser}>
                <label>
                  Full Name
                  <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Email Address
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Role
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option>HR Admin</option>
                    <option>Finance</option>
                    <option>IT Support</option>
                    <option>Operations Manager</option>
                    <option>Marketing Executive</option>
                  </select>
                </label>
                <label>
                  Status
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </label>
                <div className="modal-actions">
                  <button type="submit" className="save-btn">
                    {isEditing ? "Update" : "Save"}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowAddModal(false);
                      setIsEditing(false);
                      setEditingIndex(null);
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

export default UserManagement;
