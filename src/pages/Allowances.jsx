// src/pages/Allowances.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/Allowances.css';
import { apiGet, apiJSON } from '../services/api';

const TABS = [
  { key: 'earnings', label: 'Earnings', path: '/earnings' },
  { key: 'deductions', label: 'Deductions', path: '/deductions' },
  { key: 'allowances', label: 'Allowances', path: '/allowances' },
  { key: 'overtime', label: 'Overtime & Adjustments', path: '/overtime-adjustments' },
  { key: 'compensation', label: 'Compensation adjustment', path: '/compensation-adjustment' },
  { key: 'summary', label: 'Net salary summary', path: '/net-salary-summary' },
];

const frequencyOptions = ['Monthly', 'Yearly'];
const categoryOptions = ['Transportation', 'Meal', 'Housing', 'Medical', 'Communication', 'Other'];
const statusOptions = ['Active', 'Inactive'];

const Allowances = () => {
  const navigate = useNavigate();

  // tabs
  const [activeTab, setActiveTab] = useState('allowances');

  // list/table
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // filters (simple search)
  const [q, setQ] = useState('');

  // modal
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    employee_id: '',
    name: '',
    category: 'Transportation',
    amount: '',
    taxable: 0,
    frequency: 'Monthly',
    effective_from: '',
    effective_to: '',
    status: 'Active',
  });

  // load table
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const resp = await apiGet('/salary/allowances'); // controller listAllowances
        const list = Array.isArray(resp.data) ? resp.data : (resp.data?.data || []);
        setRows(list);
      } catch (e) {
        console.error(e);
        setError(e.message || 'Failed to load allowances');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter(r =>
      String(r.employee_id).toLowerCase().includes(s) ||
      r.name?.toLowerCase().includes(s) ||
      r.category?.toLowerCase().includes(s) ||
      r.frequency?.toLowerCase().includes(s) ||
      r.status?.toLowerCase().includes(s)
    );
  }, [rows, q]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.key);
    navigate(tab.path);
  };

  const openModal = () => {
    setForm({
      employee_id: '',
      name: '',
      category: 'Transportation',
      amount: '',
      taxable: 0,
      frequency: 'Monthly',
      effective_from: '',
      effective_to: '',
      status: 'Active',
    });
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    // quick required guard
    if (!form.employee_id || !form.name || !form.amount) {
      alert('Employee, Name and Amount are required');
      return;
    }
    try {
      setSaving(true);
      // POST exactly with your DB columns
      const payload = {
        employee_id: Number(form.employee_id),
        name: form.name,
        category: form.category || null,
        amount: Number(form.amount),
        taxable: Number(form.taxable) ? 1 : 0,
        frequency: form.frequency,                 // 'Monthly' | 'Yearly'
        effective_from: form.effective_from || null,
        effective_to: form.effective_to || null,
        status: form.status,                       // 'Active' | 'Inactive'
      };
      await apiJSON('/salary/allowance', 'POST', payload);
      setOpen(false);
      // refresh list
      const resp = await apiGet('/salary/allowances');
      const list = Array.isArray(resp.data) ? resp.data : (resp.data?.data || []);
      setRows(list);
    } catch (e) {
      console.error(e);
      alert(e.message || 'Failed to add allowance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="allowances-container">
      <Sidebar />

      <div className="allowances-content">
        {/* Header */}
        <Header/>
        <header className="allowances-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Salary & Compensation</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Allowance</span>
            </div>
            <h1 className="page-title">Salary & Compensation</h1>
          </div>
        </header>

        {/* Tabs */}
        <div className="allowances-tabs">
          {TABS.map(t => (
            <div
              key={t.key}
              className={`tab ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => handleTabClick(t)}
            >
              {t.label}
            </div>
          ))}
        </div>

        {/* Top actions */}
        <div className="allowances-topbar">
          <div className="search-wrap">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              className="search-input"
              placeholder="Search by employee, category, status…"
            />
          </div>
          <div className="table-buttons">
            <button className="add-allowance-btn" onClick={openModal}>
              + Add Allowance
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          {error && <div style={{ color: 'crimson', margin: '8px 0' }}>{error}</div>}

          <table className="allowances-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Taxable</th>
                <th>Frequency</th>
                <th>Effective From</th>
                <th>Effective To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" style={{ padding: 20 }}>Loading…</td></tr>
              ) : filtered.length ? (
                filtered.map(r => (
                  <tr key={r.id}>
                    <td>{r.employee_id}</td>
                    <td>{r.name}</td>
                    <td>{r.category || '-'}</td>
                    <td>{Number(r.amount || 0).toLocaleString()}</td>
                    <td><span className={`badge ${Number(r.taxable) ? 'yes' : 'no'}`}>{Number(r.taxable) ? 'Yes' : 'No'}</span></td>
                    <td>{r.frequency || '-'}</td>
                    <td>{r.effective_from || '-'}</td>
                    <td>{r.effective_to || '-'}</td>
                    <td><span className={`status ${r.status === 'Active' ? 'active' : 'inactive'}`}>{r.status}</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: 20 }}>No allowances found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="modal" onMouseDown={() => setOpen(false)}>
          <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <h3>Add Allowance</h3>
            <form onSubmit={submit} className="modal-form">
              <div className="grid-2">
                <div>
                  <label>Employee ID *</label>
                  <input
                    type="number"
                    value={form.employee_id}
                    onChange={e => setForm({ ...form, employee_id: e.target.value })}
                    placeholder="e.g., 1"
                    required
                  />
                </div>
                <div>
                  <label>Allowance Name *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Travel Allowance"
                    required
                  />
                </div>
              </div>

              <div className="grid-3">
                <div>
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    {categoryOptions.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label>Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label>Taxable?</label>
                  <select
                    value={form.taxable}
                    onChange={e => setForm({ ...form, taxable: Number(e.target.value) })}
                  >
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>
              </div>

              <div className="grid-3">
                <div>
                  <label>Frequency</label>
                  <select
                    value={form.frequency}
                    onChange={e => setForm({ ...form, frequency: e.target.value })}
                  >
                    {frequencyOptions.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label>Effective From</label>
                  <input
                    type="date"
                    value={form.effective_from}
                    onChange={e => setForm({ ...form, effective_from: e.target.value })}
                  />
                </div>
                <div>
                  <label>Effective To</label>
                  <input
                    type="date"
                    value={form.effective_to}
                    onChange={e => setForm({ ...form, effective_to: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  {statusOptions.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn neutral" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Allowances;
