// src/pages/ETFEPF.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import { apiGet, apiPost, apiPut, apiDelete } from "../services/api";
import { etfEpfApi } from '../services/api';

export default function ETFEPF() {
  const navigate = useNavigate();
  const location = useLocation();

  // Data states
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [employeeFilter, setEmployeeFilter] = useState("All Employees");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [epfFilter, setEpfFilter] = useState("");
  const [etfFilter, setEtfFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: "",
    epf_number: "",
    etf_number: "",
    epf_effective_date: "",
    etf_effective_date: "",
    epf_status: "Active",
    etf_status: "Active"
  });

  

  // Fetch data
  useEffect(() => {
    fetchETFEPFData();
  }, []);

  const fetchETFEPFData = async () => {
    try {
      setLoading(true);
      setError("");
      const resp = await apiGet("/salary/etf-epf");
      const data = Array.isArray(resp.data) ? resp.data : resp.data?.data || [];
      setRows(data);
    } catch (e) {
      console.error(e);
      setError("Failed to load ETF/EPF data");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // Build filter options from data
  const employeeOptions = useMemo(() => {
    const names = Array.from(new Set(rows.map((r) => r.full_name))).filter(Boolean).sort();
    return ["All Employees", ...names];
  }, [rows]);

  const departmentOptions = useMemo(() => {
    const depts = Array.from(new Set(rows.map((r) => r.department || ""))).filter(Boolean).sort();
    return ["All Departments", ...depts];
  }, [rows]);

  // Filter logic
  const filtered = useMemo(() => {
    let data = rows;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (r) =>
          r.full_name?.toLowerCase().includes(q) ||
          r.employee_id?.toString().includes(q) ||
          r.epf_number?.toLowerCase().includes(q) ||
          r.etf_number?.toLowerCase().includes(q)
      );
    }

    if (employeeFilter !== "All Employees") {
      data = data.filter((r) => r.full_name === employeeFilter);
    }

    if (departmentFilter !== "All Departments") {
      data = data.filter((r) => (r.department || "") === departmentFilter);
    }

    if (epfFilter.trim()) {
      data = data.filter((r) => r.epf_number?.includes(epfFilter));
    }

    if (etfFilter.trim()) {
      data = data.filter((r) => r.etf_number?.includes(etfFilter));
    }

    return data;
  }, [rows, searchTerm, employeeFilter, departmentFilter, epfFilter, etfFilter]);

  const handleResetFilters = () => {
    setEmployeeFilter("All Employees");
    setDepartmentFilter("All Departments");
    setEpfFilter("");
    setEtfFilter("");
    setSearchTerm("");
  };

  // Modal handlers
  const openAddModal = async () => {
  try {
    // Fetch employees without ETF/EPF records
    const resp = await etfEpfApi.getEmployeesWithout();
    setEmployeesWithoutEtfEpf(resp.data || []);
    
    setEditingEmployee(null);
    setFormData({
      employee_id: "",
      epf_number: "",
      etf_number: "",
      epf_effective_date: "",
      etf_effective_date: "",
      epf_status: "Active",
      etf_status: "Active",
      epf_contribution_rate: 8.00,
      employer_epf_rate: 12.00,
      etf_contribution_rate: 3.00
    });
    setShowModal(true);
  } catch (e) {
    console.error(e);
    window.alert("Failed to load employees");
  }
 };


  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      employee_id: employee.employee_id,
      epf_number: employee.epf_number || "",
      etf_number: employee.etf_number || "",
      epf_effective_date: employee.epf_effective_date || "",
      etf_effective_date: employee.etf_effective_date || "",
      epf_status: employee.epf_status || "Active",
      etf_status: employee.etf_status || "Active"
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
  };

  const handleFormChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (editingEmployee) {
      await etfEpfApi.update(editingEmployee.id, formData);
    } else {
      await etfEpfApi.create(formData);
    }
    closeModal();
    fetchETFEPFData();
    window.alert(editingEmployee ? "ETF/EPF details updated successfully" : "ETF/EPF details added successfully");
  } catch (e) {
    console.error(e);
    window.alert(e.message || "Failed to save ETF/EPF details");
  }
 };

  const handleDelete = async (employee) => {
  if (!window.confirm(`Delete ETF/EPF details for ${employee.full_name}?`)) return;
  
  try {
    await etfEpfApi.delete(employee.id);
    fetchETFEPFData();
    window.alert("ETF/EPF details deleted successfully");
  } catch (e) {
    console.error(e);
    window.alert("Failed to delete ETF/EPF details");
  }
 };

 const handleCalculateContributions = async (employee) => {
  try {
    // Get employee's basic salary
    const salaryResp = await apiGet(`/salary/basic?employee_id=${employee.employee_id}`);
    const basicSalary = salaryResp.basic_salary;
    
    if (!basicSalary) {
      window.alert("No basic salary found for this employee");
      return;
    }
    
    const resp = await etfEpfApi.calculate({
      employeeId: employee.employee_id,
      basicSalary: basicSalary
    });
    
    const contributions = resp.data;
    
    window.alert(
      `ETF/EPF Contributions for ${employee.full_name}:\n\n` +
      `Basic Salary: Rs ${contributions.basic_salary.toLocaleString()}\n` +
      `Employee EPF (${contributions.rates.employee_epf}%): Rs ${contributions.employee_epf_contribution}\n` +
      `Employer EPF (${contributions.rates.employer_epf}%): Rs ${contributions.employer_epf_contribution}\n` +
      `Employer ETF (${contributions.rates.employer_etf}%): Rs ${contributions.employer_etf_contribution}\n` +
      `Total EPF Contribution: Rs ${contributions.total_epf_contribution}\n` +
      `Total Employer Contribution: Rs ${contributions.total_employer_contribution}`
    );
  } catch (e) {
    console.error(e);
    window.alert("Failed to calculate contributions");
  }
 };

  

  // Export to CSV
  const handleExport = () => {
    if (!filtered.length) {
      alert("No data to export.");
      return;
    }
    const csvRows = [];
    const header = [
      "Employee ID", "Employee Name", "Department", "EPF Number", "ETF Number", 
      "EPF Effective Date", "ETF Effective Date", "EPF Status", "ETF Status"
    ];
    csvRows.push(header.join(","));

    filtered.forEach((r) => {
      const row = [
        r.employee_id,
        r.full_name || "",
        r.department || "",
        r.epf_number || "",
        r.etf_number || "",
        r.epf_effective_date || "",
        r.etf_effective_date || "",
        r.epf_status || "",
        r.etf_status || "",
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ETF_EPF_Data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return dateString;
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <Layout>
      {/* Fixed Header Section */}
      <PageHeader breadcrumb={["Salary & Compensation", "ETF & EPF"]} title="Salary & Compensation" />

      {/* Fixed Tabs Section */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="card"
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            whiteSpace: "nowrap",
            marginBottom: 0,
            borderRadius: "0",
          }}
        >
          {[
            { label: "Earnings", path: "/earnings" },
            { label: "Deductions", path: "/deductions" },
            { label: "Allowances", path: "/allowances" },
            { label: "Overtime & Adjustments", path: "/overtime-adjustments" },
            { label: "Compensation Adjustment", path: "/compensation-adjustment" },
            { label: "ETF & EPF", path: "/etf-epf" },
            { label: "Unpaid Leaves", path: "/unpaid-leaves" },
            { label: "Net Salary Summary", path: "/net-salary-summary" },
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

      {/* Fixed Filters Section */}
      <div
        style={{
          position: "sticky",
          top: "56px",
          zIndex: 90,
          backgroundColor: "var(--bg)",
        }}
      >
        {/* Filters Card */}
        <div className="card">
          <div className="grid-3" style={{ alignItems: "end", marginBottom: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                Employee
              </label>
              <select className="select" value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)}>
                {employeeOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                Department
              </label>
              <select className="select" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
                {departmentOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                EPF Number
              </label>
              <input
                className="input"
                placeholder="Filter by EPF number"
                value={epfFilter}
                onChange={(e) => setEpfFilter(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                ETF Number
              </label>
              <input
                className="input"
                placeholder="Filter by ETF number"
                value={etfFilter}
                onChange={(e) => setEtfFilter(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                Search
              </label>
              <input
                className="input"
                placeholder="Name, ID, EPF, ETF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", alignItems: "end", gap: "8px" }}>
              <button className="btn btn-primary" onClick={handleExport} style={{ flex: 1 }}>
                Export CSV
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {(employeeFilter !== "All Employees" || departmentFilter !== "All Departments" || epfFilter || etfFilter || searchTerm) && (
                <button className="btn btn-soft" onClick={handleResetFilters}>
                  Reset Filters
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn btn-primary" onClick={openAddModal}>
                + Add ETF/EPF
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="card" style={{ color: "var(--danger)", background: "#fef2f2" }}>
            {error}
          </div>
        )}
      </div>

      {/* Scrollable Table Section */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="table-container" style={{ marginTop: 0, flex: 1, minHeight: 0 }}>
          <div className="card" style={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              padding: "12px 16px", 
              borderBottom: "1px solid var(--border)", 
              display: "flex", 
              alignItems: "center",
              flexShrink: 0
            }}>
              <div style={{ fontWeight: "700" }}>ETF & EPF Management</div>
              <div style={{ marginLeft: "auto", fontSize: "12px", color: "var(--muted)" }}>
                {loading ? "Loading..." : `${filtered.length} employee(s)`}
              </div>
            </div>

            {loading ? (
              <div style={{ padding: "16px", flex: 1 }}>Loading ETF/EPF data...</div>
            ) : (
              <div style={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
                <table className="table">
                  <thead style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f8f9fa",
                    zIndex: 10
                  }}>
                    <tr>
                      <th>Employee ID</th>
                      <th>Employee Name</th>
                      <th>Department</th>
                      <th>EPF Number</th>
                      <th>ETF Number</th>
                      <th>EPF Effective Date</th>
                      <th>ETF Effective Date</th>
                      <th>EPF Status</th>
                      <th>ETF Status</th>
                      <th style={{ width: "180px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((employee) => (
                        <tr key={employee.employee_id}>
                        <td>{employee.employee_id}</td>
                        <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div className="user-avatar" />
                            <div style={{ fontWeight: "600" }}>{employee.full_name || "-"}</div>
                        </td>
                        <td>{employee.department || "-"}</td>
                        <td>{employee.employee_code || "-"}</td>
                        <td>{employee.epf_number || "-"}</td>
                        <td>{employee.etf_number || "-"}</td>
                        <td>{formatDate(employee.epf_effective_date)}</td>
                        <td>{formatDate(employee.etf_effective_date)}</td>
                        <td>
                            <span className={`pill ${employee.epf_status === "Active" ? "pill-ok" : employee.epf_status === "Not Set" ? "pill-info" : "pill-warn"}`}>
                            {employee.epf_status || "Not Set"}
                            </span>
                        </td>
                        <td>
                            <span className={`pill ${employee.etf_status === "Active" ? "pill-ok" : employee.etf_status === "Not Set" ? "pill-info" : "pill-warn"}`}>
                            {employee.etf_status || "Not Set"}
                            </span>
                        </td>
                        <td>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {employee.has_etf_epf_record === 'Yes' ? (
                                <>
                                <button 
                                    className="btn btn-soft" 
                                    onClick={() => handleViewDetails(employee)}
                                    style={{ fontSize: "11px", padding: "4px 8px" }}
                                >
                                    View Details
                                </button>
                                <button 
                                    className="btn btn-soft" 
                                    onClick={() => openEditModal(employee)}
                                    style={{ fontSize: "11px", padding: "4px 8px" }}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="btn btn-soft" 
                                    onClick={() => handleDelete(employee)}
                                    style={{ 
                                    fontSize: "11px", 
                                    padding: "4px 8px",
                                    background: "#fef2f2",
                                    color: "#dc2626",
                                    border: "1px solid #fecaca"
                                    }}
                                >
                                    Delete
                                </button>
                                <button 
                                    className="btn btn-soft" 
                                    onClick={() => handleCalculateContributions(employee)}
                                    style={{ 
                                    fontSize: "11px", 
                                    padding: "4px 8px",
                                    background: "#f0f9ff",
                                    color: "#0369a1",
                                    border: "1px solid #bae6fd"
                                    }}
                                >
                                    Calculate
                                </button>
                                </>
                            ) : (
                                <button 
                                className="btn btn-primary" 
                                onClick={() => openAddModalForEmployee(employee)}
                                style={{ fontSize: "11px", padding: "4px 8px" }}
                                >
                                Add ETF/EPF
                                </button>
                            )}
                            </div>
                        </td>
                        </tr>
                    ))}
                    {!filtered.length && (
                        <tr>
                        <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                            No employees found.
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editingEmployee ? "Edit ETF/EPF Details" : "Add ETF/EPF Details"}</h3>

            <form onSubmit={handleSubmit}>.

            
                {!editingEmployee && formData.employee_id && (
                <div style={{ marginBottom: "12px", padding: "8px", background: "#f8f9fa", borderRadius: "4px" }}>
                    <div style={{ fontSize: "12px", color: "#666" }}>Adding ETF/EPF for:</div>
                    <div style={{ fontWeight: "600" }}>
                    {rows.find(emp => emp.employee_id === formData.employee_id)?.full_name} 
                    (ID: {formData.employee_id})
                    </div>
                </div>
                )}


              <div style={{ marginBottom: "12px" }}>
                <label>Employee ID *</label>
                <input
                  type="text"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleFormChange}
                  required
                  disabled={!!editingEmployee}
                />
              </div>

              <div className="grid-2" style={{ gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label>EPF Number</label>
                  <input
                    type="text"
                    name="epf_number"
                    value={formData.epf_number}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label>ETF Number</label>
                  <input
                    type="text"
                    name="etf_number"
                    value={formData.etf_number}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label>EPF Effective Date</label>
                  <input
                    type="date"
                    name="epf_effective_date"
                    value={formData.epf_effective_date}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label>ETF Effective Date</label>
                  <input
                    type="date"
                    name="etf_effective_date"
                    value={formData.etf_effective_date}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: "12px", marginBottom: "16px" }}>
                <div>
                  <label>EPF Status</label>
                  <select name="epf_status" value={formData.epf_status} onChange={handleFormChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label>ETF Status</label>
                  <select name="etf_status" value={formData.etf_status} onChange={handleFormChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-soft" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEmployee ? "Update" : "Add"} Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}