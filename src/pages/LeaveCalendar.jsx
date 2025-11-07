import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";


/** Helpers */
const pad = (n) => String(n).padStart(2, "0");
const toKey = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const LeaveCalendar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Overview", path: "/employee-leaves" },
    { label: "Leave Approval", path: "/leave-approval" },
    { label: "Calendar", path: "/leave-calendar" },
    { label: "Leave Request", path: "/leave-request" },
  ];

  const today = new Date();
  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());

  const [assigned, setAssigned] = useState([
    { date: toKey(today.getFullYear(), today.getMonth() + 1, 5), type: "special", reason: "Wellness day" },
    { date: toKey(today.getFullYear(), today.getMonth() + 1, 12), type: "restricted", reason: "Company meeting" },
    { date: toKey(today.getFullYear(), today.getMonth() + 1, 25), type: "special", reason: "Public holiday" },
  ]);

  const [pickFor, setPickFor] = useState(null);
  const [reasonFor, setReasonFor] = useState(null);
  const [deleteFor, setDeleteFor] = useState(null);

  /** Month Navigation **/
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

  const goToToday = () => {
    setDisplayYear(today.getFullYear());
    setDisplayMonth(today.getMonth());
  };

  /** Grid Builder **/
  const grid = useMemo(() => {
    const first = new Date(displayYear, displayMonth, 1);
    const firstDay = first.getDay();
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    const prevDays = new Date(displayYear, displayMonth, 0).getDate();
    const cells = [];

    // previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevDays - i;
      const prevMonth = displayMonth === 0 ? 11 : displayMonth - 1;
      const prevYear = displayMonth === 0 ? displayYear - 1 : displayYear;
      cells.push({ y: prevYear, m: prevMonth, d, other: true });
    }
    // current month
    for (let d = 1; d <= daysInMonth; d++) cells.push({ y: displayYear, m: displayMonth, d, other: false });
    // next month
    while (cells.length < 42) {
      const nextMonth = displayMonth === 11 ? 0 : displayMonth + 1;
      const nextYear = displayMonth === 11 ? displayYear + 1 : displayYear;
      const d = cells.length - (firstDay + daysInMonth) + 1;
      cells.push({ y: nextYear, m: nextMonth, d, other: true });
    }
    return cells;
  }, [displayYear, displayMonth]);

  const assignedMap = useMemo(() => {
    const map = new Map();
    assigned.forEach((a) => map.set(a.date, a));
    return map;
  }, [assigned]);

  const getAssigned = (y, m, d) => assignedMap.get(toKey(y, m + 1, d));

  /** Click Handlers **/
  const onCellClick = (cell) => {
    if (cell.other) return;
    const existing = getAssigned(cell.y, cell.m, cell.d);
    if (existing) setDeleteFor(cell);
    else setPickFor(cell);
  };

  const chooseType = (type) => {
    setReasonFor({ ...pickFor, type });
    setPickFor(null);
  };

  const saveReason = (text) => {
    const { y, m, d, type } = reasonFor;
    const date = toKey(y, m + 1, d);
    setAssigned((prev) => [
      ...prev.filter((a) => a.date !== date),
      { date, type, reason: text || "-" },
    ]);
    setReasonFor(null);
  };

  const confirmDelete = () => {
    const { y, m, d } = deleteFor;
    const date = toKey(y, m + 1, d);
    setAssigned((prev) => prev.filter((a) => a.date !== date));
    setDeleteFor(null);
  };

  const assignedRows = useMemo(() => {
    return assigned
      .filter((a) => {
        const d = new Date(a.date);
        return d.getFullYear() === displayYear && d.getMonth() === displayMonth;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [assigned, displayYear, displayMonth]);

  return (
    <div className="app-shell">
      <div className="app-sidebar"><Sidebar /></div>
      <div className="app-main">
        <div className="app-topbar"><Header /></div>

        <div className="app-content">
          {/* Page Header */}
          <div className="page-header">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Leave Management</span>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-item active">Calendar</span>
            </div>
            <h1 className="page-title">Date Restrictions</h1>
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

          {/* Calendar Navigation */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button className="btn btn-soft" onClick={goToPrevMonth}>◀ Prev</button>
                <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                  {MONTHS[displayMonth]} {displayYear}
                </h2>
                <button className="btn btn-soft" onClick={goToNextMonth}>Next ▶</button>
              </div>
              <button className="btn btn-primary" onClick={goToToday}>Today</button>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: "20px", marginTop: "12px", fontSize: "12px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: 12, height: 12, background: "var(--success)", borderRadius: 2 }} /> Special Day
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: 12, height: 12, background: "var(--danger)", borderRadius: 2 }} /> Restricted Date
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: 12, height: 12, background: "var(--soft)", borderRadius: 2 }} /> Other Month
              </span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: "var(--soft)", fontWeight: "600", fontSize: "12px" }}>
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                <div key={d} style={{ padding: "10px", borderRight: "1px solid var(--border)", textAlign: "center" }}>{d}</div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
              {grid.map((cell, i) => {
                const assigned = getAssigned(cell.y, cell.m, cell.d);
                const isToday = cell.y === today.getFullYear() && cell.m === today.getMonth() && cell.d === today.getDate();
                return (
                  <div
                    key={i}
                    onClick={() => onCellClick(cell)}
                    style={{
                      height: "80px",
                      padding: "8px",
                      borderRight: "1px solid var(--border)",
                      borderBottom: "1px solid var(--border)",
                      background: cell.other ? "var(--soft)" : "var(--panel)",
                      position: "relative",
                      cursor: cell.other ? "default" : "pointer",
                      ...(isToday && { outline: "2px solid var(--brand)" })
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: "600", color: cell.other ? "var(--muted)" : "var(--text)" }}>
                      {cell.d}
                    </div>
                    {assigned && (
                      <div style={{
                        fontSize: "10px",
                        padding: "2px 4px",
                        borderRadius: "3px",
                        color: "#fff",
                        background: assigned.type === "special" ? "var(--success)" : "var(--danger)",
                        position: "absolute",
                        bottom: "6px",
                        left: "6px"
                      }}>
                        {assigned.type === "special" ? "Special" : "Restricted"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assigned Dates Table */}
          <div className="table-container">
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", fontWeight: "600" }}>
                Assigned Dates - {MONTHS[displayMonth]} {displayYear}
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedRows.length > 0 ? (
                    assignedRows.map((r) => (
                      <tr key={r.date}>
                        <td>{r.date}</td>
                        <td>
                          <span className={`pill ${r.type === "special" ? "pill-ok" : "pill-danger"}`}>
                            {r.type === "special" ? "Special Day" : "Restricted"}
                          </span>
                        </td>
                        <td>{r.reason}</td>
                        <td>
                          <button className="btn btn-soft" onClick={() => {
                            const date = new Date(r.date);
                            setDeleteFor({ y: date.getFullYear(), m: date.getMonth(), d: date.getDate() });
                          }}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>No assigned dates</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modals */}
          {pickFor && (
            <ModalWrapper>
              <div className="card" style={{ padding: "20px", maxWidth: "400px" }}>
                <h3>Select Date Type</h3>
                <p>Choose type for {MONTHS[pickFor.m]} {pickFor.d}, {pickFor.y}</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="btn" style={{ background: "var(--success)", color: "#fff", flex: 1 }} onClick={() => chooseType("special")}>Special</button>
                  <button className="btn" style={{ background: "var(--danger)", color: "#fff", flex: 1 }} onClick={() => chooseType("restricted")}>Restricted</button>
                </div>
                <button className="btn btn-soft" style={{ marginTop: "10px", width: "100%" }} onClick={() => setPickFor(null)}>Cancel</button>
              </div>
            </ModalWrapper>
          )}

          {reasonFor && (
            <ModalWrapper>
              <div className="card" style={{ padding: "20px", maxWidth: "400px" }}>
                <h3>{reasonFor.type === "special" ? "Special Day" : "Restricted Date"}</h3>
                <input
                  className="input"
                  placeholder="Enter reason..."
                  onKeyDown={(e) => e.key === "Enter" && saveReason(e.target.value)}
                  autoFocus
                />
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <button className="btn btn-soft" onClick={() => setReasonFor(null)}>Cancel</button>
                  <button className="btn btn-primary" onClick={() => saveReason(document.querySelector(".input").value)}>Save</button>
                </div>
              </div>
            </ModalWrapper>
          )}

          {deleteFor && (
            <ModalWrapper>
              <div className="card" style={{ padding: "20px", maxWidth: "400px" }}>
                <h3 style={{ color: "var(--danger)" }}>Remove Date</h3>
                <p>Are you sure you want to remove this date?</p>
                <div className="pill pill-danger" style={{ textAlign: "center", margin: "8px 0" }}>
                  {MONTHS[deleteFor.m]} {deleteFor.d}, {deleteFor.y}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="btn btn-soft" onClick={() => setDeleteFor(null)}>Cancel</button>
                  <button className="btn" style={{ background: "var(--danger)", color: "#fff" }} onClick={confirmDelete}>Remove</button>
                </div>
              </div>
            </ModalWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

function ModalWrapper({ children }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      {children}
    </div>
  );
}

export default LeaveCalendar;
