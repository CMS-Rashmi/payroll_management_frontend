import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";


/** --- Mock Data --- */
const REQUESTS = [
  {
    id: 1,
  
    name: "Kevin Perera",
    department: "Finance Department",
    appliedDate: "2025-09-25",
    requestedDate: "2025-10-02",
    category: "Annual Leave",
    dayType: "Half Day",
    reason: "Family trip",
    status: "Pending",
  },
  {
    id: 2,
    
    name: "Nadeesha Fernando",
    department: "HR Department",
    appliedDate: "2025-09-27",
    requestedDate: "2025-10-05",
    category: "Casual Leave",
    dayType: "Full Day",
    reason: "Medical appointment",
    status: "Pending",
  },
  {
    id: 3,
    
    name: "Malith Jayasooriya",
    department: "IT Department",
    appliedDate: "2025-09-30",
    requestedDate: "2025-10-06",
    category: "Annual Leave",
    dayType: "Half Day",
    reason: "Urgent personal work",
    status: "Pending",
  },
  {
    id: 4,
    
    name: "Sachini Rathnayake",
    department: "Marketing Department",
    appliedDate: "2025-10-01",
    requestedDate: "2025-10-10",
    category: "Sick Leave",
    dayType: "Full Day",
    reason: "Medical leave",
    status: "Pending",
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

  /** Modal State */
  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState("Approve");
  const [comment, setComment] = useState("");
  const [rejectComment, setRejectComment] = useState("");

  /** Filtering logic */
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

  /** Stats */
  const stats = {
    total: REQUESTS.length,
    pending: REQUESTS.filter((r) => r.status === "Pending").length,
    approved: REQUESTS.filter((r) => r.status === "Approved").length,
    rejected: REQUESTS.filter((r) => r.status === "Rejected").length,
  };

  /** Handlers */
  const closeModal = () => {
    setSelected(null);
    setAction("Approve");
    setComment("");
    setRejectComment("");
  };

  const handleSend = () => {
    if (action === "Reject" && !rejectComment.trim()) {
      alert("Please enter a reject comment before sending.");
      return;
    }
    alert(
      `Action: ${action} for ${selected?.name}\n${
        action === "Reject" ? `Reject Reason: ${rejectComment}` : `Comment: ${comment || "N/A"}`
      }`
    );
    closeModal();
  };

  const onExportCSV = () => {
    const headers = [
      "Employee Code",
      "Name",
      "Department",
      "Applied Date",
      "Requested Date",
      "Category",
      "Day Type",
      "Reason",
      "Status",
    ];
    const csvRows = filtered.map((r) => [
      r.empCode,
      r.name,
      r.department,
      r.appliedDate,
      r.requestedDate,
      r.category,
      r.dayType,
      r.reason,
      r.status,
    ]);
    const csv = [headers, ...csvRows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leave_requests.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="app-shell">
      <div className="app-sidebar">
        <Sidebar />
      </div>

      <div className="app-main">
        <div className="app-topbar">
          <Header />
        </div>

        <div className="app-content">
          {/* Breadcrumb + Header */}
          <div className="page-header">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Leave Management</span>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-item active">Leave Request</span>
            </div>
            <h1 className="page-title">Leave Request</h1>
          </div>

          {/* Tabs */}
          <div className="card" style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {tabs.map((t) => (
              <button
                key={t.path}
                className={`btn ${location.pathname === t.path ? "btn-primary" : "btn-soft"}`}
                onClick={() => navigate(t.path)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Statistics */}
          <div className="grid-4" style={{ marginBottom: "16px" }}>
            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: "var(--muted)" }}>Total Requests</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--brand)" }}>
                {stats.total}
              </div>
            </div>
            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: "var(--muted)" }}>Pending</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#f59e0b" }}>
                {stats.pending}
              </div>
            </div>
            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: "var(--muted)" }}>Approved</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--success)" }}>
                {stats.approved}
              </div>
            </div>
            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: "var(--muted)" }}>Rejected</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--danger)" }}>
                {stats.rejected}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card">
            <div className="grid-4" style={{ alignItems: "end", marginBottom: "12px" }}>
              <div>
                <label>Search</label>
                <input
                  className="input"
                  placeholder="Search by Employee or Code"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label>Applied Date</label>
                <input
                  className="input"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              <div>
                <label>Category</label>
                <select
                  className="select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option>All Categories</option>
                  <option>Annual Leave</option>
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                </select>
              </div>
              <div>
                <label>Department</label>
                <select
                  className="select"
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                >
                  <option>All Departments</option>
                  <option>Finance Department</option>
                  <option>HR Department</option>
                  <option>IT Department</option>
                  <option>Marketing Department</option>
                </select>
              </div>
            </div>

            <div className="grid-2" style={{ alignItems: "end" }}>
              <div>
                <label>Status</label>
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
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button className="btn btn-soft" onClick={() => window.location.reload()}>
                  Clear
                </button>
                <button className="btn btn-primary" onClick={onExportCSV}>
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <div className="card" style={{ padding: 0 }}>
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border)",
                  fontWeight: "700",
                }}
              >
                Leave Requests ({filtered.length})
              </div>
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
                    filtered.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <strong>{r.name}</strong>
                          <div style={{ fontSize: "12px", color: "var(--muted)" }}>{r.empCode}</div>
                        </td>
                        <td>{r.department}</td>
                        <td>{formatDate(r.appliedDate)}</td>
                        <td>{formatDate(r.requestedDate)}</td>
                        <td>{r.category}</td>
                        <td>{r.dayType}</td>
                        <td>{r.reason}</td>
                        <td>{r.status}</td>
                        <td>
                          <button className="btn btn-soft" onClick={() => setSelected(r)}>
                            Process
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ textAlign: "center", padding: "30px", color: "var(--muted)" }}>
                        No leave requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal */}
          {selected && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "8px",
                  width: "90%",
                  maxWidth: "600px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  padding: "20px",
                }}
              >
                <h2 style={{ marginBottom: "12px" }}>Process Leave Request</h2>
                <div className="grid-2" style={{ gap: "12px" }}>
                  <div>
                    <label>Employee</label>
                    <div>{selected.name}</div>
                  </div>
                  <div>
                    <label>Department</label>
                    <div>{selected.department}</div>
                  </div>
                  <div>
                    <label>Requested Date</label>
                    <div>{formatDate(selected.requestedDate)}</div>
                  </div>
                  <div>
                    <label>Leave Type</label>
                    <div>{selected.category}</div>
                  </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <label>Reason</label>
                  <div
                    style={{
                      background: "var(--soft)",
                      padding: "10px",
                      borderRadius: "6px",
                    }}
                  >
                    {selected.reason}
                  </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <label>Action</label>
                  <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                    {["Approve", "Communicate", "Reject"].map((a) => (
                      <label key={a}>
                        <input
                          type="radio"
                          name="action"
                          checked={action === a}
                          onChange={() => setAction(a)}
                        />{" "}
                        {a}
                      </label>
                    ))}
                  </div>
                </div>

                {action === "Reject" ? (
                  <div style={{ marginTop: "16px" }}>
                    <label>Reject Comment *</label>
                    <textarea
                      className="input"
                      rows="3"
                      value={rejectComment}
                      onChange={(e) => setRejectComment(e.target.value)}
                    />
                  </div>
                ) : (
                  <div style={{ marginTop: "16px" }}>
                    <label>Approver’s Comment</label>
                    <input
                      className="input"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
                  <button className="btn btn-soft" onClick={closeModal}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSend}>
                    Send {action}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
