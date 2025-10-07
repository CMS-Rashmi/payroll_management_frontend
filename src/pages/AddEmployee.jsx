import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/AddEmployee.css';
import { apiUpload } from '../services/api';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Add Employee');

  // Form state
  const [formData, setFormData] = useState({
    full_Name: '',                 // UI name; mapped to full_name at submit
    email: '',
    phone: '',
    department: '',               // UI: holds department_id value (string/number)
    designation: '',
    status: 'Active',
    joining_date: '',
    address: '',
    emergency_contact: '',
  });

  // Files
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [document, setDocument] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const tabs = [
    'Overview', 'Add Employee', 'Attendance & Leave Records',
    'Performance & Training', 'Documents & Contracts', 'Audit Logs'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'Overview') navigate('/employee-info');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const fd = new FormData();
      // Map UI -> backend field names
      fd.append('full_name', formData.full_Name);
      fd.append('email', formData.email);
      fd.append('phone', formData.phone);
      fd.append('department_id', formData.department); // IMPORTANT
      fd.append('designation', formData.designation);
      fd.append('status', formData.status);
      fd.append('joining_date', formData.joining_date);
      fd.append('address', formData.address);
      fd.append('emergency_contact', formData.emergency_contact);

      // Files — exact names expected by multer/route
      if (profilePhoto) fd.append('profilePhoto', profilePhoto);
      if (document) fd.append('documents', document);

      await apiUpload('/employees', fd, 'POST');

      alert('Employee added successfully!');
      navigate('/employee-info');
    } catch (err) {
      console.error(err);
      setError('Failed to save employee');
    } finally {
      setSubmitting(false);
    }
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

        {/* Tabs */}
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

          {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

          <form className="employee-form" onSubmit={onSubmit}>
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
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input"
                      onChange={e => setProfilePhoto(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div className="form-group">
                  <h3 className="form-subheading">Full Name</h3>
                  <input
                    type="text"
                    name="full_Name"
                    placeholder="Enter full name"
                    value={formData.full_Name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="form-group">
                  <h3 className="form-subheading">Phone Number</h3>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
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
                    name="joining_date"
                    value={formData.joining_date}
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
                  />
                </div>

                {/* Emergency Contact */}
                <div className="form-group">
                  <h3 className="form-subheading">Emergency Contact</h3>
                  <input
                    type="tel"
                    name="emergency_contact"
                    placeholder="Enter phone number"
                    value={formData.emergency_contact}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* One Document */}
                <div className="form-group">
                  <h3 className="form-subheading">Documents</h3>
                  <div className="documents-upload">
                    <div className="documents-placeholder">
                      <div className="upload-icon">📄</div>
                      <p>Drag and drop files here, or click to browse</p>
                      <span className="file-formats">Accepted formats: PDF, XLSX, CSV (Max 10MB)</span>
                    </div>
                    <input
                      type="file"
                      className="file-input"
                      onChange={e => setDocument(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="form-column">
                {/* Email */}
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

                {/* Department (value = department_id) */}
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
                    {/* The values (1..N) should match rows in your `departments` table */}
                    <option value="1">HR</option>
                    <option value="2">IT</option>
                    <option value="3">Finance</option>
                    <option value="4">Marketing</option>
                    <option value="5">Operations</option>
                    <option value="6">Support</option>
                    <option value="7">QA</option>
                    <option value="8">Customer Success</option>
                    <option value="9">Product</option>
                    <option value="10">People Ops</option>
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
              <button type="button" className="cancel-btn" onClick={() => navigate('/employee-info')}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
