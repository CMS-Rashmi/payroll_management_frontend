import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/LeaveApproval.css";

const LeaveApproval = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Set up tabs like Employee Leaves page
  const tabs = [
    { label: "Overview", path: "/employee-leaves" },
    { label: "Leave Approval", path: "/leave-approval" },
    { label: "Calendar", path: "/leave-calendar" },
    { label: "Leave Request", path: "/leave-request" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [deptFilter, setDeptFilter] = useState("All Departments");

  // ✅ Updated Mock Leave Data
  const leaveData = [
    {
      no: 1,
      name: "Kevin Perera",
      department: "Finance Department",
      appliedDate: "2025-09-25",
      category: "Annual Leave",
      requestedDate: "2025-10-02",
      reason: "Family trip",
      status: "APPROVED",
    },
    {
      no: 2,
      name: "Nadeesha Fernando",
      department: "HR Department",
      appliedDate: "2025-09-27",
      category: "Casual Leave",
      requestedDate: "2025-10-05",
      reason: "Medical",
      status: "NOT APPROVED",
    },
    {
      no: 3,
      name: "Malith Jayasooriya",
      department: "IT Department",
      appliedDate: "2025-09-30",
      category: "Casual Leave",
      requestedDate: "2025-10-06",
      reason: "Urgent work",
      status: "APPROVED",
    },
  ];

  // ✅ Filtered Results
  const filteredData = leaveData.filter((item) => {
    const matchesName =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      selectedDate === "" || item.appliedDate === selectedDate;
    const matchesCategory =
      categoryFilter === "All Categories" || item.category === categoryFilter;
    const matchesDept =
      deptFilter === "All Departments" || item.department === deptFilter;

    return matchesName && matchesDate && matchesCategory && matchesDept;
  });

  return (
    <div className="leave-approval-container">
      <Sidebar />
      <div className="leave-approval-content">
        <Header />

        {/* ✅ Page Header */}
        <header className="leave-approval-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Leave Management</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Leave Approval</span>
            </div>
            <h1 className="page-title">Leave Approval</h1>
          </div>
        </header>

        {/* ✅ TAB BAR */}
        <div className="tab-bar">
          {tabs.map((tab) => (
            <button
              key={tab.path}
              className={`tab-link ${
                location.pathname === tab.path ? "active" : ""
              }`}
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ✅ Filters */}
        <div className="leave-filters">
          <input
            type="text"
            className="filter-input"
            placeholder="Search by Employee Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <input
            type={selectedDate ? "date" : "text"}
            className="filter-input"
            placeholder="MM/DD/YYYY"
            value={selectedDate}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <select
            className="filter-input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option>All Categories</option>
            <option>Annual Leave</option>
            <option>Casual Leave</option>
          </select>

          <select
            className="filter-input"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option>All Departments</option>
            <option>IT Department</option>
            <option>HR Department</option>
            <option>Finance Department</option>
          </select>
        </div>

        {/* ✅ Table */}
        <table className="leave-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Applied Date</th>
              <th>Category</th>
              <th>Requested Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.no}</td>
                  <td>{item.name}</td>
                  <td>{item.department}</td>
                  <td>{item.appliedDate}</td>
                  <td>{item.category}</td>
                  <td>{item.requestedDate}</td>
                  <td>{item.reason}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        item.status === "APPROVED"
                          ? "approved"
                          : "not-approved"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-row">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveApproval;
