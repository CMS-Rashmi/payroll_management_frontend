import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/LeaveRequest.css";

/** --- Mock data (replace with API later) --- */
const REQUESTS = [
  {
    id: 1,
    empCode: "1",
    name: "Kevin Perera",
    department: "N/A",
    appliedDate: "2025-09-25",
    requestedDate: "2025-10-02",
    category: "Annual Leave",
    dayType: "Half Day",
    reason: "Family trip",
  },
  {
    id: 2,
    empCode: "2",
    name: "Nadeesha Fernando",
    department: "N/A",
    appliedDate: "2025-09-27",
    requestedDate: "2025-10-05",
    category: "Casual Leave",
    dayType: "Full Day",
    reason: "Medical",
  },
  {
    id: 3,
    empCode: "3",
    name: "Malith Jayasooriya",
    department: "N/A",
    appliedDate: "2025-09-30",
    requestedDate: "2025-10-06",
    category: "Annual Leave",
    dayType: "Half Day",
    reason: "Urgent work",
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
  const [q, setQ] = useState("");
  const [date, setDate] = useState("");
  const [cat, setCat] = useState("All Categories");
  const [dept, setDept] = useState("All Departments");

  const filtered = useMemo(() => {
    return REQUESTS.filter((r) => {
      const m1 =
        !q ||
        r.empCode.toLowerCase().includes(q.toLowerCase()) ||
        r.name.toLowerCase().includes(q.toLowerCase());
      const m2 = !date || r.appliedDate === date;
      const m3 = cat === "All Categories" || r.category === cat;
      const m4 = dept === "All Departments" || r.department === dept;
      return m1 && m2 && m3 && m4;
    });
  }, [q, date, cat, dept]);

  /** Modal state */
  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState("Approve");
  const [comment, setComment] = useState(""); // Approver comment
  const [rejectComment, setRejectComment] = useState(""); // Only if Reject selected

  const closeModal = () => {
    setSelected(null);
    setAction("Approve");
    setComment("");
    setRejectComment("");
  };

  const onSend = () => {
    if (action === "Reject" && !rejectComment.trim()) {
      alert("Please enter a reject comment before sending.");
      return;
    }
    alert(
      `Sent: ${action} for ${selected?.name}\nComment: ${
        action === "Reject" ? rejectComment : comment || "N/A"
      }`
    );
    closeModal();
  };

  const onExportCSV = () => {
    alert("Export to CSV clicked");
  };

  return (
    <div className="leave-request-container">
      <Sidebar />
      <div className="leave-request-content">
        <Header />

        {/* Header */}
        <header className="leave-request-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Leave Management</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Leave Request</span>
            </div>
            <h1 className="page-title">Leave Request</h1>
          </div>
        </header>

        {/* Tabs */}
        <div className="tab-bar">
          {tabs.map((t) => (
            <button
              key={t.path}
              className={`tab-link ${
                location.pathname === t.path ? "active" : ""
              }`}
              onClick={() => navigate(t.path)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Statistics */}
        <div className="stats-strip">
          <div className="stat">
            <div className="stat-icon received" />
            <div>
              <div className="stat-value">5</div>
              <div className="stat-label">Received Leave Requests</div>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon accepted" />
            <div>
              <div className="stat-value">3</div>
              <div className="stat-label">Accepted Leave Requests</div>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon rejected" />
            <div>
              <div className="stat-value">1</div>
              <div className="stat-label">Rejected Leave Requests</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="leave-filters">
          <input
            className="filter-input"
            placeholder="Search by Employee No or Name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <input
            className="filter-input"
            type={date ? "date" : "text"}
            placeholder="MM/DD/YYYY"
            value={date}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
            onChange={(e) => setDate(e.target.value)}
          />
          <select
            className="filter-input"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
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

          <button className="export-btn" onClick={onExportCSV}>
            Export to CSV
          </button>
        </div>

        {/* Table */}
        <table className="leave-request-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Applied Date</th>
              <th>Leave Category</th>
              <th>Requested Date</th>
              <th>Reason</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-row">
                  No records found.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id}>
                  <td>{r.empCode}</td>
                  <td>{r.name}</td>
                  <td>{r.department}</td>
                  <td>{r.appliedDate}</td>
                  <td>{r.category}</td>
                  <td>{r.requestedDate}</td>
                  <td>{r.reason}</td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => setSelected(r)}
                    >
                      Send
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Modal */}
        {selected && (
          <div className="lr-modal-overlay" onClick={closeModal}>
            <div className="lr-modal" onClick={(e) => e.stopPropagation()}>
              <div className="lr-modal-head">
                <h3>Action</h3>
                <button className="lr-close-link" onClick={closeModal}>
                  Close
                </button>
              </div>

              <div className="lr-fields">
                <div className="lr-field">
                  <label>Employee ID:</label>
                  <input readOnly value={selected.empCode} />
                </div>
                <div className="lr-field">
                  <label>Employee Name:</label>
                  <input readOnly value={selected.name} />
                </div>
                <div className="lr-field">
                  <label>Department:</label>
                  <input readOnly value={selected.department} />
                </div>
                <div className="lr-field">
                  <label>Requested Date:</label>
                  <input readOnly value={selected.requestedDate} />
                </div>
                <div className="lr-field">
                  <label>Leave Category:</label>
                  <input readOnly value={selected.category} />
                </div>
                <div className="lr-field">
                  <label>Day Type:</label>
                  <input readOnly value={selected.dayType} />
                </div>
                <div className="lr-field lr-col-span-3">
                  <label>Reason:</label>
                  <input readOnly value={selected.reason} />
                </div>

                {/* Approver's Comment */}
                {action !== "Reject" && (
                  <div className="lr-field lr-col-span-3">
                    <label>Approver's Comment:</label>
                    <input
                      type="text"
                      placeholder="Enter your comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                )}

                {/* ✅ Reject Comment — only when Reject is selected */}
                {action === "Reject" && (
                  <div className="lr-field lr-col-span-3">
                    <label>Reject Comment:</label>
                    <textarea
                      rows="3"
                      placeholder="Enter reason for rejection..."
                      value={rejectComment}
                      onChange={(e) => setRejectComment(e.target.value)}
                    />
                  </div>
                )}

                {/* Action Radio */}
                <div className="lr-field lr-col-span-3">
                  <label>Action:</label>
                  <div className="lr-actions-inline">
                    <label className="lr-radio">
                      <input
                        type="radio"
                        name="lrAction"
                        checked={action === "Approve"}
                        onChange={() => setAction("Approve")}
                      />
                      <span>Approve</span>
                    </label>
                    <label className="lr-radio">
                      <input
                        type="radio"
                        name="lrAction"
                        checked={action === "Communicate"}
                        onChange={() => setAction("Communicate")}
                      />
                      <span>Communicate</span>
                    </label>
                    <label className="lr-radio">
                      <input
                        type="radio"
                        name="lrAction"
                        checked={action === "Reject"}
                        onChange={() => setAction("Reject")}
                      />
                      <span>Reject</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="lr-footer">
                <button className="lr-send-btn" onClick={onSend}>
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequest;
