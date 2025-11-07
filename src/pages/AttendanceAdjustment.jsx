// src/pages/AttendanceAdjustment.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

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

  // ✅ Employee list with departments
  const employees = [
    { no: 1, name: "Rashmi Jayathunga", department: "HR Department" },
    { no: 2, name: "Nimesha Fernando", department: "Finance Department" },
    { no: 3, name: "Thilina Abeysekara", department: "IT Department" },
    { no: 4, name: "Sajini Weerasinghe", department: "Operations Department" },
    { no: 5, name: "Chathura Ranasinghe", department: "Marketing Department" },
    { no: 6, name: "Isuri Karunaratne", department: "Customer Care" },
    { no: 7, name: "Malith Perera", department: "Logistics Department" },
    { no: 8, name: "Sewwandi Gunasekara", department: "Sales Department" },
    { no: 9, name: "Roshan Siriwardena", department: "IT Department" },
    { no: 10, name: "Dinusha Rathnayake", department: "Finance Department" },
  ];

  // ✅ Sample attendance data for modal
  const [attendanceData] = useState([
    {
      date: "2025-01-15",
      checkIn: "08:45 AM",
      checkOut: "05:15 PM",
      status: "Present",
      hours: "8.5",
      overtime: "0.5",
      notes: "Regular day"
    },
    {
      date: "2025-01-14",
      checkIn: "09:15 AM",
      checkOut: "05:00 PM",
      status: "Late",
      hours: "7.75",
      overtime: "0",
      notes: "Traffic delay"
    },
    {
      date: "2025-01-13",
      checkIn: "08:30 AM",
      checkOut: "04:45 PM",
      status: "Early Out",
      hours: "8.25",
      overtime: "0",
      notes: "Doctor appointment"
    },
    {
      date: "2025-01-12",
      checkIn: "08:55 AM",
      checkOut: "05:30 PM",
      status: "Present",
      hours: "8.75",
      overtime: "0.75",
      notes: "Project deadline"
    }
  ]);

  // ✅ Extract unique departments
  const departments = ["All Departments", ...new Set(employees.map(emp => emp.department))];

  // ✅ States
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adjustmentDate, setAdjustmentDate] = useState("");
  const [adjustmentType, setAdjustmentType] = useState("Check-in");
  const [adjustedTime, setAdjustedTime] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");

  // ✅ Filtering logic (by name and department)
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "All Departments" || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setDeptFilter("All Departments");
  };

  const handleViewAttendance = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleAdjustmentSubmit = () => {
    if (!adjustmentDate || !adjustedTime) {
      alert("Please fill in all required fields");
      return;
    }

    // Here you would typically make an API call to save the adjustment
    console.log("Adjustment submitted:", {
      employee: selectedEmployee,
      date: adjustmentDate,
      type: adjustmentType,
      time: adjustedTime,
      reason: adjustmentReason
    });

    // Reset form and close modal
    setAdjustmentDate("");
    setAdjustedTime("");
    setAdjustmentReason("");
    alert("Attendance adjustment submitted successfully!");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Layout>
      {/* Fixed Header Section */}
      <PageHeader
        breadcrumb={["Time & Attendance", "Attendance Adjustment"]}
        title="Attendance Adjustment"
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

      {/* Search and Filters Card */}
      <div className="card">
        <div style={{ display: "flex", gap: "16px", alignItems: "end", marginBottom: "12px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Search Employee</label>
            <input
              className="input"
              placeholder="Search by Employee Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Department</label>
            <select 
              className="select" 
              value={deptFilter} 
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button className="btn btn-soft" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        <div style={{ fontSize: "14px", color: "var(--muted)" }}>
          {filteredEmployees.length} employee(s) found
        </div>
      </div>

      {/* Employee Table Section */}
      <div className="table-container">
        <div className="card" style={{ padding: 0 }}>
          <div style={{ 
            padding: "12px 16px", 
            borderBottom: "1px solid var(--border)", 
            display: "flex", 
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ fontWeight: "700" }}>Employees</div>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>
              Showing {filteredEmployees.length} records
            </div>
          </div>

          <div style={{ overflowX: "auto", flex: 1 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Employee No</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.no}>
                      <td>{emp.no}</td>
                      <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div className="user-avatar" />
                        <div style={{ fontWeight: "600" }}>{emp.name}</div>
                      </td>
                      <td>
                        <span className="pill" style={{ background: 'var(--soft)', color: 'var(--text)' }}>
                          {emp.department}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-soft"
                          onClick={() => handleViewAttendance(emp)}
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                          View Attendance
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                      No matching employees found
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
          Showing {filteredEmployees.length} of {employees.length} results
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-soft" disabled>Previous</button>
          <button className="btn btn-soft" disabled>Next</button>
        </div>
      </div>

      {/* Attendance View Modal */}
      {showModal && selectedEmployee && (
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--panel)',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '1000px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>
                  Attendance Details - {selectedEmployee.name}
                </h2>
                <div style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
                  {selectedEmployee.department} • Employee No: {selectedEmployee.no}
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: 'var(--muted)'
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px" }}>
              {/* Current Attendance Records */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
                  Recent Attendance Records
                </h3>
                <div style={{ border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
                  <table className="table" style={{ margin: 0 }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Status</th>
                        <th>Hours</th>
                        <th>Overtime</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((record, index) => (
                        <tr key={index}>
                          <td>{formatDate(record.date)}</td>
                          <td>{record.checkIn}</td>
                          <td>{record.checkOut}</td>
                          <td>
                            <span className={`pill ${
                              record.status === "Present" ? "pill-ok" : 
                              record.status === "Late" ? "pill-warn" : 
                              "pill-soft"
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td>{record.hours}h</td>
                          <td>{record.overtime}h</td>
                          <td style={{ fontSize: "12px", color: "var(--muted)" }}>{record.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Attendance Adjustment Form */}
              <div style={{ 
                padding: "16px", 
                background: "var(--soft)", 
                borderRadius: "6px",
                border: "1px solid var(--border)"
              }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
                  Make Attendance Adjustment
                </h3>
                
                <div className="grid-3" style={{ gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                      Adjustment Date *
                    </label>
                    <input
                      className="input"
                      type="date"
                      value={adjustmentDate}
                      onChange={(e) => setAdjustmentDate(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                      Adjustment Type *
                    </label>
                    <select 
                      className="select"
                      value={adjustmentType}
                      onChange={(e) => setAdjustmentType(e.target.value)}
                    >
                      <option>Check-in</option>
                      <option>Check-out</option>
                      <option>Full Day</option>
                      <option>Half Day</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                      Adjusted Time *
                    </label>
                    <input
                      className="input"
                      type="time"
                      value={adjustedTime}
                      onChange={(e) => setAdjustedTime(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                    Reason for Adjustment
                  </label>
                  <textarea
                    className="input"
                    placeholder="Enter reason for attendance adjustment..."
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    style={{ 
                      minHeight: "80px", 
                      resize: "vertical",
                      fontFamily: "inherit"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <button 
                    className="btn btn-soft" 
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleAdjustmentSubmit}
                  >
                    Submit Adjustment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AttendanceAdjustment;