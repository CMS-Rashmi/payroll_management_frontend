import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/CheckinCheckoutReport.css";

const CheckinCheckoutReport = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Overview", path: "/attendance-overview" },
    { label: "Time Management", path: "/time-management" },
    { label: "Absence Report", path: "/absence-report" },
    { label: "Attendance Adjustment", path: "/attendance-adjustment" },
    { label: "Check In & Out Report", path: "/checkin-checkout-report" },
  ];

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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
  ];

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`.toUpperCase();
  };

  return (
    <div className="checkin-checkout-container">
      <Sidebar />
      <div className="checkin-checkout-content">
        <Header />

        {/* Header */}
        <header className="checkin-checkout-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Time & Attendance</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">
                Check In – Check Out Report
              </span>
            </div>
            <h1 className="page-title">Check In – Check Out Report</h1>
          </div>
        </header>

        {/* Tabs */}
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

        {/* ✅ Filters - Two-Line Compact Layout */}
        <div className="filters-section">
          {/* 🔹 First Line */}
          <div className="filters-row top-row">
            <input
              type="text"
              placeholder="Search by Employee No..."
              className="filter-input"
            />

            <div className="date-group">
              <input
                type={fromDate ? "date" : "text"}
                value={fromDate}
                placeholder="MM/DD/YYYY"
                className="filter-input-date uppercase-placeholder"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
                onChange={(e) => setFromDate(e.target.value)}
              />

              <span className="date-separator">to</span>

              <input
                type={toDate ? "date" : "text"}
                value={toDate}
                placeholder="MM/DD/YYYY"
                className="filter-input-date uppercase-placeholder"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {/* 🔹 Second Line */}
          <div className="filters-row bottom-row">
            <select className="filter-select">
              <option>All Check-in Types</option>
              <option>Normal</option>
              <option>Late</option>
              <option>Short-in</option>
            </select>

            <select className="filter-select">
              <option>All Check-out Types</option>
              <option>Normal</option>
              <option>Early-out</option>
            </select>

            <select className="filter-select">
              <option>All Statuses</option>
              <option>Present</option>
              <option>Leave</option>
              <option>Half Day</option>
            </select>

            <button className="export-btn">⬇ Export CSV</button>
          </div>
        </div>

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
              {reportData.length > 0 ? (
                reportData.map((row, i) => (
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
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span>
            Showing 1 to {reportData.length} of {reportData.length} results
          </span>
        </div>
      </div>
    </div>
  );
};

export default CheckinCheckoutReport;
