import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { apiGet, apiJSON, apiUpload } from '../services/api';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [employee, setEmployee] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [document, setDocument] = useState(null);

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

  const handleChange = e => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }));
  };

  const save = async e => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      // If files changed, use multipart; else simple JSON update
      if (profilePhoto || document) {
        const fd = new FormData();
        Object.entries(employee).forEach(([k,v]) => fd.append(k, v ?? ''));
        if (profilePhoto) fd.append('profilephoto', profilePhoto);
        if (document) fd.append('document', document);
        await apiUpload(`/employees/${id}`, fd, 'PUT');
      } else {
        await apiJSON(`/employees/${id}`, 'PUT', employee);
      }
      alert('Saved');
      navigate('/employee-info');
    } catch (e2) {
      console.error(e2);
      setError('Save failed');
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
      console.error(e); setError('Delete failed');
    }
  };

  if (loading) return <div style={{padding:20}}>Loading…</div>;
  if (error)   return <div style={{padding:20, color:'crimson'}}>{error}</div>;
  if (!employee) return null;

  return (
    <div style={{display:'flex'}}>
      <Sidebar />
      <div style={{flex:1, padding:24}}>
        <h2>Edit Employee</h2>

        <form onSubmit={save} style={{display:'grid', gap:12, maxWidth:600}}>
          <label>Full name
            <input name="full_name" value={employee.full_name || ''} onChange={handleChange} />
          </label>
          <label>Email
            <input name="email" value={employee.email || ''} onChange={handleChange} />
          </label>
          <label>Phone
            <input name="phone" value={employee.phone || ''} onChange={handleChange} />
          </label>
          <label>Department
            <input name="department" value={employee.department || ''} onChange={handleChange} />
          </label>
          <label>Designation
            <input name="designation" value={employee.designation || ''} onChange={handleChange} />
          </label>
          <label>Status
            <select name="status" value={employee.status || 'Active'} onChange={handleChange}>
              <option>Active</option>
              <option>Inactive</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>On-contract</option>
              <option>Seasonal</option>
            </select>
          </label>
          <label>Joining date
            <input type="date" name="joining_date"
                   value={(employee.joining_date || '').slice(0,10)}
                   onChange={handleChange}/>
          </label>
          <label>Address
            <textarea name="address" value={employee.address || ''} onChange={handleChange} />
          </label>
          <label>Emergency contact
            <input name="emergency_contact" value={employee.emergency_contact || ''} onChange={handleChange} />
          </label>

          <label>New profile photo (optional)
            <input type="file" accept="image/*" onChange={e=>setProfilePhoto(e.target.files?.[0] || null)} />
          </label>
          <label>New document (optional)
            <input type="file" onChange={e=>setDocument(e.target.files?.[0] || null)} />
          </label>

          {error && <div style={{color:'crimson'}}>{error}</div>}
          <div style={{display:'flex', gap:8}}>
            <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
            <button type="button" onClick={remove} style={{background:'#e33', color:'#fff'}}>Delete</button>
            <button type="button" onClick={()=>navigate('/employee-info')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
