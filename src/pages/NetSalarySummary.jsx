// src/pages/NetSalarySummary.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/CompensationCommon.css';
import { apiGet, apiPost } from '../services/api';

const NetSalarySummary = () => {
  const navigate = useNavigate();

  // Tabs
  const go = (k)=>{
    if(k==='earnings') navigate('/earnings');
    else if(k==='deductions') navigate('/deductions');
    else if(k==='allowances') navigate('/allowances');
    else if(k==='overtime') navigate('/overtime-adjustments');
    else if(k==='compensation') navigate('/compensation-adjustment');
    else if(k==='summary') navigate('/net-salary-summary');
  };

  // Filters
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}`;

  const [period, setPeriod] = useState(defaultMonth); // "YYYY-MM"
  const [q, setQ] = useState('');
  const [grades, setGrades] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [gradeId, setGradeId] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  // Data
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load filters (grades + departments) once
  useEffect(() => {
    (async () => {
      try {
        const [g, d] = await Promise.all([
          apiGet('/salary/grades'),
          apiGet('/salary/departments'),
        ]);
        setGrades(Array.isArray(g) ? g : (g?.data || []));
        setDepartments(Array.isArray(d?.data) ? d.data : (d?.data || []));
      } catch (e) {
        console.error(e);
        setGrades([]);
        setDepartments([]);
      }
    })();
  }, []);

  const fetchSummary = async () => {
    const [y, m] = period.split('-').map(Number);
    const qs = new URLSearchParams();
    qs.set('month', m);
    qs.set('year', y);
    if (q.trim()) qs.set('q', q.trim());
    if (gradeId) qs.set('grade_id', gradeId);
    if (departmentId) qs.set('department_id', departmentId);

    setLoading(true);
    try {
      const res = await apiGet(`/salary/summary?${qs.toString()}`);
      const data = Array.isArray(res?.data) ? res.data : (res?.data?.data || res?.data || []);
      setRows(data);
    } catch (e) {
      console.error(e);
      setRows([]);
      window.alert('Failed to load month summary');
    } finally {
      setLoading(false);
    }
  };

  // First load
  useEffect(() => { fetchSummary(); /* eslint-disable-next-line */ }, []);

  // Simple currency
  const money = (n) => `Rs ${Number(n||0).toLocaleString()}`;

  // Chart values (top 10 by net)
  const top10 = useMemo(() => {
    const sorted = [...rows].sort((a,b)=>Number(b.net)-Number(a.net));
    return sorted.slice(0, 10);
  }, [rows]);

  // Export CSV for current table
  const exportCsv = () => {
    if (!rows.length) return window.alert('No data to export.');
    const headers = ['Employee','ID','Department','Grade','Basic','Allowances','Overtime','Bonus','Gross','Deductions','Net'];
    const csvRows = rows.map(r => ([
      r.full_name,
      r.employee_code || r.employee_id,
      r.department_name || '',
      r.grade_name || '',
      r.basic,
      r.allowances,
      r.overtime,
      r.bonus,
      r.gross,
      r.totalDeductions,
      r.net,
    ]));
    const csv = [headers, ...csvRows]
      .map(arr => arr.map(v => {
        const s = String(v ?? '');
        return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
      }).join(','))
      .join('\n');

    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const [y,m] = period.split('-');
    a.href = url; a.download = `net_salary_summary_${y}_${m}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  // Finalize (store payroll_cycles)
  const finalizeMonth = async () => {
    const [y, m] = period.split('-').map(Number);
    if (!m || !y) return window.alert('Pick a valid month.');
    if (!window.confirm(`Finalize payroll for ${y}/${String(m).padStart(2,'0')}?`)) return;
    try {
      const res = await apiPost('/salary/run', { month:m, year:y });
      window.alert(res?.message || 'Payroll finalized.');
    } catch (e) {
      console.error(e);
      window.alert('Failed to finalize payroll');
    }
  };

  return (
    <div className="comp-container">
      <Sidebar />
      <div className="comp-content">
        <Header/>
        <header className="comp-header">
          <div>
            <div className="comp-breadcrumb"><span>Salary & Compensation</span> <span>›</span> <span className="active">Net salary summary</span></div>
            <h1 className="comp-title">Salary & Compensation</h1>
          </div>
        </header>

        {/* Tabs */}
        <div className="comp-tabs">
          {[
            ['earnings','Earnings'],['deductions','Deductions'],['allowances','Allowances'],
            ['overtime','Overtime & Adjustments'],['compensation','Compensation adjustment'],
            ['summary','Net salary summary']
          ].map(([k,l])=>(
            <div key={k} className={`comp-tab ${k==='summary'?'active':''}`} onClick={()=>go(k)}>{l}</div>
          ))}
        </div>

        {/* Filters card */}
        <div className="sc-section sc-card">
          <div className="sc-grid sc-grid-3">
            <div>
              <label className="sc-label">Month</label>
              <input className="sc-input" type="month" value={period} onChange={(e)=>setPeriod(e.target.value)} />
            </div>
            <div>
              <label className="sc-label">Department</label>
              <select className="sc-select" value={departmentId} onChange={(e)=>setDepartmentId(e.target.value)}>
                <option value="">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="sc-label">Grade</label>
              <select className="sc-select" value={gradeId} onChange={(e)=>setGradeId(e.target.value)}>
                <option value="">All Grades</option>
                {grades.map(g => (
                  <option key={g.grade_id} value={g.grade_id}>{g.grade_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="sc-row" style={{ marginTop: 10 }}>
            <input
              className="sc-input"
              placeholder="Search by name / code / ID…"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              style={{ maxWidth: 420 }}
            />
            <button className="btn btn-primary" onClick={fetchSummary} disabled={loading}>
              {loading ? 'Loading…' : 'Recalculate'}
            </button>
          </div>
        </div>

        {/* Quick Net Salary Chart (Top 10) */}
        <div className="sc-section sc-card">
          <h3 className="sc-subtitle" style={{marginBottom:12}}>Top 10 Net Salaries (current filters)</h3>
          {!rows.length && <div className="sc-muted">No data.</div>}
          {rows.length > 0 && (
            <div>
              {top10.map((r,i) => {
                const maxNet = top10[0]?.net || 1;
                const widthPct = Math.max(2, Math.round((Number(r.net)/maxNet)*100));
                return (
                  <div key={r.employee_id} style={{ display:'flex', alignItems:'center', gap:10, margin:'6px 0' }}>
                    <div style={{ width: 180, fontSize:12, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {r.full_name}
                    </div>
                    <div style={{ flex:1, background:'#eef2f7', borderRadius:6, height:20, position:'relative' }}>
                      <div style={{ width:`${widthPct}%`, height:'100%', borderRadius:6 }} className="btn-soft" />
                    </div>
                    <div style={{ width: 120, textAlign:'right', fontSize:12 }}>{money(r.net)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="sc-table-wrap">
          <div className="sc-actions" style={{justifyContent:'space-between', padding:'10px 0'}}>
            <h3 className="sc-subtitle" style={{margin:0}}>Payroll (preview)</h3>
            <div className="sc-actions">
              <button className="btn btn-soft" onClick={fetchSummary} disabled={loading}>
                {loading ? 'Validating…' : 'Validate'}
              </button>
              <button className="btn btn-primary" onClick={exportCsv}>Export CSV</button>
              <button className="btn btn-danger" onClick={finalizeMonth}>Finalize Month</button>
            </div>
          </div>

          <table className="sc-table">
            <thead>
              <tr>
                <th>Employee</th><th>ID</th><th>Department</th><th>Grade</th>
                <th>Gross</th><th>Total Deductions</th><th>Net</th>
              </tr>
            </thead>
            <tbody>
              {!rows.length && (
                <tr>
                  <td colSpan={7} className="sc-muted" style={{ padding: 18 }}>No data for this period / filters.</td>
                </tr>
              )}
              {rows.map(r=>(
                <tr key={r.employee_id}>
                  <td>{r.full_name}</td>
                  <td>{r.employee_code || r.employee_id}</td>
                  <td>{r.department_name || '-'}</td>
                  <td>{r.grade_name || '-'}</td>
                  <td>{money(r.gross)}</td>
                  <td>{money(r.totalDeductions)}</td>
                  <td>{money(r.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default NetSalarySummary;
