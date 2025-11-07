// src/pages/PerformanceTraining.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

export default function PerformanceTraining() {
  const navigate = useNavigate();
  const location = useLocation();

  const performanceData = [
    {
      id: 1,
      employee: "Jeremy Neigh (EMP01)",
      department: "Engineering - Senior Developer",
      rating: "4.5 ★",
      lastReview: "2023-06-15 by Michael Wilson",
      strengths: "• Technical expertise • Problem solving • Team collaboration",
      improvements: "• Documentation • Time management",
    },
    {
      id: 2,
      employee: "Annette Black (EMP02)",
      department: "Marketing - Manager",
      rating: "4.2 ★",
      lastReview: "2023-05-20 by Robert Johnson",
      strengths: "• Leadership • Communication • Strategic planning",
      improvements: "• Delegation",
    },
    {
      id: 3,
      employee: "Theresa Webb (EMP03)",
      department: "HR - Specialist",
      rating: "4.3 ★",
      lastReview: "2023-07-05 by Emily Davis",
      strengths: "• Conflict resolution • Policy knowledge • Recruitment",
      improvements: "• Technology adoption • Process improvement",
    },
  ];

  const trainingData = [
    {
      id: 1,
      employee: "Jeremy Neigh (EMP01)",
      trainingCourse: "Advanced React Development",
      status: "Completed",
      dateRange: "2023-04-10 to 2023-04-15",
      score: "95%",
      certificate: "Available",
    },
    {
      id: 2,
      employee: "Annette Black (EMP02)",
      trainingCourse: "Digital Marketing Masterclass",
      status: "In Progress",
      dateRange: "2023-10-01 to 2023-11-15",
      score: "N/A",
      certificate: "Not Available",
    },
    {
      id: 3,
      employee: "Theresa Webb (EMP03)",
      trainingCourse: "HR Compliance Update 2023",
      status: "Scheduled",
      dateRange: "2023-11-20 to 2023-11-22",
      score: "N/A",
      certificate: "Not Available",
    },
  ];

  // ✅ Helper to format dates into MM/DD/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return dateStr;

    // handle ranges like "2023-04-10 to 2023-04-15"
    if (dateStr.includes("to")) {
      const [start, end] = dateStr.split("to").map((d) => d.trim());
      return `${formatDate(start)} to ${formatDate(end)}`;
    }

    // handle "date by reviewer"
    const [datePart, byPart] = dateStr.split(" by");
    const date = new Date(datePart);

    if (isNaN(date)) return dateStr; // if invalid date, return original

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return byPart ? `${month}/${day}/${year} by${byPart}` : `${month}/${day}/${year}`;
  };

  const handleAddPerformanceReview = () => {
    alert("Add Performance Review functionality coming soon!");
  };

  const handleScheduleTraining = () => {
    alert("Schedule Training functionality coming soon!");
  };

  return (
    <Layout>
      {/* Fixed Header Section */}
      <PageHeader
        breadcrumb={["Employee Information", "Performance & Training"]}
        title="Employee Information Management"
      />

      {/* Fixed Tabs Section - Won't scroll away */}
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
        {/* Performance Section */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>Performance Ratings</h3>
            <button className="btn btn-primary" onClick={handleAddPerformanceReview}>
              + Add Performance Review
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department / Position</th>
                  <th>Rating</th>
                  <th>Last Review</th>
                  <th>Strengths</th>
                  <th>Improvements</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((item) => (
                  <tr key={item.id}>
                    <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="user-avatar" />
                      <div style={{ fontWeight: "600" }}>{item.employee.split(" (")[0]}</div>
                    </td>
                    <td>{item.department}</td>
                    <td>
                      <span className="pill pill-ok">{item.rating}</span>
                    </td>
                    <td>{formatDate(item.lastReview)}</td>
                    <td style={{ fontSize: "11px", lineHeight: "1.4" }}>{item.strengths}</td>
                    <td style={{ fontSize: "11px", lineHeight: "1.4" }}>{item.improvements}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Training Section */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>Training Records</h3>
            <button className="btn btn-primary" onClick={handleScheduleTraining}>
              + Assign New Training
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Training Course</th>
                  <th>Status</th>
                  <th>Date Range</th>
                  <th>Score</th>
                  <th>Certificate</th>
                </tr>
              </thead>
              <tbody>
                {trainingData.map((item) => (
                  <tr key={item.id}>
                    <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="user-avatar" />
                      <div style={{ fontWeight: "600" }}>{item.employee.split(" (")[0]}</div>
                    </td>
                    <td>{item.trainingCourse}</td>
                    <td>
                      <span
                        className={`pill ${
                          item.status === "Completed"
                            ? "pill-ok"
                            : item.status === "In Progress"
                            ? "pill-warn"
                            : ""
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{formatDate(item.dateRange)}</td>
                    <td>{item.score}</td>
                    <td>
                      <span
                        className={`pill ${
                          item.certificate === "Available" ? "pill-ok" : ""
                        }`}
                      >
                        {item.certificate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}