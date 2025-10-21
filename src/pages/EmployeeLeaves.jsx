import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/EmployeeLeaves.css";

const MOCK_EMPLOYEES = [
  { name: "Rashmi Jayathunga", department: "IT Department", annualUsed: 6.0, annualTotal: 14, casualUsed: 2.5, casualTotal: 7, halfDay1: "0 / 0", halfDay2: "0 / 0" },
  { name: "Nimesha Fernando", department: "Business Development", annualUsed: 11.0, annualTotal: 14, casualUsed: 3.0, casualTotal: 7, halfDay1: "0 / 0", halfDay2: "0 / 0" },
  { name: "Thilina Abeysekara", department: "Customer Care", annualUsed: 9.0, annualTotal: 14, casualUsed: 5.0, casualTotal: 7, halfDay1: "0 / 0", halfDay2: "0 / 0" },
  { name: "Sajini Weerasinghe", department: "HR", annualUsed: 11.0, annualTotal: 14, casualUsed: 0.0, casualTotal: 7, halfDay1: "0 / 0", halfDay2: "0 / 0" },
  { name: "Chathura Ranasinghe", department: "IT Department", annualUsed: 0.0, annualTotal: 14, casualUsed: 0.0, casualTotal: 7, halfDay1: "0 / 0", halfDay2: "0 / 0" },
];

const EmployeeLeaves = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Overview", path: "/employee-leaves" },
    { label: "Leave Approval", path: "/leave-approval" },
    { label: "Calendar", path: "/leave-calendar" },
    { label: "Leave Request", path: "/leave-request" },
  ];

  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All Departments");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const departments = useMemo(() => {
    const s = new Set(["All Departments"]);
    MOCK_EMPLOYEES.forEach(e => s.add(e.department));
    return Array.from(s);
  }, []);

  const filtered = useMemo(() => {
    const bySearch = (e) =>
      e.name.toLowerCase().includes(q.toLowerCase());
    const byDept = (e) =>
      dept === "All Departments" ? true : e.department === dept;
    return MOCK_EMPLOYEES.filter((e) => bySearch(e) && byDept(e));
  }, [q, dept]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const onExportCSV = () => {
    alert("CSV Export functionality goes here!");
  };

  return (
    <div className="leaves-container">
      <Sidebar />
      <div className="leaves-content">
        <Header />

        {/* ✅ Header */}
        <header className="leaves-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Leave Management</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Employee Leaves</span>
            </div>
            <h1 className="page-title">Employee Leaves</h1>
          </div>
        </header>

        {/* ✅ Tabs */}
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

        {/* ✅ Filters */}
        <div className="leaves-filters">
          <input
            className="filter-employee"
            placeholder="Filter by Employee Name..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
          <select
            className="filter-dept"
            value={dept}
            onChange={(e) => { setDept(e.target.value); setPage(1); }}
          >
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <div className="filters-actions">
            <button className="btn ghost">View Short Leave Counts</button>
            <button className="btn primary" onClick={onExportCSV}>
              ⬇ Export to CSV
            </button>
          </div>
        </div>

        {/* ✅ Content (Employee Leaves Table) */}
        <div className="leaves-table-card">
          <table className="leaves-table">
            <thead>
              <tr>
                <th>Emp No</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Annual Leave</th>
                <th>Casual Leave</th>
                <th>Half Day</th>
                
              </tr>
            </thead>
            <tbody>
              {current.map((e, index) => (
                <tr key={index}>
                  <td>{(page - 1) * pageSize + index + 1}</td>
                  <td className="emp-name">{e.name}</td>
                  <td>{e.department}</td>
                  <td>{e.annualUsed.toFixed(2)} / {e.annualTotal}</td>
                  <td>{e.casualUsed.toFixed(2)} / {e.casualTotal}</td>
                  <td>{e.halfDay1}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>

          {/* 📍 Pagination */}
          <div className="leaves-pagination">
            <button className="pager-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
            <span className="page-indicator">Page {page} of {pageCount}</span>
            <button className="pager-btn" disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaves;
