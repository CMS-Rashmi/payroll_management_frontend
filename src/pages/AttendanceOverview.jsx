import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/AttendanceOverview.css";

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

  return (
    <div className="attendance-overview-container">
      <Sidebar />
      <div className="attendance-overview-content">
        <Header />

        {/* Header Section */}
        <header className="attendance-overview-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Time & Attendance</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Overview</span>
            </div>
            <h1 className="page-title">Time and Attendance - Overview</h1>
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

        {/* Attendance Table Section */}
        <div className="attendance-table-section">
          {/* Filters */}
          <div className="filters-container">
            {/* First Row */}
            <div className="filters-row">
              {/* Date Field */}
              <div className="filter-field">
                <label className="filter-label">Date</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    className="filter-date"
                    placeholder="MM/DD/YYYY"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Search Field */}
              <div className="filter-field">
                <label className="filter-label">Search by Employee</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Search by Employee No..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Second Row */}
            <div className="filters-row">
              <select
                className="filter-select"
                value={checkInFilter}
                onChange={(e) => setCheckInFilter(e.target.value)}
              >
                <option>All Check-in Types</option>
                <option>Normal Check-in</option>
                <option>Late</option>
                <option>Short-in</option>
              </select>

              <select
                className="filter-select"
                value={checkOutFilter}
                onChange={(e) => setCheckOutFilter(e.target.value)}
              >
                <option>All Check-out Types</option>
                <option>Normal Check-out</option>
                <option>Early-out</option>
              </select>

              <select
                className="filter-select"
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

          <div className="section-header">
            <h2 className="attendance-title">Attendance Table</h2>
          </div>

          {/* Table */}
          <table className="attendance-table">
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
                    <td>{item.name}</td>
                    <td>{item.status}</td>
                    <td>{item.date}</td>
                    <td>{item.checkInType}</td>
                    <td>{item.checkInTime}</td>
                    <td>{item.checkOutType}</td>
                    <td>{item.checkOutTime}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceOverview;
