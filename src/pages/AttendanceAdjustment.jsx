import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/AttendanceAdjustment.css";

const AttendanceAdjustment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Overview", path: "/attendance-overview" },
    { label: "Time Management", path: "/time-management" },
    { label: "Absence Report", path: "/absence-report" },
    { label: "Attendance Adjustment", path: "/attendance-adjustment" },
    { label: "Check In & Out Report", path: "/checkin-checkout-report" },
  ];

  // ✅ Employee list
  const employees = [
    { no: 1, name: "Rashmi Jayathunga" },
    { no: 2, name: "Nimesha Fernando" },
    { no: 3, name: "Thilina Abeysekara" },
    { no: 4, name: "Sajini Weerasinghe" },
    { no: 5, name: "Chathura Ranasinghe" },
    { no: 6, name: "Isuri Karunaratne" },
    { no: 7, name: "Malith Perera" },
    { no: 8, name: "Sewwandi Gunasekara" },
    { no: 9, name: "Roshan Siriwardena" },
    { no: 10, name: "Dinusha Rathnayake" },
  ];

  // ✅ Search state
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Filtered employees (case insensitive)
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="attendance-adjustment-container">
      <Sidebar />
      <div className="attendance-adjustment-content">
        <Header />

        {/* Header Section */}
        <header className="attendance-adjustment-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Time & Attendance</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">
                Attendance Adjustment
              </span>
            </div>
            <h1 className="page-title">Attendance Adjustment</h1>
          </div>
        </header>

        {/* Tabs Section */}
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

        {/* ✅ Search Bar */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search by Employee Name..."
            className="filter-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="apply-btn" onClick={() => setSearchTerm("")}>
            Clear
          </button>
        </div>

        {/* ✅ Employee Table */}
        <table className="employee-table">
          <thead>
            <tr>
              <th>Emp No</th>
              <th>Employee Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.no}>
                  <td>{emp.no}</td>
                  <td>{emp.name}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(`/attendance-adjustment/${emp.no}`)
                      }
                    >
                      View Attendance
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", color: "#9ca3af" }}>
                  No matching employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <span>
            Showing {filteredEmployees.length} of {employees.length} results
          </span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAdjustment;
