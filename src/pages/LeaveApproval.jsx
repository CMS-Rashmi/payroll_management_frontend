// src/pages/LeaveApproval.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

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
  const [statusFilter, setStatusFilter] = useState("All Statuses");

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
      reason: "Medical appointment",
      status: "PENDING",
    },
    {
      no: 3,
      name: "Malith Jayasooriya",
      department: "IT Department",
      appliedDate: "2025-09-30",
      category: "Casual Leave",
      requestedDate: "2025-10-06",
      reason: "Urgent personal work",
      status: "APPROVED",
    },
    {
      no: 4,
      name: "Sachini Rathnayake",
      department: "Marketing Department",
      appliedDate: "2025-10-01",
      category: "Annual Leave",
      requestedDate: "2025-10-10",
      reason: "Vacation",
      status: "REJECTED",
    },
    {
      no: 5,
      name: "Dilshan Silva",
      department: "Operations Department",
      appliedDate: "2025-10-02",
      category: "Sick Leave",
      requestedDate: "2025-10-07",
      reason: "Medical leave",
      status: "PENDING",
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
    const matchesStatus =
      statusFilter === "All Statuses" || item.status === statusFilter;

    return matchesName && matchesDate && matchesCategory && matchesDept && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setCategoryFilter("All Categories");
    setDeptFilter("All Departments");
    setStatusFilter("All Statuses");
  };

  const handleApprove = (leaveNo) => {
    // In a real app, this would make an API call
    alert(`Leave request #${leaveNo} approved successfully!`);
  };

  const handleReject = (leaveNo) => {
    // In a real app, this would make an API call
    alert(`Leave request #${leaveNo} rejected.`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Layout>
      {/* Fixed Header Section */}
      <PageHeader
        breadcrumb={["Leave Management", "Leave Approval"]}
        title="Leave Approval"
      />

      {/* Tabs */}
      <div className="card" style={{ display: "flex", gap: "8px", overflowX: "auto", whiteSpace: "nowrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.path}
            className={`btn ${location.pathname === tab.path ? "btn-primary" : "btn-soft"}`}
            onClick={() => navigate(tab.path)}
            style={{ whiteSpace: "nowrap", flexShrink: 0 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters Card */}
      <div className="card">
        <div className="grid-4" style={{ alignItems: "end", marginBottom: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Search Employee</label>
            <input
              className="input"
              placeholder="Search by Employee Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Applied Date</label>
            <input
              className="input"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Category</label>
            <select 
              className="select" 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option>All Categories</option>
              <option>Annual Leave</option>
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Emergency Leave</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Department</label>
            <select 
              className="select" 
              value={deptFilter} 
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option>All Departments</option>
              <option>IT Department</option>
              <option>HR Department</option>
              <option>Finance Department</option>
              <option>Marketing Department</option>
              <option>Operations Department</option>
            </select>
          </div>
        </div>

        <div className="grid-2" style={{ alignItems: "end", marginBottom: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Status</label>
            <select 
              className="select" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>PENDING</option>
              <option>APPROVED</option>
              <option>REJECTED</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button className="btn btn-soft" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        <div style={{ fontSize: "14px", color: "var(--muted)" }}>
          {filteredData.length} leave request(s) found
        </div>
      </div>

      {/* Leave Approval Table */}
      <div className="table-container">
        <div className="card" style={{ padding: 0 }}>
          <div style={{ 
            padding: "12px 16px", 
            borderBottom: "1px solid var(--border)", 
            display: "flex", 
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ fontWeight: "700" }}>Leave Approval Requests</div>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>
              Showing {filteredData.length} records
            </div>
          </div>

          <div style={{ overflowX: "auto", flex: 1 }}>
            <table className="table">
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.no}>
                      <td>{item.no}</td>
                      <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div className="user-avatar" />
                        <div style={{ fontWeight: "600" }}>{item.name}</div>
                      </td>
                      <td>
                        <span className="pill" style={{ background: 'var(--soft)', color: 'var(--text)' }}>
                          {item.department}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px" }}>{formatDate(item.appliedDate)}</td>
                      <td>
                        <span className={`pill ${
                          item.category === "Annual Leave" ? "pill-ok" : 
                          item.category === "Casual Leave" ? "pill-soft" : 
                          "pill-warn"
                        }`}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px", fontWeight: "600" }}>{formatDate(item.requestedDate)}</td>
                      <td style={{ fontSize: "12px", color: "var(--muted)", maxWidth: "200px" }}>
                        {item.reason}
                      </td>
                      <td>
                        <span className={`pill ${
                          item.status === "APPROVED" ? "pill-ok" : 
                          item.status === "PENDING" ? "pill-warn" : 
                          "pill-danger"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {item.status === "PENDING" && (
                            <>
                              <button 
                                className="btn btn-soft" 
                                onClick={() => handleApprove(item.no)}
                                style={{ fontSize: "11px", padding: "4px 8px", background: "var(--success)", color: "white" }}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn btn-soft" 
                                onClick={() => handleReject(item.no)}
                                style={{ fontSize: "11px", padding: "4px 8px", background: "var(--danger)", color: "white" }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {item.status !== "PENDING" && (
                            <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                              Processed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                      No leave requests found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="grid-3" style={{ gap: "16px", marginTop: "16px" }}>
        <div className="card" style={{ textAlign: "center", padding: "16px" }}>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "4px" }}>Pending Requests</div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--warn)" }}>
            {leaveData.filter(item => item.status === "PENDING").length}
          </div>
        </div>
        
        <div className="card" style={{ textAlign: "center", padding: "16px" }}>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "4px" }}>Approved</div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--success)" }}>
            {leaveData.filter(item => item.status === "APPROVED").length}
          </div>
        </div>
        
        <div className="card" style={{ textAlign: "center", padding: "16px" }}>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "4px" }}>Rejected</div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--danger)" }}>
            {leaveData.filter(item => item.status === "REJECTED").length}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveApproval;