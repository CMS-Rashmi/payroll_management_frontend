// src/pages/Deductions.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/Deductions.css';
import { apiGet } from '../services/api';
import { fetchDeductions } from '../services/deductionsApi';


const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const labelNow = () => `${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`;
const parseLabel = (lab) => {
  const [mName, y] = lab.split(' ');
  return { m: MONTHS.indexOf(mName) + 1, y: Number(y) };
};

export default function Deductions() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('deductions');

  const [monthFilter, setMonthFilter] = useState(labelNow());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErrMsg] = useState('');

  const monthOptions = useMemo(() => {
    const y = new Date().getFullYear();
    const vals = [];
    [y-1, y, y+1].forEach(Y => MONTHS.forEach(M => vals.push(`${M} ${Y}`)));
    return vals.reverse();
  }, []);

  async function load() {
  setErrMsg('');
  try {
    const m = new Date().getMonth() + 1;
    const y = new Date().getFullYear();
    const data = await fetchDeductions(m, y);
    setRows(data.data || []);
  } catch (e) {
    setErrMsg(e.message || 'Failed to load deductions');
  }
}

useEffect(() => { load(); }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrMsg('');
      try {
        const { m, y } = parseLabel(monthFilter);
        // try month filter; fall back to all if backend doesn’t support it
        let res;
        try {
          res = await apiGet(`/salary/deductions?month=${m}&year=${y}`);
        } catch {
          res = await apiGet('/salary/deductions');
        }
        setRows(res.data || []);
      } catch (e) {
        setErrMsg(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [monthFilter]);

  const total = useMemo(
    () => rows.reduce((a, r) => a + (Number(r.amount) || 0), 0),
    [rows]
  );

  const goto = (tab) => {
    setActiveTab(tab);
    const map = {
      earnings:'/earnings', deductions:'/deductions', allowances:'/allowances',
      overtime:'/overtime-adjustments', compensation:'/compensation-adjustment',
      summary:'/net-salary-summary'
    };
    navigate(map[tab] || '/deductions');
  };

  return (
    <div className="deductions-container">
      <Sidebar />
      <div className="deductions-content">
        <header className="deductions-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Salary & Compensation</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Deductions</span>
            </div>
            <h1 className="page-title">Salary & Compensation</h1>
          </div>
          <div className="header-right">
            <div className="notification-icon">🔔</div>
            <div className="user-profile">
              <div className="user-avatar"></div><span className="username">John</span><span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </header>

        <div className="deductions-tabs">
          <div className={`tab ${activeTab==='earnings'?'active':''}`} onClick={() => goto('earnings')}>Earnings</div>
          <div className={`tab ${activeTab==='deductions'?'active':''}`} onClick={() => goto('deductions')}>Deductions</div>
          <div className={`tab ${activeTab==='allowances'?'active':''}`} onClick={() => goto('allowances')}>Allowances</div>
          <div className={`tab ${activeTab==='overtime'?'active':''}`} onClick={() => goto('overtime')}>Overtime & Adjustments</div>
          <div className={`tab ${activeTab==='compensation'?'active':''}`} onClick={() => goto('compensation')}>Compensation adjustment</div>
          <div className={`tab ${activeTab==='summary'?'active':''}`} onClick={() => goto('summary')}>Net salary summary</div>
        </div>

        {/* Simple month filter */}
        <div className="info-cards-section" style={{ paddingTop: 16 }}>
          <label style={{ fontSize: 13, color: '#555', marginRight: 8 }}>Month</label>
          <select value={monthFilter} onChange={e=>setMonthFilter(e.target.value)} style={{ padding:'8px 10px', border:'1px solid #e0e0e0', borderRadius:6 }}>
            {monthOptions.map(o => <option key={o}>{o}</option>)}
          </select>
          {err && <span style={{ color:'crimson', marginLeft: 12 }}>{err}</span>}
        </div>

        <div className="table-section-bottom">
          <div className="table-header">
            <h2>Deduction Configuration</h2>
            <div className="table-buttons">
              <button className="add-deduction-btn" onClick={() => navigate('/add-deduction')}>+Add Deduction</button>
            </div>
          </div>

          <div className="table-container">
            <table className="deductions-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Basis</th>
                  <th>Percent</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Effective Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" style={{ padding:20 }}>Loading…</td></tr>
                ) : rows.length ? rows.map(r => (
                  <tr key={r.id}>
                    <td>{r.employee_name || `#${r.employee_id}`}</td>
                    <td>{r.name}</td>
                    <td>{r.type}</td>
                    <td>{r.basis}</td>
                    <td>{r.basis === 'Percent' ? `${r.percent || 0}%` : '-'}</td>
                    <td>${Number(r.amount || 0).toLocaleString()}</td>
                    <td><span className="status active">{r.status}</span></td>
                    <td>{(r.effective_date || '').slice(0,10)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="8" style={{ padding:20, textAlign:'center' }}>No deductions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="total-bottom">
            <div className="total-content">
              <span className="total-label">Total</span>
              <span className="total-amount">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
