import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/AddEmployee.css';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Add Employee');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    designation: '',
    joiningDate: '',
    address: '',
    emergencyContact: '',
    email: '',
    department: '',
    status: 'Active'
  });

  const tabs = [
    'Overview', 'Add Employee', 'Attendance & Leave Records', 
    'Performance & Training', 'Documents & Contracts', 'Audit Logs'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You would typically send this data to your backend
    alert('Employee added successfully!');
    navigate('/employee-information');
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'Overview') {
      navigate('/employee-info');
    }
    // Add navigation for other tabs if needed
  };

  return (
    <div className="add-employee-container">
      <Sidebar />
      
      <div className="add-employee-content">
        {/* Header */}
        <header className="add-employee-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item">Employee Information Management</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Add Employee</span>
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
        <div className="add-employee-main-content">
          <div className="regulatory-updates">
            <h2>Regulatory Updates</h2>
            <p>Stay compliant with the latest employment regulations.</p>
          </div>

          <form className="employee-form" onSubmit={handleSubmit}>
            <div className="form-columns">
              {/* Left Column */}
              <div className="form-column">
                {/* Profile Photo */}
                <div className="form-group">
                  <h3 className="form-subheading">Profile Photo</h3>
                  <div className="photo-upload">
                    <div className="upload-placeholder">
                      <div className="upload-icon">📷</div>
                      <p>Upload Photo</p>
                    </div>
                    <input type="file" accept="image/*" className="file-input" />
                  </div>
                </div>

                {/* Full Name */}
                <div className="form-group">
                  <h3 className="form-subheading">Full Name</h3>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="form-group">
                  <h3 className="form-subheading">Phone Number</h3>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Designation */}
                <div className="form-group">
                  <h3 className="form-subheading">Designation</h3>
                  <input
                    type="text"
                    name="designation"
                    placeholder="Enter designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Joining Date */}
                <div className="form-group">
                  <h3 className="form-subheading">Joining Date</h3>
                  <input
                    type="date"
                    name="joiningDate"
                    placeholder="mm/dd/yyyy"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Address */}
                <div className="form-group">
                  <h3 className="form-subheading">Address</h3>
                  <textarea
                    name="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="3"
                    required
                  ></textarea>
                </div>

                {/* Emergency Contact */}
                <div className="form-group">
                  <h3 className="form-subheading">Emergency Contact</h3>
                  <input
                    type="tel"
                    name="emergencyContact"
                    placeholder="Enter phone number"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Documents */}
                <div className="form-group">
                  <h3 className="form-subheading">Documents</h3>
                  <div className="documents-upload">
                    <div className="documents-placeholder">
                      <div className="upload-icon">📄</div>
                      <p>Drag and drop files here, or click to browse</p>
                      <span className="file-formats">Accepted formats: PDF, XLSX, CSV (Max 10MB)</span>
                    </div>
                    <input type="file" multiple className="file-input" />
                  </div>
                  <button type="button" className="upload-document-btn">
                    Upload Document
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="form-column">
                {/* Email Address */}
                <div className="form-group">
                  <h3 className="form-subheading emphasized">Email Address</h3>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Department */}
                <div className="form-group">
                  <h3 className="form-subheading">Department</h3>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Support">Support</option>
                    <option value="QA">QA</option>
                    <option value="Customer Success">Customer Success</option>
                    <option value="Product">Product</option>
                    <option value="People Ops">People Ops</option>
                  </select>
                </div>

                {/* Status */}
                <div className="form-group">
                  <h3 className="form-subheading">Status</h3>
                  <div className="status-options">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="status"
                        value="Active"
                        checked={formData.status === 'Active'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-checkmark"></span>
                      Active
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="status"
                        value="Inactive"
                        checked={formData.status === 'Inactive'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-checkmark"></span>
                      Inactive
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate('/employee-information')}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Save Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;