import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/DocumentsContracts.css';

const DocumentsContracts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Documents & Contracts');
  const [employeeFilter, setEmployeeFilter] = useState('All Employees');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('All Document Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const tabs = [
    'Overview', 'Add Employee', 'Attendance & Leave Records', 
    'Performance & Training', 'Documents & Contracts', 'Audit Logs'
  ];

  const documentsData = [
    {
      id: 1,
      name: 'Employment Contract 1.2 MB',
      employee: 'Jeremy Neigh EMP001',
      employeeName: 'Jeremy Neigh',
      type: 'Contract',
      uploadedDate: '2022-01-15 by HR Admin',
      expiryDate: '2025-01-14',
      status: 'Active',
      actions: '💶 💷 💸'
    },
    {
      id: 2,
      name: 'NDA Agreement 0.8 MB',
      employee: 'Jeremy Neigh EMP001',
      employeeName: 'Jeremy Neigh',
      type: 'Legal',
      uploadedDate: '2022-01-15 by HR Admin',
      expiryDate: '2025-01-14',
      status: 'Active',
      actions: '💶 💷 💸'
    },
    {
      id: 3,
      name: 'Employment Contract 3.3 MB',
      employee: 'Jane Smith EMP002',
      employeeName: 'Jane Smith',
      type: 'Contract',
      uploadedDate: '2021-03-03 by HR Admin',
      expiryDate: '2024-03-02',
      status: 'Active',
      actions: '💶 💷 💸'
    },
    {
      id: 4,
      name: 'Performance Improvement Plan 6.5 MB',
      employee: 'Robert Johnson EMP003',
      employeeName: 'Robert Johnson',
      type: 'HR Document',
      uploadedDate: '2023-08-10 by Emily Davis',
      expiryDate: '2023-12-10',
      status: 'Expiring Soon',
      actions: '💶 💷 💸'
    },
    {
      id: 5,
      name: 'Resignation Letter 0.2 MB',
      employee: 'Emily Davis EMP004',
      employeeName: 'Emily Davis',
      type: 'HR Document',
      uploadedDate: '2023-05-20 by Emily Davis',
      expiryDate: 'N/A',
      status: 'Archived',
      actions: '💶 💷 💸'
    }
  ];

  // Get unique values for filters
  const employeeOptions = ['All Employees', ...new Set(documentsData.map(doc => doc.employeeName))];
  const documentTypeOptions = ['All Document Types', ...new Set(documentsData.map(doc => doc.type))];
  const statusOptions = ['All Statuses', ...new Set(documentsData.map(doc => doc.status))];

  // Filter documents based on selected filters
  const filteredDocuments = documentsData.filter(doc => {
    const matchesEmployee = employeeFilter === 'All Employees' || doc.employeeName === employeeFilter;
    const matchesDocumentType = documentTypeFilter === 'All Document Types' || doc.type === documentTypeFilter;
    const matchesStatus = statusFilter === 'All Statuses' || doc.status === statusFilter;

    return matchesEmployee && matchesDocumentType && matchesStatus;
  });

  // ✅ Helper: format to MM/DD/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'N/A') return dateStr;

    // split off "by ..." if it exists
    const [datePart, byPart] = dateStr.split(' by');
    const date = new Date(datePart);

    if (isNaN(date)) return dateStr; // fallback if invalid date

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return byPart ? `${month}/${day}/${year} by${byPart}` : `${month}/${day}/${year}`;
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'Overview') {
      navigate('/employee-information');
    } else if (tab === 'Add Employee') {
      navigate('/add-employee');
    } else if (tab === 'Attendance & Leave Records') {
      navigate('/attendance-leave');
    } else if (tab === 'Performance & Training') {
      navigate('/performance-training');
    } else if (tab === 'Audit Logs') {
      navigate('/audit-logs');
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setEmployeeFilter('All Employees');
    setDocumentTypeFilter('All Document Types');
    setStatusFilter('All Statuses');
  };

  return (
    <div className="documents-contracts-container">
      <Sidebar />
      
      <div className="documents-contracts-content">
        {/* Header */}
        <header className="documents-contracts-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Employee Information Management</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Documents & Contracts</span>
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

        {/* Tab Navigation */}
        <div className="tab-navigation">
          {tabs.map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="documents-contracts-main-content">
          <div className="section-header">
            <h2>Documents & Contracts</h2>
          </div>

          {/* Filter Section */}
          <div className="filter-section">
            <div className="filter-item">
              <span className="filter-bullet">-</span>
              <div className="filter-dropdown">
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
            </div>
            <div className="filter-item">
              <span className="filter-bullet">-</span>
              <div className="filter-dropdown">
                <select 
                  value={documentTypeFilter}
                  onChange={(e) => setDocumentTypeFilter(e.target.value)}
                  className="filter-select"
                >
                  {documentTypeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="filter-item">
              <span className="filter-bullet">-</span>
              <div className="filter-dropdown">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            <button 
              className="reset-filters-btn"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>

          <div className="section-divider"></div>

          {/* Documents Section */}
          <div className="documents-section">
            <h3 className="subsection-header">Documents & Contracts</h3>
            
            {/* Attention Alert */}
            <div clssName="attention-alert">
              <span className="alert-bullet">-</span>
              <div className="alert-content">
                <span className="alert-title">Documents Requiring Attention</span>
                <p>1 document is expiring within the next 30 days. Please review and take necessary action.</p>
              </div>
            </div>

            {/* Documents Table */}
            <div className="table-container">
              <table className="documents-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Uploaded Date</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.employee}</td>
                      <td>{item.type}</td>
                      <td>{formatDate(item.uploadedDate)}</td> {/* ✅ formatted */}
                      <td>{formatDate(item.expiryDate)}</td>   {/* ✅ formatted */}
                      <td>
                        <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.actions}</td>
                    </tr>
                  ))}
                  {filteredDocuments.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>
                        No documents found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* Upload Section */}
          <div className="upload-section">
            <div className="upload-area">
              <p>Drag and drop files here, or click to browse</p>
              <span className="file-formats">Accepted formats: PDF, XLSX, CSV (Max 10MB)</span>
            </div>
            <button className="upload-documents-btn">
              Upload Documents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsContracts;