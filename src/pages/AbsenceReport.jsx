import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/AbsenceReport.css";

const AbsenceReport = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Overview", path: "/attendance-overview" },
    { label: "Time Management", path: "/time-management" },
    { label: "Absence Report", path: "/absence-report" },
    { label: "Attendance Adjustment", path: "/attendance-adjustment" },
    { label: "Check In & Out Report", path: "/checkin-checkout-report" },
  ];

  // ✅ States
  const [selectedDate, setSelectedDate] = useState("");
  const [searchEmployee, setSearchEmployee] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterOffice, setFilterOffice] = useState("");
  const dateInputRef = useRef(null);

  // ✅ Dummy absence data
  const [absenceData] = useState([
    {
      no: 1,
      employeeName: "Sanduni Perera",
      callingName: "Sanduni",
      department: "Human Resources",
      designation: "HR Executive",
      workingOffice: "Colombo",
      branch: "Head Office",
      date: "10/14/2025",
    },
    {
      no: 2,
      employeeName: "Kavindu Jayasuriya",
      callingName: "Kavindu",
      department: "Finance",
      designation: "Accountant",
      workingOffice: "Kandy",
      branch: "Branch A",
      date: "10/14/2025",
    },
    {
      no: 3,
      employeeName: "Hashini Weerasinghe",
      callingName: "Hashini",
      department: "IT Department",
      designation: "Software Engineer",
      workingOffice: "Colombo",
      branch: "Head Office",
      date: "10/15/2025",
    },
    {
      no: 4,
      employeeName: "Dinuka Fernando",
      callingName: "Dinuka",
      department: "Marketing",
      designation: "Marketing Assistant",
      workingOffice: "Galle",
      branch: "Branch B",
      date: "10/15/2025",
    },
  ]);

  // ✅ Always display date in uppercase MM/DD/YYYY format
  const formatDate = (rawValue) => {
    if (!rawValue) return "";
    const date = new Date(rawValue);
    const formatted = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
      date.getDate()
    ).padStart(2, "0")}/${date.getFullYear()}`;
    return formatted.toUpperCase(); // ✅ Force uppercase
  };

  // ✅ Handle date selection
  const handleDateChange = (e) => {
    const value = e.target.value;
    setSelectedDate(formatDate(value));
  };

  // ✅ Filter logic
  const filteredData = absenceData.filter((item) => {
    const matchesDate = !selectedDate || item.date === selectedDate;
    const matchesEmployee =
      item.employeeName.toLowerCase().includes(searchEmployee.toLowerCase()) ||
      item.callingName.toLowerCase().includes(searchEmployee.toLowerCase());
    const matchesDept =
      !filterDept ||
      item.department.toLowerCase().includes(filterDept.toLowerCase());
    const matchesOffice =
      !filterOffice ||
      item.workingOffice.toLowerCase().includes(filterOffice.toLowerCase());
    return matchesDate && matchesEmployee && matchesDept && matchesOffice;
  });

  // ✅ Export CSV
  const handleExportCSV = () => {
    const csvHeaders = [
      "No",
      "Employee Name",
      "Calling Name",
      "Department",
      "Designation",
      "Working Office",
      "Branch",
      "Date",
    ];
    const csvRows = filteredData.map((row) =>
      [
        row.no,
        row.employeeName,
        row.callingName,
        row.department,
        row.designation,
        row.workingOffice,
        row.branch,
        row.date,
      ].join(",")
    );
    const csvContent = [csvHeaders.join(","), ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "absence_report.csv";
    link.click();
  };

  return (
    <div className="absence-report-container">
      <Sidebar />
      <div className="absence-report-content">
        <Header />

        {/* Header */}
        <header className="absence-report-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Time & Attendance</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Absence Report</span>
            </div>
            <h1 className="page-title">Absence Report</h1>
          </div>
        </header>

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

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
            {/* ✅ Custom Date Picker with uppercase placeholder */}
            <div className="date-picker-field" onClick={() => dateInputRef.current?.showPicker()}>
              <input
                ref={dateInputRef}
                type="date"
                className="filter-date"
                onChange={handleDateChange}
                style={{
                  color: "transparent",
                  textTransform: "uppercase",
                }}
              />

            </div>

            <input
              type="text"
              className="filter-input"
              placeholder="Search by Employee..."
              value={searchEmployee}
              onChange={(e) => setSearchEmployee(e.target.value)}
            />

            <input
              type="text"
              className="filter-input"
              placeholder="Filter by Department..."
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            />

            <input
              type="text"
              className="filter-input"
              placeholder="Filter by Working Office..."
              value={filterOffice}
              onChange={(e) => setFilterOffice(e.target.value)}
            />

            <button
              className="apply-btn"
              onClick={() => {
                setSelectedDate();
                setFilterDept("");
                setFilterOffice("");
                setSearchEmployee("");
              }}>
              Clear
            </button>
          </div>

          {/* Export Button */}
          <div className="export-btn-container">
            <button className="export-btn" onClick={handleExportCSV}>
              ⬇ EXPORT CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="absence-table-container">
          <table className="absence-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Employee Name</th>
                <th>Calling Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Working Office</th>
                <th>Branch</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.no}>
                    <td>{row.no}</td>
                    <td>{row.employeeName}</td>
                    <td>{row.callingName}</td>
                    <td>{row.department}</td>
                    <td>{row.designation}</td>
                    <td>{row.workingOffice}</td>
                    <td>{row.branch}</td>
                    <td>{row.date.toUpperCase()}</td> {/* ✅ Always uppercase */}
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

          <div className="pagination">
            <span className="page-info">
              Showing {filteredData.length} of {absenceData.length} results
            </span>
            <div className="page-controls">
              <button className="page-btn" disabled>
                Previous
              </button>
              <span className="page-number">1</span>
              <button className="page-btn" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsenceReport;
