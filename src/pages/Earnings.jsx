import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/Earnings.css';

const Earnings = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [employeeFilter, setEmployeeFilter] = useState('All Employees');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [designationFilter, setDesignationFilter] = useState('All Designations');
  const [monthFilter, setMonthFilter] = useState('August 2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('earnings');
  const totalPages = 100;

  const employees = [
    { id: 1, name: 'Jeremy Neil', employeeId: 'AOB1C028', department: 'Support', basicSalary: '$1,000', overtime: '$1,000', bonus: '$1,000', allowances: '$1,000', grossEarnings: '$1,000' },
    { id: 2, name: 'Annette Biz', employeeId: 'AOB1C086', department: 'QA', basicSalary: '$1,000', overtime: '$1,000', bonus: '$1,000', allowances: '$1,000', grossEarnings: '$1,000' },
    { id: 3, name: 'Theresa Wu', employeeId: 'AOB1C025', department: 'People Ops', basicSalary: '$1,000', overtime: '$1,000', bonus: '$1,000', allowances: '$1,000', grossEarnings: '$1,000' },
    { id: 4, name: 'Kathryn M.', employeeId: 'AOB1C044', department: 'IT', basicSalary: '$1,000', overtime: '$1,000', bonus: '$1,000', allowances: '$1,000', grossEarnings: '$1,000' },
    { id: 5, name: 'Courtney H.', employeeId: 'AOB1C099', department: 'Customer Success', basicSalary: '$1,000', overtime: '$1,000', bonus: '$1,000', allowances: '$1,000', grossEarnings: '$1,000' },
    { id: 6, name: 'Jane Coop', employeeId: 'AOB1C095', department: 'Product', basicSalary: '$1,000', overtime: '$1,000', bonus: '$1,000', allowances: '$1,000', grossEarnings: '$1,000' },
  ];

  // Filter dropdown options
  const employeeOptions = ['All Employees', ...new Set(employees.map(emp => emp.name))];
  const departmentOptions = ['All Departments', ...new Set(employees.map(emp => emp.department))];
  const designationOptions = ['All Designations', 'Branch Manager', 'Regional Manager', 'Trust Administrator', 'Vice President', 'Trust Office'];
  const monthOptions = ['August 2025', 'July 2025', 'June 2025', 'May 2025', 'April 2025', 'March 2025'];

  // Filter logic
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      searchTerm === '' ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmployee = employeeFilter === 'All Employees' || employee.name === employeeFilter;
    const matchesDepartment = departmentFilter === 'All Departments' || employee.department === departmentFilter;
    return matchesSearch && matchesEmployee && matchesDepartment;
  });

  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleResetFilters = () => {
    setEmployeeFilter('All Employees');
    setDepartmentFilter('All Departments');
    setDesignationFilter('All Designations');
    setMonthFilter('August 2025');
    setSearchTerm('');
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

  // ✅ Export to CSV (Excel-compatible)
  const handleExport = () => {
    if (filteredEmployees.length === 0) {
      alert('No employee data to export.');
      return;
    }

    const csvData = filteredEmployees.map(emp => ({
      Employee: emp.name,
      ID: emp.employeeId,
      Department: emp.department,
      'Basic Salary': emp.basicSalary,
      Overtime: emp.overtime,
      Bonus: emp.bonus,
      Allowances: emp.allowances,
      'Gross Earnings': emp.grossEarnings
    }));

    const csvHeader = Object.keys(csvData[0]).join(',');
    const csvRows = csvData.map(row => Object.values(row).join(','));
    const csvContent = [csvHeader, ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Earnings_Report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="earnings-container">
      <Sidebar />

      <div className="earnings-content">
        {/* Header */}
        <header className="earnings-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Salary & Compensation</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Earnings</span>
            </div>
            <h1 className="page-title">Salary & Compensation</h1>
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
              <select value={employeeFilter} onChange={e => setEmployeeFilter(e.target.value)} className="filter-select">
                {employeeOptions.map(option => <option key={option}>{option}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Department</label>
              <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)} className="filter-select">
                {departmentOptions.map(option => <option key={option}>{option}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Designations</label>
              <select value={designationFilter} onChange={e => setDesignationFilter(e.target.value)} className="filter-select">
                {designationOptions.map(option => <option key={option}>{option}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Month</label>
              <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} className="filter-select">
                {monthOptions.map(option => <option key={option}>{option}</option>)}
              </select>
            </div>
            <button className="reset-filters-btn" onClick={handleResetFilters}>Reset Filters</button>
          </div>
        </div>

        {/* Table */}
        <div className="employees-table-section">
          <div className="section-header">
            <h2>All Employees</h2>
          </div>

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
                {filteredEmployees.map(emp => (
                  <tr key={emp.id}>
                    <td>
                      <div className="employee-profile">
                        <div className="employee-avatar-small"></div>
                        <span>{emp.name}</span>
                      </div>
                    </td>
                    <td>{emp.employeeId}</td>
                    <td>{emp.department}</td>
                    <td>{emp.basicSalary}</td>
                    <td>{emp.overtime}</td>
                    <td>{emp.bonus}</td>
                    <td>{emp.allowances}</td>
                    <td>{emp.grossEarnings}</td>
                    <td><span className="actions-icon">✅️</span></td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: 20 }}>No employees found.</td>
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

          {/* ✅ Footer Buttons */}
          <div className="earnings-footer-actions">
            <button className="export-report-btn" onClick={handleExport}>⬇️ Export Report</button>
            <button className="save-changes-btn">💾 Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
