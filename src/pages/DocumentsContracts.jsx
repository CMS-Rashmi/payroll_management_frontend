<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/DocumentsContracts.css';
import Header from '../components/Header';
=======
// src/pages/DocumentsContracts.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
>>>>>>> dev-shanika

export default function DocumentsContracts() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [employeeFilter, setEmployeeFilter] = useState("All Employees");
  const [documentTypeFilter, setDocumentTypeFilter] = useState("All Document Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const documentsData = [
    {
      id: 1,
      name: "Employment Contract 1.2 MB",
      employee: "Jeremy Neigh EMP001",
      employeeName: "Jeremy Neigh",
      type: "Contract",
      uploadedDate: "2022-01-15 by HR Admin",
      expiryDate: "2025-01-14",
      status: "Active",
      actions: "💶 💷 💸",
    },
    {
      id: 2,
      name: "NDA Agreement 0.8 MB",
      employee: "Jeremy Neigh EMP001",
      employeeName: "Jeremy Neigh",
      type: "Legal",
      uploadedDate: "2022-01-15 by HR Admin",
      expiryDate: "2025-01-14",
      status: "Active",
      actions: "💶 💷 💸",
    },
    {
      id: 3,
      name: "Employment Contract 3.3 MB",
      employee: "Jane Smith EMP002",
      employeeName: "Jane Smith",
      type: "Contract",
      uploadedDate: "2021-03-03 by HR Admin",
      expiryDate: "2024-03-02",
      status: "Active",
      actions: "💶 💷 💸",
    },
    {
      id: 4,
      name: "Performance Improvement Plan 6.5 MB",
      employee: "Robert Johnson EMP003",
      employeeName: "Robert Johnson",
      type: "HR Document",
      uploadedDate: "2023-08-10 by Emily Davis",
      expiryDate: "2023-12-10",
      status: "Expiring Soon",
      actions: "💶 💷 💸",
    },
    {
      id: 5,
      name: "Resignation Letter 0.2 MB",
      employee: "Emily Davis EMP004",
      employeeName: "Emily Davis",
      type: "HR Document",
      uploadedDate: "2023-05-20 by Emily Davis",
      expiryDate: "N/A",
      status: "Archived",
      actions: "💶 💷 💸",
    },
  ];

  // Get unique values for filters
  const employeeOptions = ["All Employees", ...new Set(documentsData.map((doc) => doc.employeeName))];
  const documentTypeOptions = ["All Document Types", ...new Set(documentsData.map((doc) => doc.type))];
  const statusOptions = ["All Statuses", ...new Set(documentsData.map((doc) => doc.status))];

  // Filter documents based on selected filters
  const filteredDocuments = documentsData.filter((doc) => {
    const matchesEmployee = employeeFilter === "All Employees" || doc.employeeName === employeeFilter;
    const matchesDocumentType = documentTypeFilter === "All Document Types" || doc.type === documentTypeFilter;
    const matchesStatus = statusFilter === "All Statuses" || doc.status === statusFilter;

    return matchesEmployee && matchesDocumentType && matchesStatus;
  });

  // ✅ Helper: format to MM/DD/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "N/A") return dateStr;

    // split off "by ..." if it exists
    const [datePart, byPart] = dateStr.split(" by");
    const date = new Date(datePart);

    if (isNaN(date)) return dateStr; // fallback if invalid date

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return byPart ? `${month}/${day}/${year} by${byPart}` : `${month}/${day}/${year}`;
  };

  // Reset all filters
  const handleResetFilters = () => {
    setEmployeeFilter("All Employees");
    setDocumentTypeFilter("All Document Types");
    setStatusFilter("All Statuses");
  };

  return (
<<<<<<< HEAD
    <div className="documents-contracts-container">
      <Sidebar />
      
      <div className="documents-contracts-content">
      <Header/>
        {/* Header */}
        <header className="documents-contracts-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Employee Information Management</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Documents & Contracts</span>
            </div>
            <h1 className="page-title">Employee Information Management</h1>
          </div>
          
        </header>
=======
    <Layout>
      {/* Fixed Header Section */}
      <PageHeader
        breadcrumb={["Employee Information", "Documents & Contracts"]}
        title="Employee Information Management"
      />
>>>>>>> dev-shanika

      {/* Fixed Tabs Section */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        backgroundColor: 'var(--bg)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="card" style={{ 
          display: "flex", 
          gap: "8px", 
          overflowX: "auto", 
          whiteSpace: "nowrap",
          marginBottom: 0,
          borderRadius: '0'
        }}>
          {[
            { label: "Overview", path: "/employee-info" },
            { label: "Add Employee", path: "/add-employee" },
            { label: "Attendance & Leave Records", path: "/attendance-leave" },
            { label: "Performance & Training", path: "/performance-training" },
            { label: "Documents & Contracts", path: "/documents-contracts" },
            { label: "Audit Logs", path: "/audit-logs" },
          ].map((t) => (
            <button
              key={t.path}
              className={`btn ${location.pathname === t.path ? "btn-primary" : "btn-soft"}`}
              onClick={() => navigate(t.path)}
              style={{ whiteSpace: "nowrap", flexShrink: 0 }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Filters Card */}
        <div className="card">
          <div className="grid-3" style={{ alignItems: "end", marginBottom: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                Employee
              </label>
              <select 
                className="select"
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
              >
                {employeeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                Document Type
              </label>
              <select 
                className="select"
                value={documentTypeFilter}
                onChange={(e) => setDocumentTypeFilter(e.target.value)}
              >
                {documentTypeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                Status
              </label>
              <select 
                className="select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {(employeeFilter !== "All Employees" || documentTypeFilter !== "All Document Types" || statusFilter !== "All Statuses") && (
                <button className="btn btn-soft" onClick={handleResetFilters}>
                  Reset Filters
                </button>
              )}
            </div>
            <button className="btn btn-primary">
              Upload Documents
            </button>
          </div>
        </div>

        {/* Attention Alert */}
        <div className="card" style={{ 
          background: "var(--soft)", 
          border: "1px solid var(--brand)",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px"
        }}>
          <div style={{ 
            color: "var(--brand)", 
            fontWeight: "bold",
            fontSize: "16px",
            lineHeight: "1"
          }}>•</div>
          <div>
            <div style={{ fontWeight: "600", color: "#333", marginBottom: "4px" }}>
              Documents Requiring Attention
            </div>
            <div style={{ fontSize: "13px", color: "var(--muted)" }}>
              1 document is expiring within the next 30 days. Please review and take necessary action.
            </div>
          </div>
        </div>

        {/* Documents Table Section */}
        <div className="table-container">
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center" }}>
              <div style={{ fontWeight: "700" }}>Documents & Contracts</div>
              <div style={{ marginLeft: "auto", fontSize: "12px", color: "var(--muted)" }}>
                {filteredDocuments.length} document(s)
              </div>
            </div>

            <div style={{ overflowX: "auto", flex: 1 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Uploaded Date</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: "600" }}>{item.name}</td>
                      <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div className="user-avatar" />
                        <div>
                          <div style={{ fontWeight: "600" }}>{item.employeeName}</div>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                            {item.employee.split(' ').pop()}
                          </div>
                        </div>
                      </td>
                      <td>{item.type}</td>
                      <td>{formatDate(item.uploadedDate)}</td>
                      <td>{formatDate(item.expiryDate)}</td>
                      <td>
                        <span
                          className={`pill ${
                            item.status === "Active"
                              ? "pill-ok"
                              : item.status === "Expiring Soon"
                              ? "pill-warn"
                              : ""
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button className="btn btn-soft" style={{ padding: "4px 8px", fontSize: "12px" }}>
                            View
                          </button>
                          <button className="btn btn-soft" style={{ padding: "4px 8px", fontSize: "12px" }}>
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!filteredDocuments.length && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                        No documents found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="card">
          <div style={{ 
            border: "2px dashed var(--border)", 
            borderRadius: "8px",
            padding: "32px",
            textAlign: "center",
            marginBottom: "16px"
          }}>
            <p style={{ marginBottom: "8px", color: "var(--text)" }}>
              Drag and drop files here, or click to browse
            </p>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
              Accepted formats: PDF, XLSX, CSV (Max 10MB)
            </span>
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }}>
            Upload Documents
          </button>
        </div>
      </div>
    </Layout>
  );
}