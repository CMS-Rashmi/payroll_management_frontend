import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/LeaveCalendar.css";

/** Helpers */
const pad = (n) => String(n).padStart(2, "0");
const toKey = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const LeaveCalendar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Tabs
  const tabs = [
    { label: "Overview", path: "/employee-leaves" },
    { label: "Leave Approval", path: "/leave-approval" },
    { label: "Calendar", path: "/leave-calendar" },
    { label: "Leave Request", path: "/leave-request" },
  ];

  // Month navigation state
  const today = new Date();
  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(today.getMonth()); // 0-11

  // Assigned dates (mock)
  const [assigned, setAssigned] = useState([
    // Initial sample values
    { date: toKey(today.getFullYear(), today.getMonth() + 1, 5),  type: "special",    reason: "Wellness day" },
    { date: toKey(today.getFullYear(), today.getMonth() + 1, 12), type: "restricted", reason: "Company meeting" },
  ]);

  // State for modals
  const [pickFor, setPickFor] = useState(null);     // {y,m,d}
  const [reasonFor, setReasonFor] = useState(null); // {y,m,d,type}
  const [deleteFor, setDeleteFor] = useState(null); // {y,m,d}

  /** Month navigation handlers **/
  const goToPrevMonth = () => {
    setDisplayMonth((prev) => {
      if (prev === 0) {
        setDisplayYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const goToNextMonth = () => {
    setDisplayMonth((prev) => {
      if (prev === 11) {
        setDisplayYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // Build grid for selected month
  const grid = useMemo(() => {
    const first = new Date(displayYear, displayMonth, 1);
    const firstDay = first.getDay(); // 0=Sun ... 6=Sat
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    const prevDays = new Date(displayYear, displayMonth, 0).getDate();

    const cells = [];
    // Leading (previous month)
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevDays - i;
      // If January -> previous is December (month=11) of previous year
      const prevMonth = displayMonth === 0 ? 11 : displayMonth - 1;
      const prevYear = displayMonth === 0 ? displayYear - 1 : displayYear;
      cells.push({ y: prevYear, m: prevMonth, d, other: true });
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ y: displayYear, m: displayMonth, d, other: false });
    }
    // Trailing (next month)
    while (cells.length < 42) {
      const nextMonth = displayMonth === 11 ? 0 : displayMonth + 1;
      const nextYear = displayMonth === 11 ? displayYear + 1 : displayYear;
      const d = cells.length - (firstDay + daysInMonth) + 1;
      cells.push({ y: nextYear, m: nextMonth, d, other: true });
    }

    return cells;
  }, [displayYear, displayMonth]);

  // Fast lookup for assigned
  const assignedMap = useMemo(() => {
    const map = new Map();
    assigned.forEach((a) => map.set(a.date, a));
    return map;
  }, [assigned]);

  const getAssigned = (y, m, d) => assignedMap.get(toKey(y, m + 1, d));

  // Click handling
  const onCellClick = (cell) => {
    if (cell.other) return; // ignore clicks on other-month cells
    const existing = getAssigned(cell.y, cell.m, cell.d);
    if (existing) {
      setDeleteFor(cell);
      return;
    }
    setPickFor(cell);
  };

  const chooseType = (type) => {
    setReasonFor({ ...pickFor, type });
    setPickFor(null);
  };

  const saveReason = (reasonText) => {
    const { y, m, d, type } = reasonFor;
    const date = toKey(y, m + 1, d);
    setAssigned((prev) => [
      ...prev.filter((r) => r.date !== date),
      { date, type, reason: reasonText || "-" },
    ]);
    setReasonFor(null);
  };

  const confirmDelete = () => {
    const { y, m, d } = deleteFor;
    const date = toKey(y, m + 1, d);
    setAssigned((prev) => prev.filter((r) => r.date !== date));
    setDeleteFor(null);
  };

  // Assigned rows for current view
  const assignedRows = useMemo(() => {
    return assigned
      .filter((a) => {
        const d = new Date(a.date);
        return d.getFullYear() === displayYear && d.getMonth() === displayMonth;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [assigned, displayYear, displayMonth]);

  return (
    <div className="leaves-calendar-container">
      <Sidebar />
      <div className="leaves-calendar-content">
        <Header />

        {/* Header */}
        <header className="leaves-calendar-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Leave Management</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Calendar</span>
            </div>
            <h1 className="page-title">Date Restrictions</h1>
          </div>
        </header>

        {/* Tabs */}
        <div className="tab-bar">
          {tabs.map((t) => (
            <button
              key={t.path}
              className={`tab-link ${location.pathname === t.path ? "active" : ""}`}
              onClick={() => navigate(t.path)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Calendar */}
        <div className="calendar-wrap">
          <div className="calendar-card">
            <div className="calendar-nav">
              <button className="nav-btn" onClick={goToPrevMonth}>◀</button>
              <h3>{MONTHS[displayMonth]} {displayYear}</h3>
              <button className="nav-btn" onClick={goToNextMonth}>▶</button>
            </div>

            <div className="legend">
              <span><i className="legend-dot special" /> Special Day</span>
              <span><i className="legend-dot restricted" /> Restricted</span>
              <span className="muted">Other Month</span>
            </div>

            {/* Week header */}
            <div className="week-row head">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                <div key={d} className="cell head">{d}</div>
              ))}
            </div>

            {/* Grid */}
            <div className="weeks">
              {Array.from({ length: 6 }).map((_, r) => (
                <div key={r} className="week-row">
                  {grid.slice(r * 7, r * 7 + 7).map((c, idx) => {
                    const a = getAssigned(c.y, c.m, c.d);
                    const classes = [
                      "cell",
                      c.other ? "other" : "",
                      a?.type === "special" ? "special" : "",
                      a?.type === "restricted" ? "restricted" : "",
                    ].join(" ");
                    return (
                      <div key={idx} className={classes} onClick={() => onCellClick(c)}>
                        <div className="day">{c.d}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Assigned Dates Table */}
        <div className="assigned-card">
          <h3>All Assigned Dates</h3>
          <table className="assigned-table">
            <thead>
              <tr>
                <th>Assigned Date</th>
                <th>Date Type</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {assignedRows.length === 0 ? (
                <tr>
                  <td colSpan="3" className="empty">No data</td>
                </tr>
              ) : (
                assignedRows.map((row) => (
                  <tr key={row.date}>
                    <td>{row.date}</td>
                    <td>
                      <span className={`badge ${row.type}`}>
                        {row.type === "special" ? "Special Day" : "Restricted"}
                      </span>
                    </td>
                    <td>{row.reason || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pick Type Modal */}
        {pickFor && (
          <PickTypeModal
            onClose={() => setPickFor(null)}
            onChoose={chooseType}
          />
        )}

        {/* Reason Modal */}
        {reasonFor && (
          <ReasonModal
            label={reasonFor.type === "special" ? "Special Day" : "Restricted Date"}
            onCancel={() => setReasonFor(null)}
            onSave={saveReason}
          />
        )}

        {/* Delete Confirm Modal */}
        {deleteFor && (
          <DeleteModal
            date={toKey(deleteFor.y, deleteFor.m + 1, deleteFor.d)}
            onCancel={() => setDeleteFor(null)}
            onDelete={confirmDelete}
          />
        )}
      </div>
    </div>
  );
};

export default LeaveCalendar;

/* ---------- Sub-components ---------- */

function PickTypeModal({ onClose, onChoose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Please select the assigning date type</div>
        <div className="modal-row">
          <button className="btn special" onClick={() => onChoose("special")}>
            Special Day
          </button>
          <button className="btn restricted" onClick={() => onChoose("restricted")}>
            Restriction
          </button>
        </div>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}

function ReasonModal({ label, onCancel, onSave }) {
  const [val, setVal] = useState("");
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{label}</div>
        <div className="field">
          <label>Reason</label>
          <input
            className="input"
            placeholder="Add a short reason…"
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onCancel}>Cancel</button>
          <button className="btn primary" onClick={() => onSave(val || "-")}>
            Save
          </button>
        </div>
        <button className="modal-close" onClick={onCancel}>✕</button>
      </div>
    </div>
  );
}

function DeleteModal({ date, onCancel, onDelete }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Delete Restricted Date</div>
        <p className="confirm-text">Are you sure you want to delete this date?</p>
        <div className="delete-date">{date}</div>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onCancel}>Cancel</button>
          <button className="btn danger" onClick={onDelete}>Delete</button>
        </div>
        <button className="modal-close" onClick={onCancel}>✕</button>
      </div>
    </div>
  );
}
