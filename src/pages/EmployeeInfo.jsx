import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/EmployeeInfo.css';
import { apiGet } from '../services/api';

const EmployeeInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');
  const [filterJoinStart, setFilterJoinStart] = useState('');
  const [filterJoinEnd, setFilterJoinEnd] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet('/employees');
        setEmployees(data.data || []); // backend returns { ok, data }
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

  // computed lists for filters
  const departments = [...new Set(employees.map(e => e.department_name).filter(Boolean))];
  const designations = [...new Set(employees.map(e => e.designation).filter(Boolean))];

  const filtered = employees.filter(emp => {
    const matchesSearch =
      `${emp.full_name} ${emp.employee_code || ''} ${emp.department || ''} ${emp.designation || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus ? emp.status === filterStatus : true;
    const matchesDepartment = filterDepartment ? emp.department === filterDepartment : true;
    const matchesDesignation = filterDesignation ? emp.designation === filterDesignation : true;

    let matchesJoin = true;
    if (filterJoinStart) matchesJoin = new Date(emp.joining_date) >= new Date(filterJoinStart);
    if (filterJoinEnd) matchesJoin = matchesJoin && new Date(emp.joining_date) <= new Date(filterJoinEnd);

    return matchesSearch && matchesStatus && matchesDepartment && matchesDesignation && matchesJoin;
  });

  // ✅ Export Button Function
  const handleExport = () => {
    if (filtered.length === 0) {
      alert('No employees to export.');
      return;
    }

    const csvData = filtered.map(emp => ({
      Name: emp.full_name,
      ID: emp.employee_code || emp.id,
      Status: emp.status,
      Department: emp.department_name,
      Phone: emp.phone,
      JoiningDate: formatDate(emp.joining_date),
      Designation: emp.designation
    }));

    const csvRows = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="employee-info-container">
      <Sidebar />

      <div className="employee-info-content">
        <header className="employee-info-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Employee Information</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Employee Information Management</span>
            </div>
            <h1 className="page-title">Employee Information Management</h1>
          </div>
          <div className="header-right">
            <div className="notification-icon">🔔</div>
            <div className="user-profile">
              <div className="user-avatar"></div>
              <span className="username">John</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </header>

        {/* ✅ Tab Navigation */}
        <div className="tab-navigation">
          {[
            { label: 'Overview', path: '/employee-info' },
            { label: 'Add Employee', path: '/add-employee' },
            { label: 'Attendance & Leave Records', path: '/attendance-leave' },
            { label: 'Performance & Training', path: '/performance-training' },
            { label: 'Documents & Contracts', path: '/documents-contracts' },
            { label: 'Audit Logs', path: '/audit-logs' },
          ].map((tab) => (
            <button
              key={tab.label}
              className={`tab-btn ${location.pathname === tab.path ? 'active' : ''}`}
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ✅ Employee Table Section */}
        <div className="employee-table-section">
          <div className="section-header">
            <h2>All Employees</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="add-employee-btn" onClick={() => navigate('/add-employee')}>
                + Add Employee
              </button>
              <button className="export-btn" onClick={handleExport}>
                ⬇️ Export
              </button>
            </div>
          </div>

          {/* Search/Filters */}
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
            <input
              className="filter-date"
              type="date"
              value={filterJoinStart}
              onChange={e => setFilterJoinStart(e.target.value)}
            />
            <input
              className="filter-date"
              type="date"
              value={filterJoinEnd}
              onChange={e => setFilterJoinEnd(e.target.value)}
            />
          </div>

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
                    <th>Joining date</th>
                    <th>Designations</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(emp => (
                    <tr key={emp.id}>
                      <td>
                        <div className="employee-profile">
                          <div className="employee-avatar-small"></div>
                          <span>{emp.full_name}</span>
                        </div>
                      </td>
                      <td>{emp.employee_code || emp.id}</td>
                      <td>
                        <span className={`status-badge ${String(emp.status).toLowerCase().replaceAll(' ', '-')}`}>
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
                            className="action-btn view"
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
