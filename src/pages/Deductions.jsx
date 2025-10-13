import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from '../components/Header';
import "../styles/Deductions.css";

const Deductions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("deductions");
  const [deductions, setDeductions] = useState([]);

  // Load saved deductions from localStorage
  useEffect(() => {
    const storedDeductions = JSON.parse(localStorage.getItem("deductions")) || [];
    setDeductions(storedDeductions);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <div className="deductions-container">
      <Sidebar />
      <div className="deductions-content">
        <Header/>
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
                  <th>Description</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Effective Date</th>
                </tr>
              </thead>
              <tbody>
                {deductions.length > 0 ? (
                  deductions.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.type}</td>
                      <td>{item.category}</td>
                      <td>{item.rate}</td>
                      <td>{item.amount}</td>
                      <td>
                        <span className={`status ${item.status === "Active" ? "active" : "inactive"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
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
