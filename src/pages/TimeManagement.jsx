import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/TimeManagement.css";

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

  // ✅ Handle new timetable form (example only)
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

  return (
    <div className="time-management-container">
      <Sidebar />
      <div className="time-management-content">
        <Header />

        {/* Header Section */}
        <header className="time-management-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Time & Attendance</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Time Management</span>
            </div>
            <h1 className="page-title">Timetable Management</h1>
          </div>
        </header>

        {/* Tabs */}
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

        {/* Search Section */}
        <div className="search-bar">
          <div className="search-left">
            <input
              type="text"
              className="filter-input"
              placeholder="Search by Timetable Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="search-right">
            <button
              className="create-timetable-btn"
              onClick={() => setShowModal(true)}
            >
              <span className="plus-icon">＋</span> Create Timetable
            </button>
          </div>
        </div>

        {/* Timetable Table */}
        <div className="table-container">
          <table className="timetable-table">
            <thead>
              <tr>
                <th>Timetable Name</th>
                <th>Start Check-in Time</th>
                <th>End Check-in Time</th>
                <th>Start Check-out Time</th>
                <th>End Check-out Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimetables.length > 0 ? (
                filteredTimetables.map((timetable, index) => (
                  <tr key={index}>
                    <td>{timetable.name}</td>
                    <td>{timetable.checkInStart}</td>
                    <td>{timetable.checkInEnd}</td>
                    <td>{timetable.checkOutStart}</td>
                    <td>{timetable.checkOutEnd}</td>
                    <td>
                      <span className="edit-text">Edit</span> |{" "}
                      <span className="delete-text">Delete</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No timetables found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal fade-in">
              <div className="modal-header">
                <h2>Create Timetable</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                {/* Timetable Form Section */}
                <div className="form-section">
                  <div className="form-group full">
                    <label>Name*</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter timetable name"
                      value={newTimetable.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Check-In Start Time*</label>
                      <input
                        type="time"
                        name="checkInStart"
                        value={newTimetable.checkInStart}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Check-In End Time*</label>
                      <input
                        type="time"
                        name="checkInEnd"
                        value={newTimetable.checkInEnd}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Grace Period Start*</label>
                      <input
                        type="time"
                        name="graceStart"
                        value={newTimetable.graceStart}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Grace Period End*</label>
                      <input
                        type="time"
                        name="graceEnd"
                        value={newTimetable.graceEnd}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Check-Out Start Time*</label>
                      <input
                        type="time"
                        name="checkOutStart"
                        value={newTimetable.checkOutStart}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Check-Out End Time*</label>
                      <input
                        type="time"
                        name="checkOutEnd"
                        value={newTimetable.checkOutEnd}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Type*</label>
                      <select
                        name="type"
                        value={newTimetable.type}
                        onChange={handleInputChange}
                      >
                        <option>Roster</option>
                        <option>Fixed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Assign Employees Section */}
                <div className="assign-section">
                  <h3>Assign Employees to Timetable</h3>
                  <div className="employee-table">
                    <input
                      type="text"
                      className="search-employee"
                      placeholder="Search by Employee"
                    />
                    <table>
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

                {/* Modal Footer */}
                <div className="modal-actions">
                  <button
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="confirm-btn" onClick={handleCreateTimetable}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeManagement;
