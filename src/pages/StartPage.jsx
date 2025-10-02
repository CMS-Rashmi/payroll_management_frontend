// src/pages/Start.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Start.css";

const StartPage = () => {
  const navigate = useNavigate();

  const handleHRDashboard = () => {
    navigate("/dashboard"); // HR dashboard path
  };

  const handleEmployeeDashboard = () => {
    navigate("/employee-info"); // Employee dashboard path
  };

  return (
    <div className="start-page">
      <div className="content-card">
        <h1 className="welcome-title">Welcome!</h1>
        <h2 className="system-title">The Payroll Management System</h2>

        <div className="dashboard-buttons">
          <button className="dashboard-btn hr-dashboard-btn" onClick={handleHRDashboard}>
            <div className="btn-icon">
              <div className="user-icon"></div>
            </div>
            <div className="btn-text">
              <span className="btn-title">HR</span>
              <span className="btn-subtitle">Dashboard</span>
            </div>
          </button>

          <button className="dashboard-btn employee-dashboard-btn" onClick={handleEmployeeDashboard}>
            <div className="btn-icon">
              <div className="user-icon outline"></div>
            </div>
            <div className="btn-text">
              <span className="btn-title">Employee</span>
              <span className="btn-subtitle">Dashboard</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
