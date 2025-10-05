import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/EmployeeInfo.css';
import { apiGet } from '../services/api';

const EmployeeInfo = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

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
    const m = String(date.getMonth()+1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2,'0');
    return `${m}/${day}/${date.getFullYear()}`;
  };

  // computed lists for filters
  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];
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
    if (filterJoinEnd)   matchesJoin = matchesJoin && new Date(emp.joining_date) <= new Date(filterJoinEnd);

    return matchesSearch && matchesStatus && matchesDepartment && matchesDesignation && matchesJoin;
  });

  return (
    <div className="employee-info-container">
      <Sidebar />

      <div className="employee-info-content">
        <header className="employee-info-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
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

        <div className="overview-section">
          <div className="overview-items">
            {['Overview','Add Employee','Attendance & Leave Records','Performance & Training','Documents & Contracts','Audit Logs'].map((item) => (
              <div
                key={item}
                className={`overview-item ${item === 'Overview' ? 'active' : ''}`}
                onClick={() => {
                  if (item === 'Add Employee') navigate('/add-employee');
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="employee-table-section">
          <div className="section-header">
            <h2>All Employees</h2>
            <button className="add-employee-btn" onClick={() => navigate('/add-employee')}>+ Add Employee</button>
          </div>

          {/* Search/filters */}
          <div className="search-filter-container">
            <input className="search-input" placeholder="Search employees..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
            <select className="filter-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>On-contract</option>
              <option>Seasonal</option>
            </select>
            <select className="filter-select" value={filterDepartment} onChange={e=>setFilterDepartment(e.target.value)}>
              <option value="">All Departments</option>
              {departments.map(d=> <option key={d}>{d}</option>)}
            </select>
            <select className="filter-select" value={filterDesignation} onChange={e=>setFilterDesignation(e.target.value)}>
              <option value="">All Designations</option>
              {designations.map(d=> <option key={d}>{d}</option>)}
            </select>
            <input className="filter-date" type="date" value={filterJoinStart} onChange={e=>setFilterJoinStart(e.target.value)} />
            <input className="filter-date" type="date" value={filterJoinEnd} onChange={e=>setFilterJoinEnd(e.target.value)} />
          </div>

          {loading ? (
            <div style={{padding:16}}>Loading…</div>
          ) : error ? (
            <div style={{color:'crimson', padding:16}}>{error}</div>
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
                      <td><span className={`status-badge ${String(emp.status).toLowerCase().replaceAll(' ', '-')}`}>{emp.status}</span></td>
                      <td>{emp.department}</td>
                      <td>{emp.phone}</td>
                      <td>{formatDate(emp.joining_date)}</td>
                      <td>{emp.designation}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view" onClick={()=>navigate(`/employees/${emp.id}/edit`)}>Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan="8" style={{textAlign:'center', padding:20}}>No employees found.</td></tr>
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





/*import React, { useEffect, useState } from 'react';
import { UNSAFE_createClientRoutesWithHMRRevalidationOptOut, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/EmployeeInfo.css';
import { apiGet } from '../services/api';                    //new chnages by dev_shanika


const EmployeeInfo = () => {
  const navigate = useNavigate();
 // const [currentPage, setCurrentPage] = useState(1);
  //const [activeOverview, setActiveOverview] = useState('Overview');

  //new chnages
  const[employees,setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error , setError] = useState('');                                 //dev_shanika


  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');
  const [filterJoinStart, setFilterJoinStart] = useState('');
  const [filterJoinEnd, setFilterJoinEnd] = useState('');

  const employeesPerPage = 6;
  const totalPages = 100;

  // Helper function to format date in MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };


  // new changes ----------------------- dev_shanika
  useEffect(() => {
  try {
  const data = await apiGet('/employees');
  setEmployees(data.data || []); } //backend returns {ok, data}
  } catch (e) {
  setError('Failed to load employees');
  } finally {
    setLoading(false);
    }
  })();
}, []);


  // Employee data
  const employees = [
    { id: 1, name: 'Jeremy Neigh', employeeId: 'AOBICO28', status: 'Part-time', department: 'Support', phone: '0752897453', joiningDate: '2016-09-23', designation: 'Tax Officer' },
    { id: 2, name: 'Ametite Black', employeeId: 'AOBICO86', status: 'On-contract', department: 'QA', phone: '0914785633', joiningDate: '2013-07-27', designation: 'Branch Manager' },
    { id: 3, name: 'Theresa Webb', employeeId: 'AOBICO25', status: 'Seasonal', department: 'People Ops', phone: '0765849269', joiningDate: '2016-11-07', designation: 'Regional Manager' },
    { id: 4, name: 'Kathryn Murphy', employeeId: 'AOBICO44', status: 'Part-time', department: 'IT', phone: '0715945625', joiningDate: '2014-08-19', designation: 'Trust Administrator' },
    { id: 5, name: 'Courtney Henry', employeeId: 'AOBICO99', status: 'Full-time', department: 'Customer Success', phone: '0724895287', joiningDate: '2019-07-11', designation: 'Vice President' },
    { id: 6, name: 'Jane Cooper', employeeId: 'AOBICO95', status: 'Full-time', department: 'Product', phone: '0784952695', joiningDate: '2019-08-02', designation: 'Trust Office' }
  ];

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus ? emp.status === filterStatus : true;
    const matchesDepartment = filterDepartment ? emp.department === filterDepartment : true;
    const matchesDesignation = filterDesignation ? emp.designation === filterDesignation : true;

    let matchesJoinDate = true;
    if(filterJoinStart) matchesJoinDate = new Date(emp.joiningDate) >= new Date(filterJoinStart);
    if(filterJoinEnd) matchesJoinDate = matchesJoinDate && new Date(emp.joiningDate) <= new Date(filterJoinEnd);

    return matchesSearch && matchesStatus && matchesDepartment && matchesDesignation && matchesJoinDate;
  });

  // Pagination handlers
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };

  // Overview navigation
  const handleOverviewClick = (item) => {
    setActiveOverview(item);
    switch(item) {
      case 'Overview': navigate('/employee-info'); break;
      case 'Add Employee': navigate('/add-employee'); break;
      case 'Attendance & Leave Records': navigate('/attendance-leave'); break;
      case 'Performance & Training': navigate('/performance-training'); break;
      case 'Documents & Contracts': navigate('/documents-contracts'); break;
      case 'Audit Logs': navigate('/audit-logs'); break;
      default: break;
    }
  };

  // Get unique departments & designations
  const departments = [...new Set(employees.map(emp => emp.department))];
  const designations = [...new Set(employees.map(emp => emp.designation))];

  return (
    <div className="employee-info-container">
      <Sidebar />

      <div className="employee-info-content">
        {/* Header */} 
        /*
        <header className="employee-info-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
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

        {/* Overview Section */}

        /*
        <div className="overview-section">
          <div className="overview-items">
            {['Overview','Add Employee','Attendance & Leave Records','Performance & Training','Documents & Contracts','Audit Logs'].map((item) => (
              <div 
                key={item}
                className={`overview-item ${activeOverview === item ? 'active' : ''}`}
                onClick={() => handleOverviewClick(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Employee Table Section */}

        /*
        <div className="employee-table-section">
          <div className="section-header">
            <h2>All Employees</h2>
            <button className="add-employee-btn" onClick={() => navigate('/add-employee')}>+ Add Employee</button>
          </div>

          {/* Search and Filter */}

          /*
          <div className="search-filter-container">
            <input type="text" placeholder="Search employees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
            
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
              <option value="">All Status</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="On-contract">On-contract</option>
              <option value="Seasonal">Seasonal</option>
            </select>

            <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="filter-select">
              <option value="">All Departments</option>
              {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>

            <select value={filterDesignation} onChange={(e) => setFilterDesignation(e.target.value)} className="filter-select">
              <option value="">All Designations</option>
              {designations.map(des => <option key={des} value={des}>{des}</option>)}
            </select>

            <input type="date" value={filterJoinStart} onChange={(e) => setFilterJoinStart(e.target.value)} className="filter-date" />
            <input type="date" value={filterJoinEnd} onChange={(e) => setFilterJoinEnd(e.target.value)} className="filter-date" />
          </div>

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
                {filteredEmployees.map(employee => (
                  <tr key={employee.id}>
                    <td>
                      <div className="employee-profile">
                        <div className="employee-avatar-small"></div>
                        <span>{employee.name}</span>
                      </div>
                    </td>
                    <td>{employee.employeeId}</td>
                    <td><span className={`status-badge ${employee.status.toLowerCase().replace(' ', '-')}`}>{employee.status}</span></td>
                    <td>{employee.department}</td>
                    <td>{employee.phone}</td>
                    <td>{formatDate(employee.joiningDate)}</td>
                    <td>{employee.designation}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view">View</button>
                        <button className="action-btn edit">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}

          /*

          <div className="pagination">
            <button className="pagination-btn" disabled={currentPage === 1} onClick={handlePrevPage}>[Prev]</button>
            <button className="pagination-btn" disabled={currentPage === totalPages} onClick={handleNextPage}>[Next]</button>
            <span className="pagination-info">Page: <input type="text" value={currentPage} readOnly /> of {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfo;





