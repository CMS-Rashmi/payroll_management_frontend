import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { apiGet, apiJSON, apiUpload } from '../services/api';

// Reuse the AddEmployee header/tab styles:
import '../styles/AddEmployee.css';
// Keep your edit-page specific styles:
import '../styles/EditEmployee.css';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [employee, setEmployee] = useState(null);

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [document, setDocument]         = useState(null);

  // tabs (same as AddEmployee)
  const tabs = [
    { label: 'Overview', path: '/employee-info' },
    { label: 'Add Employee', path: '/add-employee' },
    { label: 'Attendance & Leave Records', path: '/attendance-leave' },
    { label: 'Performance & Training', path: '/performance-training' },
    { label: 'Documents & Contracts', path: '/documents-contracts' },
    { label: 'Audit Logs', path: '/audit-logs' },
  ];

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet(`/employees/${id}`);
        setEmployee(data.data);
      } catch (e) {
        console.error(e);
        setError('Failed to load employee');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({
      ...prev,
      [name]: name === 'department_id' ? (value ? Number(value) : null) : value
    }));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        employee_code: employee.employee_code ?? null,
        full_name: employee.full_name,
        email: employee.email ?? null,
        phone: employee.phone ?? null,
        department_id: employee.department_id ?? null,
        designation: employee.designation ?? null,
        status: employee.status ?? 'Active',
        joining_date: employee.joining_date ?? null,
        address: employee.address ?? null,
        emergency_contact: employee.emergency_contact ?? null,
      };

      if (profilePhoto || document) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => fd.append(k, v ?? ''));
        if (profilePhoto) fd.append('profilePhoto', profilePhoto); // must match multer
        if (document)     fd.append('documents', document);        // must match multer
        await apiUpload(`/employees/${id}`, fd, 'PUT');
      } else {
        await apiJSON(`/employees/${id}`, 'PUT', payload);
      }

      alert('Saved');
      navigate('/employee-info');
    } catch (e2) {
      console.error(e2);
      setError(e2.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm('Delete this employee?')) return;
    try {
      await apiGet(`/employees/${id}`, { method: 'DELETE' });
      alert('Deleted');
      navigate('/employee-info');
    } catch (e) {
      console.error(e);
      setError('Delete failed');
    }
  };

  if (loading) return <div className="edit-loading">Loading…</div>;
  if (error && !employee) return <div className="edit-error">{error}</div>;
  if (!employee) return null;

  return (
    <div className="add-employee-container">{/* same outer layout */}
      <Sidebar />

      <div className="add-employee-content">{/* reuse spacing */}
        {/* Header (same as AddEmployee) */}
        <header className="add-employee-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item">Employee Information Management</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Edit Employee</span>
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

        {/* Tabs (same as AddEmployee) */}
        <div className="tab-navigation">
          {tabs.map(tab => (
            <button
              key={tab.label}
              className={`tab-btn ${location.pathname === tab.path ? 'active' : ''}`}
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main content uses your Edit styles */}
        <div className="add-employee-main-content">
          <h2 style={{marginTop: 0, marginBottom: 16, fontSize: 18, color: '#333'}}>Edit Employee</h2>

          <form className="edit-form" onSubmit={save}>
            <div className="edit-grid">
              {/* Left column */}
              <div className="edit-col">
                <label className="edit-label">Full name
                  <input
                    className="edit-input"
                    name="full_name"
                    value={employee.full_name || ''}
                    onChange={handleChange}
                  />
                </label>

                <label className="edit-label">Email
                  <input
                    className="edit-input"
                    name="email"
                    value={employee.email || ''}
                    onChange={handleChange}
                  />
                </label>

                <label className="edit-label">Phone
                  <input
                    className="edit-input"
                    name="phone"
                    value={employee.phone || ''}
                    onChange={handleChange}
                  />
                </label>

                <label className="edit-label">Department
                  <select
                    className="edit-select"
                    name="department_id"
                    value={employee.department_id ?? ''}
                    onChange={handleChange}
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
                </label>

                <label className="edit-label">Designation
                  <input
                    className="edit-input"
                    name="designation"
                    value={employee.designation || ''}
                    onChange={handleChange}
                  />
                </label>
              </div>

              {/* Right column */}
              <div className="edit-col">
                <label className="edit-label">Status
                  <select
                    className="edit-select"
                    name="status"
                    value={employee.status ?? 'Active'}
                    onChange={handleChange}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>On-contract</option>
                    <option>Seasonal</option>
                  </select>
                </label>

                <label className="edit-label">Joining date
                  <input
                    className="edit-input"
                    type="date"
                    name="joining_date"
                    value={(employee.joining_date || '').slice(0, 10)}
                    onChange={handleChange}
                  />
                </label>

                <label className="edit-label">Address
                  <textarea
                    className="edit-textarea"
                    name="address"
                    value={employee.address || ''}
                    onChange={handleChange}
                  />
                </label>

                <label className="edit-label">Emergency contact
                  <input
                    className="edit-input"
                    name="emergency_contact"
                    value={employee.emergency_contact || ''}
                    onChange={handleChange}
                  />
                </label>

                <label className="edit-label">New profile photo (optional)
                  <input
                    className="edit-file"
                    type="file"
                    accept="image/*"
                    onChange={e => setProfilePhoto(e.target.files?.[0] || null)}
                  />
                </label>

                <label className="edit-label">New document (optional)
                  <input
                    className="edit-file"
                    type="file"
                    onChange={e => setDocument(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>

            {error && <div className="edit-error">{error}</div>}

            <div className="edit-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button type="button" className="btn-danger" onClick={remove}>
                Delete
              </button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/employee-info')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
