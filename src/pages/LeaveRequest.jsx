// src/pages/LeaveRequest.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

/** --- Mock data (replace with API later) --- */
const REQUESTS = [
  {
    id: 1,
    empCode: "EMP001",
    name: "Kevin Perera",
    department: "Finance Department",
    appliedDate: "2025-09-25",
    requestedDate: "2025-10-02",
    category: "Annual Leave",
    dayType: "Half Day",
    reason: "Family trip",
    status: "Pending"
  },
  {
    id: 2,
    empCode: "EMP002",
    name: "Nadeesha Fernando",
    department: "HR Department",
    appliedDate: "2025-09-27",
    requestedDate: "2025-10-05",
    category: "Casual Leave",
    dayType: "Full Day",
    reason: "Medical appointment",
    status: "Pending"
  },
  {
    id: 3,
    empCode: "EMP003",
    name: "Malith Jayasooriya",
    department: "IT Department",
    appliedDate: "2025-09-30",
    requestedDate: "2025-10-06",
    category: "Annual Leave",
    dayType: "Half Day",
    reason: "Urgent personal work",
    status: "Pending"
  },
  {
    id: 4,
    empCode: "EMP004",
    name: "Sachini Rathnayake",
    department: "Marketing Department",
    appliedDate: "2025-10-01",
    requestedDate: "2025-10-10",
    category: "Sick Leave",
    dayType: "Full Day",
    reason: "Medical leave",
    status: "Pending"
  },
];

const LeaveRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /** Tabs */
  const tabs = [
    { label: "Overview", path: "/employee-leaves" },
    { label: "Leave Approval", path: "/leave-approval" },
    { label: "Calendar", path: "/leave-calendar" },
    { label: "Leave Request", path: "/leave-request" },
  ];

  /** Filters */
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  /** Modal state */
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [action, setAction] = useState("Approve");
  const [comment, setComment] = useState("");
  const [rejectComment, setRejectComment] = useState("");

  const filtered = useMemo(() => {
    return REQUESTS.filter((r) => {
      const matchesSearch =
        !searchTerm ||
        r.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !dateFilter || r.appliedDate === dateFilter;
      const matchesCategory = categoryFilter === "All Categories" || r.category === categoryFilter;
      const matchesDept = deptFilter === "All Departments" || r.department === deptFilter;
      const matchesStatus = statusFilter === "All Statuses" || r.status === statusFilter;
      return matchesSearch && matchesDate && matchesCategory && matchesDept && matchesStatus;
    });
  }, [searchTerm, dateFilter, categoryFilter, deptFilter, statusFilter]);

  const closeModal = () => {
    setSelectedRequest(null);
    setAction("Approve");
    setComment("");
    setRejectComment("");
  };

  const handleSend = () => {
    if (action === "Reject" && !rejectComment.trim()) {
      alert("Please enter a reject comment before sending.");
      return;
    }
    
    // In a real app, this would make an API call
    alert(
      `Action: ${action} for ${selectedRequest?.name}\n${
        action === "Reject" ? `Reject Reason: ${rejectComment}` : `Comment: ${comment || "N/A"}`
      }`
    );
    closeModal();
  };

  const onExportCSV = () => {
    const headers = ['Employee Code', 'Name', 'Department', 'Applied Date', 'Requested Date', 'Category', 'Day Type', 'Reason', 'Status'];
    const csvRows = filtered.map(r => [
      r.empCode,
      r.name,
      r.department,
      r.appliedDate,
      r.requestedDate,
      r.category,
      r.dayType,
      r.reason,
      r.status
    ]);
    
    const csv = [headers, ...csvRows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leave_requests.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter("");
    setCategoryFilter("All Categories");
    setDeptFilter("All Departments");
    setStatusFilter("All Statuses");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Statistics
  const stats = {
    total: REQUESTS.length,
    pending: REQUESTS.filter(r => r.status === "Pending").length,
    approved: REQUESTS.filter(r => r.status === "Approved").length,
    rejected: REQUESTS.filter(r => r.status === "Rejected").length,
  };

  return (
    <Layout>
      {/* Fixed Header Section */}
      <PageHeader
        breadcrumb={["Leave Management", "Leave Request"]}
        title="Leave Request"
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
<<<<<<< HEAD
            <option>All Categories</option>
            <option>Annual Leave</option>
            <option>Casual Leave</option>
          </select>
          <select
            className="filter-input"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          >
            <option>All Departments</option>
            <option>N/A</option>
            <option>IT Department</option>
            <option>HR Department</option>
          </select>

          <button
            className="apply-btn"
            onClick={() => {
              setQ('');
              setDate('');
              setDept("All Departments")
              setCat('All Categories');
            }}>
            Clear
          </button>

          <button className="export-btn" onClick={onExportCSV}>
            Export to CSV
=======
            {tab.label}
>>>>>>> dev-shanika
          </button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid-4" style={{ gap: "16px", marginBottom: "16px" }}>
        <div className="card" style={{ textAlign: 'center', padding: "16px" }}>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "4px" }}>Total Requests</div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--brand)" }}>
            {stats.total}
          </div>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: "16px" }}>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "4px" }}>Pending</div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--warn)" }}>
            {stats.pending}
          </div>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: "16px" }}>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "4px" }}>Approved</div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--success)" }}>
            {stats.approved}
          </div>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: "16px" }}>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "4px" }}>Rejected</div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--danger)" }}>
            {stats.rejected}
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="card">
        <div className="grid-4" style={{ alignItems: "end", marginBottom: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Search</label>
            <input
              className="input"
              placeholder="Search by Employee Code or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Applied Date</label>
            <input
              className="input"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
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
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button className="btn btn-soft" onClick={clearFilters}>
              Clear Filters
            </button>
            <button className="btn btn-primary" onClick={onExportCSV}>
              Export CSV
            </button>
          </div>
        </div>

        <div style={{ fontSize: "14px", color: "var(--muted)" }}>
          {filtered.length} leave request(s) found
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="table-container">
        <div className="card" style={{ padding: 0 }}>
          <div style={{ 
            padding: "12px 16px", 
            borderBottom: "1px solid var(--border)", 
            display: "flex", 
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ fontWeight: "700" }}>Leave Requests</div>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>
              Showing {filtered.length} records
            </div>
          </div>

          <div style={{ overflowX: "auto", flex: 1 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Applied Date</th>
                  <th>Requested Date</th>
                  <th>Category</th>
                  <th>Day Type</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((request) => (
                    <tr key={request.id}>
                      <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div className="user-avatar" />
                        <div>
                          <div style={{ fontWeight: "600" }}>{request.name}</div>
                          <div style={{ fontSize: "12px", color: "var(--muted)" }}>{request.empCode}</div>
                        </div>
                      </td>
                      <td>
                        <span className="pill" style={{ background: 'var(--soft)', color: 'var(--text)' }}>
                          {request.department}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px" }}>{formatDate(request.appliedDate)}</td>
                      <td style={{ fontSize: "12px", fontWeight: "600" }}>{formatDate(request.requestedDate)}</td>
                      <td>
                        <span className={`pill ${
                          request.category === "Annual Leave" ? "pill-ok" : 
                          request.category === "Casual Leave" ? "pill-soft" : 
                          "pill-warn"
                        }`}>
                          {request.category}
                        </span>
                      </td>
                      <td>
                        <span className={`pill ${
                          request.dayType === "Full Day" ? "pill-ok" : "pill-soft"
                        }`}>
                          {request.dayType}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px", color: "var(--muted)", maxWidth: "200px" }}>
                        {request.reason}
                      </td>
                      <td>
                        <span className={`pill ${
                          request.status === "Approved" ? "pill-ok" : 
                          request.status === "Rejected" ? "pill-danger" : 
                          "pill-warn"
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-soft"
                          onClick={() => setSelectedRequest(request)}
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                          Process
                        </button>
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

      {/* Process Leave Request Modal */}
      {selectedRequest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--panel)',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>Process Leave Request</h2>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: 'var(--muted)'
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px" }}>
              {/* Request Details */}
              <div className="grid-2" style={{ gap: "12px", marginBottom: "20px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Employee</label>
                  <div style={{ fontWeight: "600" }}>{selectedRequest.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--muted)" }}>{selectedRequest.empCode}</div>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Department</label>
                  <div>{selectedRequest.department}</div>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Requested Date</label>
                  <div style={{ fontWeight: "600" }}>{formatDate(selectedRequest.requestedDate)}</div>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Leave Type</label>
                  <div>{selectedRequest.category} • {selectedRequest.dayType}</div>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Reason</label>
                <div style={{ 
                  padding: "12px", 
                  background: "var(--soft)", 
                  borderRadius: "6px",
                  fontSize: "14px"
                }}>
                  {selectedRequest.reason}
                </div>
              </div>

              {/* Action Selection */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "8px" }}>Action</label>
                <div style={{ display: "flex", gap: "16px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="action"
                      value="Approve"
                      checked={action === "Approve"}
                      onChange={(e) => setAction(e.target.value)}
                    />
                    <span>Approve</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="action"
                      value="Communicate"
                      checked={action === "Communicate"}
                      onChange={(e) => setAction(e.target.value)}
                    />
                    <span>Communicate</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="action"
                      value="Reject"
                      checked={action === "Reject"}
                      onChange={(e) => setAction(e.target.value)}
                    />
                    <span>Reject</span>
                  </label>
                </div>
              </div>

              {/* Comment Field */}
              {action !== "Reject" && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                    Approver's Comment
                  </label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Enter your comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              )}

              {/* Reject Comment Field */}
              {action === "Reject" && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                    Reject Comment *
                  </label>
                  <textarea
                    className="input"
                    rows="3"
                    placeholder="Enter reason for rejection..."
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                    style={{ resize: "vertical" }}
                  />
                </div>
              )}

              {/* Modal Actions */}
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button 
                  className="btn btn-soft" 
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSend}
                >
                  Send {action}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default LeaveRequest;