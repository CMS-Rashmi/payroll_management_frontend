// src/pages/EmployeeLeaves.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

const MOCK_EMPLOYEES = [
  { name: "Rashmi Jayathunga", department: "IT Department", annualUsed: 6.0, annualTotal: 14, casualUsed: 2.5, casualTotal: 7, halfDay1: "0 / 0", halfDay2: "0 / 0" },
  { name: "Nimesha Fernando", department: "Business Development", annualUsed: 11.0, annualTotal: 14, casualUsed: 3.0, casualTotal: 7, halfDay1: "0 / 0", halfDay2: "0 / 0" },
  { name: "Thilina Abeysekara", department: "Customer Care", annualUsed: 9.0, annualTotal: 14, casualUsed: 5.0, casualTotal: 7, halfDay1: "0 / 0", halfDay2: "0 / 0" },
  { name: "Sajini Weerasinghe", department: "HR", annualUsed: 11.0, annualTotal: 14, casualUsed: 0.0, casualTotal: 7, halfDay1: "0 / 0", halfDay2: "0 / 0" },
  { name: "Chathura Ranasinghe", department: "IT Department", annualUsed: 0.0, annualTotal: 14, casualUsed: 0.0, casualTotal: 7, halfDay1: "0 / 0", halfDay2: "0 / 0" },
  { name: "Isuri Karunaratne", department: "Finance", annualUsed: 7.5, annualTotal: 14, casualUsed: 4.0, casualTotal: 7, halfDay1: "0 / 0", halfDay2: "0 / 0" },
  { name: "Malith Perera", department: "Operations", annualUsed: 3.0, annualTotal: 14, casualUsed: 1.5, casualTotal: 7, halfDay1: "0 / 0", halfDay2: "0 / 0" },
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

  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const departments = useMemo(() => {
    const s = new Set(["All Departments"]);
    MOCK_EMPLOYEES.forEach(e => s.add(e.department));
    return Array.from(s);
  }, []);

  const filtered = useMemo(() => {
    const bySearch = (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase());
    const byDept = (e) =>
      deptFilter === "All Departments" ? true : e.department === deptFilter;
    return MOCK_EMPLOYEES.filter((e) => bySearch(e) && byDept(e));
  }, [searchTerm, deptFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const onExportCSV = () => {
    const headers = ['Employee Name', 'Department', 'Annual Leave Used', 'Annual Leave Total', 'Casual Leave Used', 'Casual Leave Total', 'Half Day 1', 'Half Day 2'];
    const csvRows = filtered.map(e => [
      e.name,
      e.department,
      e.annualUsed,
      e.annualTotal,
      e.casualUsed,
      e.casualTotal,
      e.halfDay1,
      e.halfDay2
    ]);
    
    const csv = [headers, ...csvRows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_leaves_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDeptFilter("All Departments");
    setPage(1);
  };

  const getLeaveProgress = (used, total) => {
    const percentage = (used / total) * 100;
    if (percentage >= 80) return { color: 'var(--danger)', width: `${percentage}%` };
    if (percentage >= 50) return { color: 'var(--warn)', width: `${percentage}%` };
    return { color: 'var(--success)', width: `${percentage}%` };
  };

  return (
    <Layout>
      {/* Fixed Header Section */}
      <PageHeader
        breadcrumb={["Leave Management", "Employee Leaves"]}
        title="Employee Leaves"
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
        <div style={{ display: "flex", gap: "16px", alignItems: "end", marginBottom: "12px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Search Employee</label>
            <input
              className="input"
              placeholder="Filter by Employee Name..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Department</label>
            <select 
              className="select" 
              value={deptFilter} 
              onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
            >
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <button className="btn btn-soft" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "14px", color: "var(--muted)" }}>
            {filtered.length} employee(s) found
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-soft">
              View Short Leave Counts
            </button>
            <button className="btn btn-primary" onClick={onExportCSV}>
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Employee Leaves Table */}
      <div className="table-container">
        <div className="card" style={{ padding: 0 }}>
          <div style={{ 
            padding: "12px 16px", 
            borderBottom: "1px solid var(--border)", 
            display: "flex", 
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ fontWeight: "700" }}>Employee Leave Balances</div>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>
              Showing {current.length} of {filtered.length} records
            </div>
          </div>

          <div style={{ overflowX: "auto", flex: 1 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Emp No</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Annual Leave</th>
                  <th>Casual Leave</th>
                  <th>Half Day</th>
                  <th>Leave Status</th>
                </tr>
              </thead>
              <tbody>
                {current.map((employee, index) => {
                  const annualProgress = getLeaveProgress(employee.annualUsed, employee.annualTotal);
                  const casualProgress = getLeaveProgress(employee.casualUsed, employee.casualTotal);
                  
                  return (
                    <tr key={index}>
                      <td>{(page - 1) * pageSize + index + 1}</td>
                      <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div className="user-avatar" />
                        <div style={{ fontWeight: "600" }}>{employee.name}</div>
                      </td>
                      <td>
                        <span className="pill" style={{ background: 'var(--soft)', color: 'var(--text)' }}>
                          {employee.department}
                        </span>
                      </td>
                      <td style={{ minWidth: '140px' }}>
                        <div style={{ marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>
                          {employee.annualUsed.toFixed(1)} / {employee.annualTotal} days
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '6px', 
                          backgroundColor: 'var(--soft)', 
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: annualProgress.width,
                            height: '100%',
                            backgroundColor: annualProgress.color,
                            borderRadius: '3px'
                          }} />
                        </div>
                      </td>
                      <td style={{ minWidth: '140px' }}>
                        <div style={{ marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>
                          {employee.casualUsed.toFixed(1)} / {employee.casualTotal} days
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '6px', 
                          backgroundColor: 'var(--soft)', 
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: casualProgress.width,
                            height: '100%',
                            backgroundColor: casualProgress.color,
                            borderRadius: '3px'
                          }} />
                        </div>
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--muted)' }}>
                        {employee.halfDay1}
                      </td>
                      <td>
                        <span className={`pill ${
                          employee.annualUsed >= employee.annualTotal * 0.8 ? "pill-warn" : 
                          employee.annualUsed >= employee.annualTotal * 0.5 ? "pill-soft" : 
                          "pill-ok"
                        }`}>
                          {employee.annualUsed >= employee.annualTotal * 0.8 ? "Critical" : 
                           employee.annualUsed >= employee.annualTotal * 0.5 ? "Moderate" : "Good"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "14px", color: "var(--muted)" }}>
          Showing {current.length} of {filtered.length} results (Page {page} of {pageCount})
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button 
            className="btn btn-soft" 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <button 
            className="btn btn-soft" 
            disabled={page === pageCount} 
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeLeaves;