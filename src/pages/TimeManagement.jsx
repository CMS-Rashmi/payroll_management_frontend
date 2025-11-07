// src/pages/TimeManagement.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

const TimeManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Tabs
  const tabs = [
    { label: "Overview", path: "/attendance-overview" },
    { label: "Time Management", path: "/time-management" },
    { label: "Absence Report", path: "/absence-report" },
    { label: "Attendance Adjustment", path: "/attendance-adjustment" },
    { label: "Check In & Check Out Report", path: "/checkin-checkout-report" },
  ];

  // ✅ Example Timetable Data
  const [timetables, setTimetables] = useState([
    {
      name: "Morning Shift",
      checkInStart: "07:00:00",
      checkInEnd: "08:30:00",
      checkOutStart: "17:45:00",
      checkOutEnd: "23:59:00",
    },
    {
      name: "IT Department",
      checkInStart: "07:00:00",
      checkInEnd: "08:30:00",
      checkOutStart: "17:45:00",
      checkOutEnd: "23:59:00",
    },
  ]);

  // ✅ Filtered data based on search
  const filteredTimetables = timetables.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Handle new timetable form
  const [newTimetable, setNewTimetable] = useState({
    name: "",
    checkInStart: "",
    checkInEnd: "",
    graceStart: "",
    graceEnd: "",
    checkOutStart: "",
    checkOutEnd: "",
    type: "Roster",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTimetable({ ...newTimetable, [name]: value });
  };

  const handleCreateTimetable = () => {
    if (!newTimetable.name) {
      alert("Please enter a timetable name.");
      return;
    }

    const newEntry = {
      name: newTimetable.name,
      checkInStart: newTimetable.checkInStart || "N/A",
      checkInEnd: newTimetable.checkInEnd || "N/A",
      checkOutStart: newTimetable.checkOutStart || "N/A",
      checkOutEnd: newTimetable.checkOutEnd || "N/A",
    };

    setTimetables([...timetables, newEntry]);
    setShowModal(false);
    setNewTimetable({
      name: "",
      checkInStart: "",
      checkInEnd: "",
      graceStart: "",
      graceEnd: "",
      checkOutStart: "",
      checkOutEnd: "",
      type: "Roster",
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <Layout>
      {/* Fixed Header Section */}
      <PageHeader
        breadcrumb={["Time & Attendance", "Time Management"]}
        title="Timetable Management"
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

      {/* Search and Actions Card */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
          <div style={{ flex: 1, maxWidth: '400px' }}>
            <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Search</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                className="input"
                placeholder="Search by Timetable Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: 1 }}
              />
              {searchTerm && (
                <button className="btn btn-soft" onClick={clearSearch}>
                  Clear
                </button>
              )}
            </div>
<<<<<<< HEAD
            <h1 className="page-title">Time Management</h1>
=======
>>>>>>> dev-shanika
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
            style={{ whiteSpace: "nowrap" }}
          >
            + Create Timetable
          </button>
        </div>
        
        <div style={{ marginTop: "12px", fontSize: "14px", color: "var(--muted)" }}>
          {filteredTimetables.length} timetable(s) found
        </div>
      </div>

      {/* Timetable Table Section */}
      <div className="table-container">
        <div className="card" style={{ padding: 0 }}>
          <div style={{ 
            padding: "12px 16px", 
            borderBottom: "1px solid var(--border)", 
            display: "flex", 
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ fontWeight: "700" }}>Timetables</div>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>
              Showing {filteredTimetables.length} records
            </div>
          </div>

          <div style={{ overflowX: "auto", flex: 1 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Timetable Name</th>
                  <th>Start Check-in Time</th>
                  <th>End Check-in Time</th>
                  <th>Start Check-out Time</th>
                  <th>End Check-out Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimetables.length > 0 ? (
                  filteredTimetables.map((timetable, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: "600" }}>{timetable.name}</td>
                      <td>{timetable.checkInStart}</td>
                      <td>{timetable.checkInEnd}</td>
                      <td>{timetable.checkOutStart}</td>
                      <td>{timetable.checkOutEnd}</td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button className="btn btn-soft" style={{ fontSize: "12px", padding: "4px 8px" }}>
                            Edit
                          </button>
                          <button className="btn btn-soft" style={{ fontSize: "12px", padding: "4px 8px", color: "var(--danger)" }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                      No timetables found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
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
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--panel)',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '800px',
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
              <h2 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>Create Timetable</h2>
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
              {/* Timetable Form Section */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Timetable Details</h3>
                
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Name *</label>
                  <input
                    className="input"
                    type="text"
                    name="name"
                    placeholder="Enter timetable name"
                    value={newTimetable.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid-3" style={{ gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Check-In Start Time *</label>
                    <input
                      className="input"
                      type="time"
                      name="checkInStart"
                      value={newTimetable.checkInStart}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Check-In End Time *</label>
                    <input
                      className="input"
                      type="time"
                      name="checkInEnd"
                      value={newTimetable.checkInEnd}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Type *</label>
                    <select 
                      className="select"
                      name="type"
                      value={newTimetable.type}
                      onChange={handleInputChange}
                    >
                      <option>Roster</option>
                      <option>Fixed</option>
                    </select>
                  </div>
                </div>

                <div className="grid-3" style={{ gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Grace Period Start</label>
                    <input
                      className="input"
                      type="time"
                      name="graceStart"
                      value={newTimetable.graceStart}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Grace Period End</label>
                    <input
                      className="input"
                      type="time"
                      name="graceEnd"
                      value={newTimetable.graceEnd}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div></div> {/* Empty spacer */}
                </div>

                <div className="grid-2" style={{ gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Check-Out Start Time *</label>
                    <input
                      className="input"
                      type="time"
                      name="checkOutStart"
                      value={newTimetable.checkOutStart}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Check-Out End Time *</label>
                    <input
                      className="input"
                      type="time"
                      name="checkOutEnd"
                      value={newTimetable.checkOutEnd}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Assign Employees Section */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Assign Employees to Timetable</h3>
                
                <div style={{ marginBottom: "12px" }}>
                  <input
                    className="input"
                    type="text"
                    placeholder="Search by Employee"
                    style={{ maxWidth: '300px' }}
                  />
                </div>
                
                <div style={{ border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
                  <table className="table" style={{ margin: 0 }}>
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>First Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>EMP02490</td>
                        <td>Savindi</td>
                      </tr>
                      <tr>
                        <td>EMP02552</td>
                        <td>Kalpani</td>
                      </tr>
                      <tr>
                        <td>EMP02589</td>
                        <td>Eranga</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button 
                  className="btn btn-soft" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleCreateTimetable}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TimeManagement;