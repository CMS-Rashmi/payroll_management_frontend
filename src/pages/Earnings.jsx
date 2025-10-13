// src/pages/Earnings.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/Earnings.css';
import { apiGet } from '../services/api';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

function parseMonthYear(label) {
  // expects labels like "August 2025"
  if (!label) {
    const d = new Date();
    return { m: d.getMonth() + 1, y: d.getFullYear() };
  }
  const [mName, yStr] = label.split(' ');
  const m = MONTHS.findIndex(n => n === mName) + 1 || (new Date().getMonth() + 1);
  const y = Number(yStr) || new Date().getFullYear();
  return { m, y };
}

const Earnings = () => {
  const navigate = useNavigate();

  // tabs
  const [activeTab, setActiveTab] = useState('earnings');

  // data
  const [rows, setRows] = useState([]);           // API rows
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // filters
  const [employeeFilter, setEmployeeFilter] = useState('All Employees');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [designationFilter, setDesignationFilter] = useState('All Designations'); // kept for UI consistency
  const [monthFilter, setMonthFilter] = useState(() => {
    const d = new Date();
    return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  });
  const [searchTerm, setSearchTerm] = useState('');

  // pagination
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // month dropdown (this year ±1)
  const monthOptions = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const list = [];
    [y - 1, y, y + 1].forEach(yr => {
      MONTHS.forEach(mn => list.push(`${mn} ${yr}`));
    });
    return list.reverse(); // latest first
  }, []);

  // fetch from backend whenever month changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const { m, y } = parseMonthYear(monthFilter);
        const resp = await apiGet(`/salary/earnings?month=${m}&year=${y}`);
        // backend returns: [{employee_id, name, department, basic_salary, overtime, bonus, allowances, gross}]
        setRows(Array.isArray(resp.data) ? resp.data : (resp.data?.data || []));
        setCurrentPage(1);
      } catch (e) {
        console.error(e);
        setError(e.message || 'Failed to load earnings');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [monthFilter]);

  // build filter options from data
  const employeeOptions = useMemo(() => {
    const names = Array.from(new Set(rows.map(r => r.name))).sort();
    return ['All Employees', ...names];
  }, [rows]);

  const departmentOptions = useMemo(() => {
    const depts = Array.from(new Set(rows.map(r => r.department || ''))).filter(Boolean).sort();
    return ['All Departments', ...depts];
  }, [rows]);

  // filter logic
  const filtered = useMemo(() => {
    let data = rows;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(r =>
        r.name?.toLowerCase().includes(q) ||
        r.department?.toLowerCase().includes(q) ||
        String(r.employee_id).toLowerCase().includes(q)
      );
    }

    if (employeeFilter !== 'All Employees') {
      data = data.filter(r => r.name === employeeFilter);
    }

    if (departmentFilter !== 'All Departments') {
      data = data.filter(r => (r.department || '') === departmentFilter);
    }

    // designationFilter is present in the UI but not in the dataset yet;
    // it’s kept for future use and currently does not filter anything.

    return data;
  }, [rows, searchTerm, employeeFilter, departmentFilter, designationFilter]);

  // pagination slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  const handleResetFilters = () => {
    setEmployeeFilter('All Employees');
    setDepartmentFilter('All Departments');
    setDesignationFilter('All Designations');
    setSearchTerm('');
    // keep month as-is
    setCurrentPage(1);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'earnings': navigate('/earnings'); break;
      case 'deductions': navigate('/deductions'); break;
      case 'allowances': navigate('/allowances'); break;
      case 'overtime': navigate('/overtime-adjustments'); break;
      case 'compensation': navigate('/compensation-adjustment'); break;
      case 'summary': navigate('/net-salary-summary'); break;
      default: navigate('/earnings');
    }
  };

  // Export to CSV (Excel-friendly)
  const handleExport = () => {
    if (!filtered.length) {
      alert('No data to export.');
      return;
    }
    const csvRows = [];
    const header = [
      'Employee','Employee ID','Department',
      'Basic Salary','Overtime','Bonus','Allowances','Gross Earnings'
    ];
    csvRows.push(header.join(','));

    filtered.forEach(r => {
      const row = [
        r.name,
        r.employee_id,
        r.department || '',
        Number(r.basic_salary || 0),
        Number(r.overtime || 0),
        Number(r.bonus || 0),
        Number(r.allowances || 0),
        Number(r.gross || 0),
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const { m, y } = parseMonthYear(monthFilter);
    a.download = `Earnings_${m}-${y}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="earnings-container">
      <Sidebar />

      <div className="earnings-content">
        {/* Header */}
        <Header/>
        <header className="earnings-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Salary & Compensation</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Earnings</span>
            </div>
            <h1 className="page-title">Salary & Compensation</h1>
          </div>
        </header>

        {/* Tabs */}
        <div className="earnings-tabs">
          {[
            { key: 'earnings', label: 'Earnings' },
            { key: 'deductions', label: 'Deductions' },
            { key: 'allowances', label: 'Allowances' },
            { key: 'overtime', label: 'Overtime & Adjustments' },
            { key: 'compensation', label: 'Compensation adjustment' },
            { key: 'summary', label: 'Net salary summary' }
          ].map(tab => (
            <div
              key={tab.key}
              className={`earnings-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>All Employees</label>
              <select
                value={employeeFilter}
                onChange={e => setEmployeeFilter(e.target.value)}
                className="filter-select"
              >
                {employeeOptions.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label>Department</label>
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="filter-select"
              >
                {departmentOptions.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label>Designations</label>
              <select
                value={designationFilter}
                onChange={e => setDesignationFilter(e.target.value)}
                className="filter-select"
              >
                {['All Designations',
                  'Branch Manager','Regional Manager','Trust Administrator','Vice President','Trust Office'
                ].map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label>Month</label>
              <select
                value={monthFilter}
                onChange={e => setMonthFilter(e.target.value)}
                className="filter-select"
              >
                {monthOptions.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="filter-group" style={{ minWidth: 200 }}>
              <label>Search</label>
              <input
                className="filter-input"
                placeholder="Name / ID / Department"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="reset-filters-btn" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="employees-table-section">
          <div className="section-header">
            <h2>All Employees</h2>
          </div>

          {error && (
            <div style={{ color: 'crimson', padding: '8px 16px' }}>{error}</div>
          )}

          <div className="table-container">
            <table className="employees-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>ID</th>
                  <th>Department</th>
                  <th>Basic salary</th>
                  <th>Overtime</th>
                  <th>Bonus</th>
                  <th>Allowances</th>
                  <th>Gross Earnings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" style={{ padding: 24 }}>Loading…</td></tr>
                ) : paged.length ? (
                  paged.map(emp => (
                    <tr key={emp.employee_id}>
                      <td>
                        <div className="employee-profile">
                          <div className="employee-avatar-small"></div>
                          <span>{emp.name}</span>
                        </div>
                      </td>
                      <td>{emp.employee_id}</td>
                      <td>{emp.department || '-'}</td>
                      <td>{Number(emp.basic_salary || 0).toLocaleString()}</td>
                      <td>{Number(emp.overtime || 0).toLocaleString()}</td>
                      <td>{Number(emp.bonus || 0).toLocaleString()}</td>
                      <td>{Number(emp.allowances || 0).toLocaleString()}</td>
                      <td>{Number(emp.gross || 0).toLocaleString()}</td>
                      <td><span className="actions-icon">✅️</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: 20 }}>
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button className="pagination-btn" disabled={currentPage === 1} onClick={handlePrevPage}>Prev</button>
            <button className="pagination-btn" disabled={currentPage === totalPages} onClick={handleNextPage}>Next</button>
            <span className="pagination-info">
              Page <input type="text" value={currentPage} readOnly /> of {totalPages}
            </span>
          </div>

          {/* Footer actions */}
          <div className="earnings-footer-actions">
            <button className="export-report-btn" onClick={handleExport}>⬇️ Export Report</button>
            <button className="save-changes-btn" disabled>💾 Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
