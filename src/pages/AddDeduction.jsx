// src/pages/AddDeduction.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { apiGet, apiJSON } from '../services/api';
import '../styles/AddDeduction.css';

export default function AddDeduction() {
  const navigate = useNavigate();
  const [search] = useSearchParams();           //new
  const editId = search.get("id");             //new

  const [employees, setEmployees] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    employee_id: '',
    name: '',
    type: 'Tax',
    basis: 'Fixed',      // 'Fixed' | 'Percent'
    percent: '',
    amount: '',
    effective_date: '',
    status: 'Active',
  });

  useEffect(() => {
    // Load employees for the dropdown
    (async () => {
      try {
        const res = await apiGet('/employees?status=Active'); // make sure this route exists in your backend
        setEmployees(res.data || []);
      } catch (e) {
        setEmployees([]);
      }
    })();
  }, []);

   // Load existing deduction in edit mode
  useEffect(() => {
    if (!editId) return;
    (async () => {
      try {
        const res = await apiGet(`/salary/deductions/${editId}`);
        const d = res.data;
        if (d) {
          setForm({
            employee_id: d.employee_id ?? "",
            name: d.name ?? "",
            type: d.type ?? "Tax",
            basis: d.basis ?? "Fixed",
            percent: d.percent ?? "",
            amount: d.amount ?? "",
            effective_date: (d.effective_date || "").slice(0, 10),
            status: d.status ?? "Active",
          });
        }
      } catch (e) {
        console.error(e);
        alert("Failed to load deduction");
      }
    })();
  }, [editId]);
  

  {/*const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));*/}
  const onChange = (e) => {
  const { name, value } = e.target;
  if (name === "employee_id") {
    const selected = employees.find(emp => emp.id === Number(value));
    setForm(f => ({
      ...f,
      employee_id: value,
      employee_name: selected ? selected.full_name : ""
    }));
  } else {
    setForm(f => ({ ...f, [name]: value }));
  }
};


  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setSaving(true);
    try {
      // Clean numeric fields
      const payload = {
        ...form,
        percent: form.basis === 'Percent' ? Number(form.percent) : null,
        amount: form.basis === 'Fixed' ? Number(form.amount) : null,
        employee_name: form.employee_name          //new line
      };

      const res = await apiJSON('/salary/deductions', 'POST', payload);
      if (!res.ok) throw new Error(res.message || 'Save failed');

      setMsg('✅ Deduction saved');
      // small delay so user sees it
      setTimeout(() => navigate('/deductions'), 400);
    } catch (err) {
      setMsg(`❌ ${err.message || 'Failed to save'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-deduction-wrapper">
      <Sidebar />
      <div className="overlay">
        <div className="add-deduction-modal">
          <h2>Add Deduction</h2>
          {msg && <div style={{marginBottom:12, color: msg.startsWith('✅') ? '#0a7d10' : '#c62828'}}>{msg}</div>}
          <form onSubmit={onSubmit} className="add-deduction-form">
            <label>Employee</label>
            <select name="employee_id" value={form.employee_id} onChange={onChange} required>
              <option value="">Select employee</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.full_name} (#{e.id})</option>
              ))}
            </select>

            <label>Deduction Name</label>
            <input name="name" value={form.name} onChange={onChange} placeholder="Income Tax / EPF / Insurance..." required />

            <label>Type</label>
            <select name="type" value={form.type} onChange={onChange} required>
              <option>Tax</option>
              <option>Statutory</option>
              <option>Insurance</option>
              <option>Loan</option>
              <option>Other</option>
            </select>

            <label>Basis</label>
            <select name="basis" value={form.basis} onChange={onChange} required>
              <option>Fixed</option>
              <option>Percent</option>
            </select>

            {form.basis === 'Percent' ? (
              <>
                <label>Percent (%)</label>
                <input type="number" step="0.01" name="percent" value={form.percent} onChange={onChange} placeholder="e.g. 10" required />
              </>
            ) : (
              <>
                <label>Amount</label>
                <input type="number" step="0.01" name="amount" value={form.amount} onChange={onChange} placeholder="e.g. 200" required />
              </>
            )}

            <label>Effective Date</label>
            <input type="date" name="effective_date" value={form.effective_date} onChange={onChange} required />

            <label>Status</label>
            <select name="status" value={form.status} onChange={onChange}>
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <div className="button-group">
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" className="cancel-btn" onClick={() => navigate('/deductions')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
