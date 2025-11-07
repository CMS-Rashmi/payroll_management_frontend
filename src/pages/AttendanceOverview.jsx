// src/pages/AttendanceOverview.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

const AttendanceOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Overview", path: "/attendance-overview" },
    { label: "Time Management", path: "/time-management" },
    { label: "Absence Report", path: "/absence-report" },
    { label: "Attendance Adjustment", path: "/attendance-adjustment" },
    { label: "Check In & Out Report", path: "/checkin-checkout-report" },
  ];

  // ✅ Sample attendance data
  const [attendanceData] = useState([
    {
      empNo: "1",
      name: "Sayidi Randini Gimhara",
      status: "Active",
      date: "09/29/2025",
      checkInType: "Short-in",
      checkInTime: "08:54:10",
      checkOutType: "N/A",
      checkOutTime: "N/A",
    },
    {
      empNo: "2",
      name: "Kalpani Madiwanthika",
      status: "Active",
      date: "09/29/2025",
      checkInType: "Normal Check-in",
      checkInTime: "08:19:06",
      checkOutType: "Normal Check-out",
      checkOutTime: "17:05:00",
    },
    {
      empNo: "3",
      name: "Rashmi Jayathunga",
      status: "Leave",
      date: "09/30/2025",
      checkInType: "N/A",
      checkInTime: "N/A",
      checkOutType: "N/A",
      checkOutTime: "N/A",
    },
  ]);

  // ✅ Filter states
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [checkInFilter, setCheckInFilter] = useState("All Check-in Types");
  const [checkOutFilter, setCheckOutFilter] = useState("All Check-out Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // ✅ Helper: Format date as MM/DD/YYYY
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  // ✅ Filter logic
  const filteredData = attendanceData.filter((item) => {
    const matchesDate = !filterDate || item.date === formatDate(filterDate);
    const matchesSearch =
      item.empNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCheckIn =
      checkInFilter === "All Check-in Types" ||
      item.checkInType === checkInFilter;
    const matchesCheckOut =
      checkOutFilter === "All Check-out Types" ||
      item.checkOutType === checkOutFilter;
    const matchesStatus =
      statusFilter === "All Statuses" || item.status === statusFilter;

    return (
      matchesDate &&
      matchesSearch &&
      matchesCheckIn &&
      matchesCheckOut &&
      matchesStatus
    );
  });

  const clearFilters = () => {
    setFilterDate("");
    setSearchTerm("");
    setCheckInFilter("All Check-in Types");
    setCheckOutFilter("All Check-out Types");
    setStatusFilter("All Statuses");
  };

  return (
    <Layout>
      {/* Fixed Header Section */}
      <PageHeader
        breadcrumb={["Time & Attendance", "Overview"]}
        title="Time and Attendance - Overview"
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
        <div className="grid-3" style={{ alignItems: "end", marginBottom: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Date</label>
            <input
              className="input"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Check-in Type</label>
            <select 
              className="select" 
              value={checkInFilter} 
              onChange={(e) => setCheckInFilter(e.target.value)}
            >
              <option>All Check-in Types</option>
              <option>Normal Check-in</option>
              <option>Late</option>
              <option>Short-in</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Check-out Type</label>
            <select 
              className="select" 
              value={checkOutFilter} 
              onChange={(e) => setCheckOutFilter(e.target.value)}
            >
              <option>All Check-out Types</option>
              <option>Normal Check-out</option>
              <option>Early-out</option>
            </select>
          </div>
        </div>

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
              <option>All Statuses</option>
              <option>Active</option>
              <option>Leave</option>
              <option>Half day</option>
              <option>Normal day</option>
              <option>Short leave</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "14px", color: "var(--muted)" }}>
            {filteredData.length} record(s) found
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-soft" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table Section */}
      <div className="table-container">
        <div className="card" style={{ padding: 0 }}>
          <div style={{ 
            padding: "12px 16px", 
            borderBottom: "1px solid var(--border)", 
            display: "flex", 
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ fontWeight: "700" }}>Attendance Table</div>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>
              Showing {filteredData.length} records
            </div>
          </div>

          <div style={{ overflowX: "auto", flex: 1 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Employee No</th>
                  <th>Employee Name</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Check-in Type</th>
                  <th>Check-in Time</th>
                  <th>Check-out Type</th>
                  <th>Check-out Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.empNo}</td>
                      <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div className="user-avatar" />
                        <div style={{ fontWeight: "600" }}>{item.name}</div>
                      </td>
                      <td>
                        <span className={`pill ${
                          item.status === "Active" ? "pill-ok" : 
                          item.status === "Leave" ? "pill-warn" : 
                          "pill-soft"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.date}</td>
                      <td>
                        <span className={`pill ${
                          item.checkInType === "Normal Check-in" ? "pill-ok" : 
                          item.checkInType === "Short-in" ? "pill-warn" : 
                          "pill-soft"
                        }`}>
                          {item.checkInType}
                        </span>
                      </td>
                      <td>{item.checkInTime}</td>
                      <td>
                        <span className={`pill ${
                          item.checkOutType === "Normal Check-out" ? "pill-ok" : 
                          item.checkOutType === "Early-out" ? "pill-warn" : 
                          "pill-soft"
                        }`}>
                          {item.checkOutType}
                        </span>
                      </td>
                      <td>{item.checkOutTime}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceOverview;