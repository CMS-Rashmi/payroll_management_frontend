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
    {
      id: 1,
      name: 'Jeremy Neil',
      employeeId: 'AOB1C028',
      department: 'Support',
      basicSalary: '$1,000',
      overtime: '$1,000',
      bonus: '$1,000',
      allowances: '$1,000',
      grossEarnings: '$1,000'
    },
    {
      id: 2,
      name: 'Annette Biz',
      employeeId: 'AOB1C086',
      department: 'QA',
      basicSalary: '$1,000',
      overtime: '$1,000',
      bonus: '$1,000',
      allowances: '$1,000',
      grossEarnings: '$1,000'
    },
    {
      id: 3,
      name: 'Theresa Wu',
      employeeId: 'AOB1C025',
      department: 'People Ops',
      basicSalary: '$1,000',
      overtime: '$1,000',
      bonus: '$1,000',
      allowances: '$1,000',
      grossEarnings: '$1,000'
    },
    {
      id: 4,
      name: 'Kathryn M.',
      employeeId: 'AOB1C044',
      department: 'IT',
      basicSalary: '$1,000',
      overtime: '$1,000',
      bonus: '$1,000',
      allowances: '$1,000',
      grossEarnings: '$1,000'
    },
    {
      id: 5,
      name: 'Courtney H.',
      employeeId: 'AOB1C099',
      department: 'Customer Success',
      basicSalary: '$1,000',
      overtime: '$1,000',
      bonus: '$1,000',
      allowances: '$1,000',
      grossEarnings: '$1,000'
    },
    {
      id: 6,
      name: 'Jane Coop',
      employeeId: 'AOB1C095',
      department: 'Product',
      basicSalary: '$1,000',
      overtime: '$1,000',
      bonus: '$1,000',
      allowances: '$1,000',
      grossEarnings: '$1,000'
    }
  ];

  // Get unique values for filters
  const employeeOptions = ['All Employees', ...new Set(employees.map(emp => emp.name))];
  const departmentOptions = ['All Departments', ...new Set(employees.map(emp => emp.department))];
  const designationOptions = ['All Designations', 'Branch Manager', 'Regional Manager', 'Trust Administrator', 'Vice President', 'Trust Office'];
  const monthOptions = ['August 2025', 'July 2025', 'June 2025', 'May 2025', 'April 2025', 'March 2025'];

  // Check if any filter is active (not default)
  const isFilterActive = 
    employeeFilter !== 'All Employees' ||
    departmentFilter !== 'All Departments' ||
    designationFilter !== 'All Designations' ||
    monthFilter !== 'August 2025' ||
    searchTerm !== '';

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEmployee = employeeFilter === 'All Employees' || employee.name === employeeFilter;
    const matchesDepartment = departmentFilter === 'All Departments' || employee.department === departmentFilter;
    
    return matchesSearch && matchesEmployee && matchesDepartment;
  });

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setEmployeeFilter('All Employees');
    setDepartmentFilter('All Departments');
    setDesignationFilter('All Designations');
    setMonthFilter('August 2025');
    setSearchTerm('');
  };

  // Handle tab navigation
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    // Navigate to different routes based on the tab
    switch(tab) {
      case 'earnings':
        navigate('/earnings');
        break;
      case 'deductions':
        navigate('/deductions');
        break;
      case 'allowances':
        navigate('/allowances');
        break;
      case 'overtime':
        navigate('/overtime-adjustments');
        break;
      case 'compensation':
        navigate('/compensation-adjustment');
        break;
      case 'summary':
        navigate('/net-salary-summary');
        break;
      default:
        navigate('/earnings');
    }
  };

  return (
    <div className="earnings-container">
      <Sidebar />
      
      <div className="earnings-content">
        {/* Header */}
        <header className="earnings-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <span className="breadcrumb-separator">›</span>
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

        {/* Earnings Tabs */}
        <div className="earnings-tabs">
          <div 
            className={`earnings-tab ${activeTab === 'earnings' ? 'active' : ''}`}
            onClick={() => handleTabClick('earnings')}
          >
            Earnings
          </div>
          <div 
            className={`earnings-tab ${activeTab === 'deductions' ? 'active' : ''}`}
            onClick={() => handleTabClick('deductions')}
          >
            Deductions
          </div>
          <div 
            className={`earnings-tab ${activeTab === 'allowances' ? 'active' : ''}`}
            onClick={() => handleTabClick('allowances')}
          >
            Allowances
          </div>
          <div 
            className={`earnings-tab ${activeTab === 'overtime' ? 'active' : ''}`}
            onClick={() => handleTabClick('overtime')}
          >
            Overtime & Adjustments
          </div>
          <div 
            className={`earnings-tab ${activeTab === 'compensation' ? 'active' : ''}`}
            onClick={() => handleTabClick('compensation')}
          >
            Compensation adjustment
          </div>
          <div 
            className={`earnings-tab ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => handleTabClick('summary')}
          >
            Net salary summary
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>All Employees</label>
              <select 
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
                className="filter-select"
              >
                {employeeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Department</label>
              <select 
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="filter-select"
              >
                {departmentOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Designations</label>
              <select 
                value={designationFilter}
                onChange={(e) => setDesignationFilter(e.target.value)}
                className="filter-select"
              >
                {designationOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Month</label>
              <select 
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="filter-select"
              >
                {monthOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <button 
              className="reset-filters-btn"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Employees Table Section */}
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
                {filteredEmployees.map(employee => (
                  <tr key={employee.id}>
                    <td>
                      <div className="employee-profile">
                        <div className="employee-avatar-small"></div>
                        <span>{employee.name}</span>
                      </div>
                    </td>
                    <td>{employee.employeeId}</td>
                    <td>{employee.department}</td>
                    <td>{employee.basicSalary}</td>
                    <td>{employee.overtime}</td>
                    <td>{employee.bonus}</td>
                    <td>{employee.allowances}</td>
                    <td>{employee.grossEarnings}</td>
                    <td>
                      <span className="actions-icon">✅️</span>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="9" style={{textAlign: 'center', padding: '20px'}}>
                      No employees found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button 
              className="pagination-btn" 
              disabled={currentPage === 1}
              onClick={handlePrevPage}
            >
              Prev
            </button>
            <button 
              className="pagination-btn" 
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              Next
            </button>
            <span className="pagination-info">
              Page <input type="text" value={currentPage} readOnly /> of {totalPages}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;