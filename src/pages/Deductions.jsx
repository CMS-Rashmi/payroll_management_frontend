import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/Deductions.css";
import { apiGet, apiDelete } from "../services/api";
import { Pencil, Trash2 } from "lucide-react";

const Deductions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("deductions");
  const [deductions, setDeductions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Stable loader we can reuse
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiGet("/salary/deductions"); // backend returns employee_name too
      setDeductions(res.data || []);
    } catch {
      setDeductions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // initial fetch
  useEffect(() => {
    load();
  }, [load]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  const handleEdit = (row) => {
    // reuse AddDeduction page in "edit mode" using a query param
    navigate(`/add-deduction?id=${row.id}`);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete deduction "${row.name}" for employee #${row.employee_id}?`)) return;
    try {
      await apiDelete(`/salary/deductions/${row.id}`);
      // Optimistic update (no need to call load() again)
      setDeductions((prev) => prev.filter((d) => d.id !== row.id));
    } catch (e) {
      alert(e.message || "Failed to delete deduction");
    }
  };

  return (
    <div className="deductions-container">
      <Sidebar />
      <div className="deductions-content">
        <Header />
        <header className="deductions-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Salary & Compensation</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Deductions</span>
            </div>
            <h1 className="page-title">Salary & Compensation</h1>
          </div>
        </header>

        {/* Tabs */}
        <div className="deductions-tabs">
          {["earnings", "deductions", "allowances", "overtime", "compensation", "summary"].map((tab) => (
            <div
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab === "overtime"
                ? "Overtime & Adjustments"
                : tab === "compensation"
                ? "Compensation Adjustment"
                : tab === "summary"
                ? "Net Salary Summary"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="table-section-bottom">
          <div className="table-header">
            <h2>Deduction Configuration</h2>
            <div className="table-buttons">
              <button className="add-deduction-btn" onClick={() => navigate("/add-deduction")}>
                + Add Deduction
              </button>
              <button className="filter-btn">Filter</button>
            </div>
          </div>

          <div className="table-container">
            <table className="deductions-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Effective Date</th>
                  <th style={{ width: 110 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" style={{ padding: 20 }}>
                      Loading…
                    </td>
                  </tr>
                ) : deductions.length > 0 ? (
                  deductions.map((item) => (
                    <tr key={item.id}>
                      <td>{item.employee_id}</td>
                      <td>{item.employee_name || "-"}</td>
                      <td>{item.name}</td>
                      <td>{item.type}</td>
                      <td>{item.basis || ""}</td>
                      <td>{item.basis === "Percent" ? item.percent : "-"}</td>
                      <td>{item.basis === "Fixed" ? item.amount : "-"}</td>
                      <td>
                        <span className={`status ${item.status === "Active" ? "active" : "inactive"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.effective_date || ""}</td>
                      <td>
                        <div className="row-actions" style={{ display: "flex", gap: 8 }}>
                          <button
                            className="icon-btn"
                            title="Edit"
                            onClick={() => handleEdit(item)}
                            aria-label="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="icon-btn danger"
                            title="Delete"
                            onClick={() => handleDelete(item)}
                            aria-label="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      No deductions found. Click “Add Deduction” to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deductions;
