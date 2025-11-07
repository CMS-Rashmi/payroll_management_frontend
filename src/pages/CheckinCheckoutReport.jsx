// src/pages/CheckinCheckoutReport.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

const CheckinCheckoutReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchEmpNo, setSearchEmpNo] = useState("");
  const [checkInType, setCheckInType] = useState("All Check-in Types");
  const [checkOutType, setCheckOutType] = useState("All Check-out Types");
  const [status, setStatus] = useState("All Statuses");

  const tabs = [
    { label: "Overview", path: "/attendance-overview" },
    { label: "Time Management", path: "/time-management" },
    { label: "Absence Report", path: "/absence-report" },
    { label: "Attendance Adjustment", path: "/attendance-adjustment" },
    { label: "Check In & Out Report", path: "/checkin-checkout-report" },
  ];

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [checkInFilter, setCheckInFilter] = useState("All Check-in Types");
  const [checkOutFilter, setCheckOutFilter] = useState("All Check-out Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const reportData = [
    {
      empNo: "1",
      name: "Rashmi Jayathunga",
      activeStatus: "Active",
      date: "2025-09-29",
      checkInTime: "08:45 AM",
      checkInType: "Normal",
      checkOutTime: "05:00 PM",
      checkOutType: "Normal",
      status: "Present",
      ot: "1h",
      checkInAddress: "Colombo HQ",
      checkOutAddress: "Colombo HQ",
    },
    {
      empNo: "2",
      name: "Kalpani Madiwanthika",
      activeStatus: "Active",
      date: "2025-09-29",
      checkInTime: "08:30 AM",
      checkInType: "Normal",
      checkOutTime: "05:15 PM",
      checkOutType: "Normal",
      status: "Present",
      ot: "1.5h",
      checkInAddress: "Colombo HQ",
      checkOutAddress: "Colombo HQ",
    },
    {
      empNo: "3",
      name: "Sayidi Randini Gimhara",
      activeStatus: "Active",
      date: "2025-09-29",
      checkInTime: "09:15 AM",
      checkInType: "Late",
      checkOutTime: "05:00 PM",
      checkOutType: "Normal",
      status: "Present",
      ot: "0h",
      checkInAddress: "Colombo HQ",
      checkOutAddress: "Colombo HQ",
    },
  ];

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setSearchTerm("");
    setCheckInFilter("All Check-in Types");
    setCheckOutFilter("All Check-out Types");
    setStatusFilter("All Statuses");
  };

  const exportCsv = () => {
    // Simple CSV export implementation
    const headers = ['Employee No', 'Employee Name', 'Active Status', 'Date', 'Check-in Time', 'Check-in Type', 'Check-out Time', 'Check-out Type', 'Status', 'OT', 'Check-in Address', 'Check-out Address'];
    const csvRows = reportData.map(row => [
      row.empNo,
      row.name,
      row.activeStatus,
      row.date,
      row.checkInTime,
      row.checkInType,
      row.checkOutTime,
      row.checkOutType,
      row.status,
      row.ot,
      row.checkInAddress,
      row.checkOutAddress
    ]);
    
    const csv = [headers, ...csvRows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'checkin_checkout_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredData = reportData.filter((row) => {
    const rowDate = new Date(row.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    // Date filter
    if (from && to && !(rowDate >= from && rowDate <= to)) return false;
    if (from && !to && rowDate < from) return false;
    if (!from && to && rowDate > to) return false;

    // Employee No filter
    if (searchEmpNo && !row.empNo.includes(searchEmpNo)) return false;

    // Check-in Type filter
    if (checkInType !== "All Check-in Types" && row.checkInType !== checkInType) return false;

    // Check-out Type filter
    if (checkOutType !== "All Check-out Types" && row.checkOutType !== checkOutType) return false;

    // Status filter
    if (status !== "All Statuses" && row.status !== status) return false;

    return true;
  });



  return (
    <Layout>
      {/* Fixed Header Section */}
      <PageHeader
        breadcrumb={["Time & Attendance", "Check In – Check Out Report"]}
        title="Check In – Check Out Report"
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

<<<<<<< HEAD
        {/* Tabs */}
        <div className="tab-bar">
          {tabs.map((tab) => (
            <button
              key={tab.path}
              className={`tab-link ${location.pathname === tab.path ? "active" : ""
                }`}
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ✅ Filters - Two-Line Compact Layout */}
        <div className="filters-section">
          {/* 🔹 First Line */}
          <div className="filters-row top-row">
            <input
              type="text"
              placeholder="Search by Employee No..."
              className="filter-input"
              onChange={(e) => setSearchEmpNo(e.target.value)}
            />

            <div className="date-group">
=======
      {/* Filters Card */}
      <div className="card">
        <div className="grid-3" style={{ alignItems: "end", marginBottom: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Date Range</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
>>>>>>> dev-shanika
              <input
                className="input"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>to</span>
              <input
                className="input"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          </div>

<<<<<<< HEAD
          {/* 🔹 Second Line */}
          <div className="filters-row bottom-row">
            <select className="filter-select"  onChange={(e) => setCheckInType(e.target.value)}>
=======
          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Check-in Type</label>
            <select 
              className="select" 
              value={checkInFilter} 
              onChange={(e) => setCheckInFilter(e.target.value)}
            >
>>>>>>> dev-shanika
              <option>All Check-in Types</option>
              <option>Normal</option>
              <option>Late</option>
              <option>Short-in</option>
            </select>
          </div>

<<<<<<< HEAD
            <select className="filter-select"  onChange={(e) => setCheckOutType(e.target.value)}>
=======
          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Check-out Type</label>
            <select 
              className="select" 
              value={checkOutFilter} 
              onChange={(e) => setCheckOutFilter(e.target.value)}
            >
>>>>>>> dev-shanika
              <option>All Check-out Types</option>
              <option>Normal</option>
              <option>Early-out</option>
            </select>
          </div>
        </div>

<<<<<<< HEAD
            <select className="filter-select"  onChange={(e) => setSt(e.target.value)}>
=======
        <div className="grid-2" style={{ alignItems: "end", marginBottom: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Search</label>
            <input
              className="input"
              placeholder="Search by Employee No or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Status</label>
            <select 
              className="select" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
>>>>>>> dev-shanika
              <option>All Statuses</option>
              <option>Present</option>
              <option>Leave</option>
              <option>Half Day</option>
            </select>
          </div>
        </div>

<<<<<<< HEAD
        {/* ✅ Table */}
        <div className="table-wrapper">
          <table className="checkin-table">
            <thead>
              <tr>
                <th>Employee No</th>
                <th>Employee Name</th>
                <th>Active Status</th>
                <th>Date</th>
                <th>Check-in Time</th>
                <th>Check-in Type</th>
                <th>Check-out Time</th>
                <th>Check-out Type</th>
                <th>Status</th>
                <th>OT</th>
                <th>Check-in Address</th>
                <th>Check-out Address</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredData.length > 0 ? (
                  filteredData.map((row, i) => (
                    <tr key={i}>
                      <td>{row.empNo}</td>
                      <td>{row.name}</td>
                      <td>{row.activeStatus}</td>
                      <td>{formatDate(row.date)}</td>
                      <td>{row.checkInTime}</td>
                      <td>{row.checkInType}</td>
                      <td>{row.checkOutTime}</td>
                      <td>{row.checkOutType}</td>
                      <td>{row.status}</td>
                      <td>{row.ot}</td>
                      <td>{row.checkInAddress}</td>
                      <td>{row.checkOutAddress}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" style={{ textAlign: "center", color: "#9ca3af" }}>
                      No records found
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span>
            Showing 1 to {reportData.length} of {reportData.length} results
          </span>
=======
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "14px", color: "var(--muted)" }}>
            {reportData.length} record(s) found
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-soft" onClick={clearFilters}>
              Clear Filters
            </button>
            <button className="btn btn-primary" onClick={exportCsv}>
              Export CSV
            </button>
          </div>
>>>>>>> dev-shanika
        </div>
      </div>

      {/* Check-in Check-out Report Table */}
      <div className="table-container">
        <div className="card" style={{ padding: 0 }}>
          <div style={{ 
            padding: "12px 16px", 
            borderBottom: "1px solid var(--border)", 
            display: "flex", 
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ fontWeight: "700" }}>Check-in Check-out Report</div>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>
              Showing {reportData.length} records
            </div>
          </div>

          <div style={{ overflowX: "auto", flex: 1 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Employee No</th>
                  <th>Employee Name</th>
                  <th>Active Status</th>
                  <th>Date</th>
                  <th>Check-in Time</th>
                  <th>Check-in Type</th>
                  <th>Check-out Time</th>
                  <th>Check-out Type</th>
                  <th>Status</th>
                  <th>OT</th>
                  <th>Check-in Address</th>
                  <th>Check-out Address</th>
                </tr>
              </thead>
              <tbody>
                {reportData.length > 0 ? (
                  reportData.map((row, i) => (
                    <tr key={i}>
                      <td>{row.empNo}</td>
                      <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div className="user-avatar" />
                        <div style={{ fontWeight: "600" }}>{row.name}</div>
                      </td>
                      <td>
                        <span className={`pill ${
                          row.activeStatus === "Active" ? "pill-ok" : "pill-warn"
                        }`}>
                          {row.activeStatus}
                        </span>
                      </td>
                      <td>{formatDate(row.date)}</td>
                      <td>{row.checkInTime}</td>
                      <td>
                        <span className={`pill ${
                          row.checkInType === "Normal" ? "pill-ok" : 
                          row.checkInType === "Late" ? "pill-warn" : 
                          "pill-soft"
                        }`}>
                          {row.checkInType}
                        </span>
                      </td>
                      <td>{row.checkOutTime}</td>
                      <td>
                        <span className={`pill ${
                          row.checkOutType === "Normal" ? "pill-ok" : 
                          row.checkOutType === "Early-out" ? "pill-warn" : 
                          "pill-soft"
                        }`}>
                          {row.checkOutType}
                        </span>
                      </td>
                      <td>
                        <span className={`pill ${
                          row.status === "Present" ? "pill-ok" : 
                          row.status === "Leave" ? "pill-warn" : 
                          "pill-soft"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <span className={`pill ${
                          row.ot !== "0h" ? "pill-ok" : "pill-soft"
                        }`}>
                          {row.ot}
                        </span>
                      </td>
                      <td style={{ fontSize: "11px", color: "var(--muted)" }}>{row.checkInAddress}</td>
                      <td style={{ fontSize: "11px", color: "var(--muted)" }}>{row.checkOutAddress}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                      No check-in/check-out records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "14px", color: "var(--muted)" }}>
          Showing 1 to {reportData.length} of {reportData.length} results
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-soft" disabled>Previous</button>
          <button className="btn btn-soft" disabled>Next</button>
        </div>
      </div>
    </Layout>
  );
};

export default CheckinCheckoutReport;