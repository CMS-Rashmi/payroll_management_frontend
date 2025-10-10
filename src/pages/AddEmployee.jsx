import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/AddEmployee.css';
import { apiUpload } from '../services/api';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Add Employee');

  const [formData, setFormData] = useState({
    full_Name: '',
    email: '',
    phone: '',
    department: '',           // UI value, will map to department_id
    designation: '',
    status: 'Active',
    joining_date: '',
    address: '',
    emergency_contact: '',
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [document, setDocument] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const tabs = [
    'Overview','Add Employee','Attendance & Leave Records',
    'Performance & Training','Documents & Contracts','Audit Logs'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'Overview') navigate('/employee-info');
  };

  const validateFiles = () => {
    if (profilePhoto && !['image/jpeg','image/jpg','image/png'].includes(profilePhoto.type)) {
      setError('Profile photo must be JPG/JPEG/PNG.');
      return false;
    }
    if (document && !['application/pdf','image/jpeg','image/jpg'].includes(document.type)) {
      setError('Document must be PDF/JPG/JPEG.');
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateFiles()) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      // map UI -> backend keys
      fd.append('full_name', formData.full_Name);
      fd.append('email', formData.email);
      fd.append('phone', formData.phone);
      fd.append('department_id', formData.department ? Number(formData.department) : '');
      fd.append('designation', formData.designation);
      fd.append('status', formData.status);
      fd.append('joining_date', formData.joining_date);
      fd.append('address', formData.address);
      fd.append('emergency_contact', formData.emergency_contact);

      if (profilePhoto) fd.append('profilePhoto', profilePhoto); // <- exact multer name
      if (document)     fd.append('documents', document);        // <- exact multer name

      await apiUpload('/employees', fd, 'POST');
      alert('Employee added successfully!');
      navigate('/employee-info');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save employee');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-employee-container">
      <Sidebar />
      <div className="add-employee-content">
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

        <div className="tab-navigation">
          {tabs.map(tab => (
            <button key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="add-employee-main-content">
          <div className="regulatory-updates">
            <h2>Regulatory Updates</h2>
            <p>Stay compliant with the latest employment regulations.</p>
          </div>

          {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

          <form className="employee-form" onSubmit={onSubmit}>
            <div className="form-columns">
              <div className="form-column">
                <div className="form-group">
                  <h3 className="form-subheading">Profile Photo</h3>
                  <div className="photo-upload">
                    <div className="upload-placeholder">
                      <div className="upload-icon">📷</div>
                      <p>Upload Photo (JPG/JPEG/PNG)</p>
                    </div>
                    <input type="file" accept=".jpg,.jpeg,.png"
                      className="file-input"
                      onChange={e => setProfilePhoto(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <h3 className="form-subheading">Full Name</h3>
                  <input
                    type="text" name="full_Name" className="form-input" required
                    value={formData.full_Name} onChange={handleInputChange}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="form-group">
                  <h3 className="form-subheading">Phone Number</h3>
                  <input type="tel" name="phone" className="form-input" required
                    value={formData.phone} onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <h3 className="form-subheading">Designation</h3>
                  <input type="text" name="designation" className="form-input" required
                    value={formData.designation} onChange={handleInputChange}
                    placeholder="Enter designation"
                  />
                </div>

                <div className="form-group">
                  <h3 className="form-subheading">Joining Date</h3>
                  <input type="date" name="joining_date" className="form-input" required
                    value={formData.joining_date} onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <h3 className="form-subheading">Address</h3>
                  <textarea name="address" className="form-textarea" rows="3" required
                    value={formData.address} onChange={handleInputChange}
                    placeholder="Enter address"
                  />
                </div>

                <div className="form-group">
                  <h3 className="form-subheading">Emergency Contact</h3>
                  <input type="tel" name="emergency_contact" className="form-input" required
                    value={formData.emergency_contact} onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <h3 className="form-subheading">Documents</h3>
                  <div className="documents-upload">
                    <div className="documents-placeholder">
                      <div className="upload-icon">📄</div>
                      <p>Upload Documents (PDF/JPG/JPEG)</p>
                    </div>
                    <input type="file" accept=".pdf,.jpg,.jpeg"
                      className="file-input"
                      onChange={e => setDocument(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-column">
                <div className="form-group">
                  <h3 className="form-subheading emphasized">Email Address</h3>
                  <input type="email" name="email" className="form-input" required
                    value={formData.email} onChange={handleInputChange}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="form-group">
                  <h3 className="form-subheading">Department</h3>
                  <select name="department" className="form-select" required
                    value={formData.department} onChange={handleInputChange}
                  >
                    <option value="">Select Department</option>
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

                {/*<div className="form-group">
                  <h3 className="form-subheading">Status</h3>
                  <div className="status-options">
                    <label className="radio-option">
                      <input type="radio" name="status" value="Active"
                        checked={formData.status === 'Active'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-checkmark"></span> Active
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="status" value="Inactive"
                        checked={formData.status === 'Inactive'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-checkmark"></span> Inactive
                    </label>
                  </div>
                </div>*/}
                
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
