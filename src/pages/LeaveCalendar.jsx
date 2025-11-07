// src/pages/LeaveCalendar.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

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
    { date: toKey(today.getFullYear(), today.getMonth() + 1, 5), type: "special", reason: "Wellness day" },
    { date: toKey(today.getFullYear(), today.getMonth() + 1, 12), type: "restricted", reason: "Company meeting" },
    { date: toKey(today.getFullYear(), today.getMonth() + 1, 25), type: "special", reason: "Public holiday" },
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

  const goToToday = () => {
    setDisplayYear(today.getFullYear());
    setDisplayMonth(today.getMonth());
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <Layout>
      {/* Fixed Header Section */}
      <PageHeader
        breadcrumb={["Leave Management", "Calendar"]}
        title="Date Restrictions"
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

      {/* Calendar Navigation Card */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="btn btn-soft" onClick={goToPrevMonth}>◀ Previous</button>
            <h2 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
              {MONTHS[displayMonth]} {displayYear}
            </h2>
            <button className="btn btn-soft" onClick={goToNextMonth}>Next ▶</button>
          </div>
          <button className="btn btn-primary" onClick={goToToday}>
            Today
          </button>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "20px", fontSize: "12px", color: "var(--muted)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: "var(--success)" }} />
            Special Day
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: "var(--danger)" }} />
            Restricted Date
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: "var(--soft)" }} />
            Other Month
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card" style={{ padding: "0" }}>
        {/* Week header */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(7, 1fr)",
          borderBottom: "1px solid var(--border)"
        }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} style={{ 
              padding: "12px", 
              textAlign: "center", 
              fontWeight: "600", 
              fontSize: "12px",
              color: "var(--muted)",
              borderRight: "1px solid var(--border)",
              background: "var(--soft)"
            }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {grid.map((cell, index) => {
            const assigned = getAssigned(cell.y, cell.m, cell.d);
            const isToday = cell.y === today.getFullYear() && 
                           cell.m === today.getMonth() && 
                           cell.d === today.getDate();
            
            return (
              <div
                key={index}
                onClick={() => onCellClick(cell)}
                style={{
                  height: "80px",
                  padding: "8px",
                  borderRight: "1px solid var(--border)",
                  borderBottom: "1px solid var(--border)",
                  background: cell.other ? "var(--soft)" : "var(--panel)",
                  cursor: cell.other ? "default" : "pointer",
                  position: "relative",
                  opacity: cell.other ? 0.5 : 1,
                  ...(isToday && {
                    border: "2px solid var(--brand)",
                    background: "var(--soft)"
                  })
                }}
              >
                <div style={{ 
                  fontSize: "12px", 
                  fontWeight: "600",
                  color: cell.other ? "var(--muted)" : "var(--text)",
                  marginBottom: "4px"
                }}>
                  {cell.d}
                </div>
                
                {assigned && (
                  <div style={{
                    fontSize: "10px",
                    padding: "2px 4px",
                    borderRadius: "3px",
                    background: assigned.type === "special" ? "var(--success)" : "var(--danger)",
                    color: "white",
                    fontWeight: "600",
                    textAlign: "center"
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
          <div style={{ 
            padding: "12px 16px", 
            borderBottom: "1px solid var(--border)", 
            display: "flex", 
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ fontWeight: "700" }}>Assigned Dates - {MONTHS[displayMonth]} {displayYear}</div>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>
              {assignedRows.length} date(s) assigned
            </div>
          </div>

          <div style={{ overflowX: "auto", flex: 1 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedRows.length > 0 ? (
                  assignedRows.map((row) => (
                    <tr key={row.date}>
                      <td style={{ fontWeight: "600" }}>{formatDate(row.date)}</td>
                      <td style={{ fontSize: "12px", color: "var(--muted)" }}>
                        {new Date(row.date).toLocaleDateString('en-US', { weekday: 'long' })}
                      </td>
                      <td>
                        <span className={`pill ${row.type === "special" ? "pill-ok" : "pill-danger"}`}>
                          {row.type === "special" ? "Special Day" : "Restricted Date"}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px", color: "var(--muted)" }}>
                        {row.reason}
                      </td>
                      <td>
                        <button 
                          className="btn btn-soft" 
                          onClick={() => {
                            const date = new Date(row.date);
                            setDeleteFor({
                              y: date.getFullYear(),
                              m: date.getMonth(),
                              d: date.getDate()
                            });
                          }}
                          style={{ fontSize: "11px", padding: "4px 8px", background: "var(--danger)", color: "white" }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                      No assigned dates for {MONTHS[displayMonth]} {displayYear}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Pick Type Modal */}
      {pickFor && (
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
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--panel)',
            borderRadius: '8px',
            padding: '20px',
            width: '90%',
            maxWidth: '400px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
              Select Date Type
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '20px' }}>
              Choose the type for {MONTHS[pickFor.m]} {pickFor.d}, {pickFor.y}
            </p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button 
                className="btn"
                onClick={() => chooseType("special")}
                style={{ 
                  flex: 1, 
                  background: 'var(--success)', 
                  color: 'white',
                  border: 'none'
                }}
              >
                Special Day
              </button>
              <button 
                className="btn"
                onClick={() => chooseType("restricted")}
                style={{ 
                  flex: 1, 
                  background: 'var(--danger)', 
                  color: 'white',
                  border: 'none'
                }}
              >
                Restricted
              </button>
            </div>
            <button 
              className="btn btn-soft" 
              onClick={() => setPickFor(null)}
              style={{ width: '100%' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reason Modal */}
      {reasonFor && (
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
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--panel)',
            borderRadius: '8px',
            padding: '20px',
            width: '90%',
            maxWidth: '400px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
              {reasonFor.type === "special" ? "Special Day" : "Restricted Date"}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>
              Add reason for {MONTHS[reasonFor.m]} {reasonFor.d}, {reasonFor.y}
            </p>
            <div style={{ marginBottom: '20px' }}>
              <input
                className="input"
                placeholder="Enter reason..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') saveReason(e.target.value);
                }}
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-soft" 
                onClick={() => setReasonFor(null)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => saveReason(document.querySelector('.input').value)}
                style={{ flex: 1 }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteFor && (
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
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--panel)',
            borderRadius: '8px',
            padding: '20px',
            width: '90%',
            maxWidth: '400px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--danger)' }}>
              Remove Date
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>
              Are you sure you want to remove this assigned date?
            </p>
            <div style={{ 
              background: 'var(--soft)', 
              padding: '12px', 
              borderRadius: '6px',
              textAlign: 'center',
              marginBottom: '20px',
              fontWeight: '600'
            }}>
              {MONTHS[deleteFor.m]} {deleteFor.d}, {deleteFor.y}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-soft" 
                onClick={() => setDeleteFor(null)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                className="btn"
                onClick={confirmDelete}
                style={{ 
                  flex: 1, 
                  background: 'var(--danger)', 
                  color: 'white',
                  border: 'none'
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default LeaveCalendar;