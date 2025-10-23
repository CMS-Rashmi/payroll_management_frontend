import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/EmployeeInfo.css';
import { apiGet } from '../services/api';

const EmployeeInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');
  const [filterJoinDate, setFilterJoinDate] = useState(''); // ✅ Single join date filter

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet('/employees');
        setEmployees(data.data || []);
      } catch (e) {
        console.error(e);
        setError('Failed to load employees');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDate = (d) => {
    const date = new Date(d);
    if (Number.isNaN(date)) return d;
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${m}/${day}/${date.getFullYear()}`;
  };

  const departments = [...new Set(employees.map(e => e.department_name).filter(Boolean))];
  const designations = [...new Set(employees.map(e => e.designation).filter(Boolean))];

  // ✅ Filtering logic
  const filtered = employees.filter(emp => {
    const matchesSearch =
      `${emp.full_name} ${emp.employee_code || ''} ${emp.department_name || ''} ${emp.designation || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus ? emp.status === filterStatus : true;
    const matchesDepartment = filterDepartment ? emp.department_name === filterDepartment : true;
    const matchesDesignation = filterDesignation ? emp.designation === filterDesignation : true;

    // ✅ Match specific join date
    let matchesJoin = true;
    if (filterJoinDate) {
      const empDate = new Date(emp.joining_date);
      const selectedDate = new Date(filterJoinDate);
      matchesJoin =
        empDate.getFullYear() === selectedDate.getFullYear() &&
        empDate.getMonth() === selectedDate.getMonth() &&
        empDate.getDate() === selectedDate.getDate();
    }

    return matchesSearch && matchesStatus && matchesDepartment && matchesDesignation && matchesJoin;
  });

  return (
    <div className="employee-info-container">
      <Sidebar />
      <div className="employee-info-content">
        <Header />
        <header className="employee-info-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Employee Information</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Employee Information Management</span>
            </div>
            <h1 className="page-title">Employee Information Management</h1>
          </div>
        </header>

        {/* Tabs Navigation */}
        <div className="tab-navigation">
          {[
            { label: 'Overview', path: '/employee-info' },
            { label: 'Add Employee', path: '/add-employee' },
            { label: 'Attendance & Leave Records', path: '/attendance-leave' },
            { label: 'Performance & Training', path: '/performance-training' },
            { label: 'Documents & Contracts', path: '/documents-contracts' },
            { label: 'Audit Logs', path: '/audit-logs' },
          ].map((t) => (
            <button
              key={t.label}
              className={`tab-btn ${location.pathname === t.path ? 'active' : ''}`}
              onClick={() => navigate(t.path)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Employee Table Section */}
        <div className="employee-table-section">
          <div className="section-header">
            <h2>All Employees</h2>
            <button className="add-employee-btn" onClick={() => navigate('/add-employee')}>
              + Add Employee
            </button>
          </div>

          {/* ✅ Search + Filters */}
          <div className="search-filter-container">
            <input
              className="search-input"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>On-contract</option>
              <option>Seasonal</option>
            </select>
            <select
              className="filter-select"
              value={filterDepartment}
              onChange={e => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
            <select
              className="filter-select"
              value={filterDesignation}
              onChange={e => setFilterDesignation(e.target.value)}
            >
              <option value="">All Designations</option>
              {designations.map(d => <option key={d}>{d}</option>)}
            </select>

            {/* ✅ Single Join Date Filter */}
            <input
              className="filter-date"
              type="date"
              value={filterJoinDate}
              onChange={e => setFilterJoinDate(e.target.value)}
            />

            {/* Optional Clear Button */}
            {filterJoinDate && (
              <button className="clear-filter-btn" onClick={() => setFilterJoinDate('')}>
                Clear
              </button>
            )}
          </div>

          {/* Table Content */}
          {loading ? (
            <div style={{ padding: 16 }}>Loading…</div>
          ) : error ? (
            <div style={{ color: 'crimson', padding: 16 }}>{error}</div>
          ) : (
            <div className="employee-table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Department</th>
                    <th>Phone</th>
                    <th>Joining Date</th>
                    <th>Designation</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(emp => (
                    <tr key={emp.id}>
                      <td>
                        <div className="employee-profile">
                          <div className="employee-avatar-small">
                            {emp.profile_photo_url ? (
                              <img src={emp.profile_photo_url} alt="" />
                            ) : null}
                          </div>
                          <span>{emp.full_name}</span>
                        </div>
                      </td>
                      <td>{emp.employee_code || emp.id}</td>
                      <td>
                        <span
                          className={`status-badge ${String(emp.status)
                            .toLowerCase()
                            .replaceAll(' ', '-')}`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td>{emp.department_name}</td>
                      <td>{emp.phone}</td>
                      <td>{formatDate(emp.joining_date)}</td>
                      <td>{emp.designation}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn view-btn"
                            onClick={() => navigate(`/employees/${emp.id}/view`)}
                          >
                            View
                          </button>
                          <button
                            className="action-btn edit-btn"
                            onClick={() => navigate(`/employees/${emp.id}/edit`)}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: 20 }}>
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
  );
};

export default EmployeeInfo;
