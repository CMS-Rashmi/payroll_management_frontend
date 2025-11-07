// src/pages/AbsenceReport.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

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

  const clearFilters = () => {
    setSelectedDate("");
    setSearchEmployee("");
    setFilterDept("");
    setFilterOffice("");
  };

  return (
    <Layout>
      {/* Fixed Header Section */}
      <PageHeader
        breadcrumb={["Time & Attendance", "Absence Report"]}
        title="Absence Report"
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
        <div className="grid-4" style={{ alignItems: "end", marginBottom: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Date</label>
            <input
              className="input"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Search Employee</label>
            <input
              className="input"
              placeholder="Search by employee name..."
              value={searchEmployee}
              onChange={(e) => setSearchEmployee(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Department</label>
            <input
              className="input"
              placeholder="Filter by department..."
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Working Office</label>
            <input
              className="input"
              placeholder="Filter by office..."
              value={filterOffice}
              onChange={(e) => setFilterOffice(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "14px", color: "var(--muted)" }}>
            {filteredData.length} absence record(s) found
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-soft" onClick={clearFilters}>
              Clear Filters
            </button>
            <button className="btn btn-primary" onClick={handleExportCSV}>
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Absence Report Table */}
      <div className="table-container">
        <div className="card" style={{ padding: 0 }}>
          <div style={{ 
            padding: "12px 16px", 
            borderBottom: "1px solid var(--border)", 
            display: "flex", 
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ fontWeight: "700" }}>Absence Report</div>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>
              Showing {filteredData.length} records
            </div>
          </div>

          <div style={{ overflowX: "auto", flex: 1 }}>
            <table className="table">
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
                      <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div className="user-avatar" />
                        <div>
                          <div style={{ fontWeight: "600" }}>{row.employeeName}</div>
                          <div style={{ fontSize: "12px", color: "var(--muted)" }}>{row.designation}</div>
                        </div>
                      </td>
                      <td>
                        <span className="pill pill-soft">{row.callingName}</span>
                      </td>
                      <td>
                        <span className="pill" style={{ background: 'var(--soft)', color: 'var(--text)' }}>
                          {row.department}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px", color: "var(--muted)" }}>{row.designation}</td>
                      <td>
                        <span className="pill" style={{ background: 'var(--soft)', color: 'var(--text)' }}>
                          {row.workingOffice}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px", color: "var(--muted)" }}>{row.branch}</td>
                      <td>
                        <span className="pill pill-warn">{row.date.toUpperCase()}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                      No absence records found
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
          Showing {filteredData.length} of {absenceData.length} results
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-soft" disabled>Previous</button>
          <button className="btn btn-soft" disabled>Next</button>
        </div>
      </div>
    </Layout>
  );
};

export default AbsenceReport;