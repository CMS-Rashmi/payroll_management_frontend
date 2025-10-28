import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/CompensationCommon.css';
import { apiGet, apiPost } from '../services/api'; // ✅ use the same API wrapper as EmployeeInfo

const CompensationAdjustment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('compensation');

  const go = (k)=>{ setActiveTab(k);
    if(k==='earnings') navigate('/earnings');
    else if(k==='deductions') navigate('/deductions');
    else if(k==='allowances') navigate('/allowances');
    else if(k==='overtime') navigate('/overtime-adjustments');
    else if(k==='compensation') navigate('/compensation-adjustment');
    else if(k==='summary') navigate('/net-salary-summary');
  };

  // Adjustment form
  const [adj, setAdj] = useState({
    type:'Bonus', mode:'fixed', amount:'', percent:'', month:'', note:'', category:'Other'
  });

  // Filters + data
  const [q, setQ] = useState('');
  const [departments, setDepartments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [deptId, setDeptId] = useState('');
  const [gradeId, setGradeId] = useState('');

  const [rows, setRows] = useState([]);         // employees grid
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Selection
  const [checked, setChecked] = useState({});   // { employee_id: true }
  const selectedIds = useMemo(()=>Object.keys(checked).filter(k=>checked[k]).map(Number), [checked]);

  // Preview
  const [preview, setPreview] = useState(null); // { items, total, meta }

  // Load dropdowns once
  useEffect(()=>{
    (async()=>{
      try {
        const [dJson, gJson] = await Promise.all([
          apiGet('/salary/departments'), // ✅ wrapper adds /api and auth
          apiGet('/salary/grades'),
        ]);
        if (dJson?.ok) setDepartments(dJson.data || []);
        // /salary/grades returns a plain array in your backend
        setGrades(Array.isArray(gJson) ? gJson : (gJson?.data || []));
      } catch (e) {
        console.error(e);
      }
    })();
  },[]);

  // Load employees with filters
  const loadEmployees = async()=>{
    setLoading(true);
    setLoadError('');
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (deptId) params.set('department_id', deptId);
      if (gradeId) params.set('grade_id', gradeId);

      // ✅ use wrapper and the same path convention as EmployeeInfo
      const json = await apiGet(`/salary/employees?${params.toString()}`);
      if (json?.ok) {
        const data = json.data || [];
        setRows(data);
        // keep selection where still visible
        setChecked(prev=>{
          const next={};
          data.forEach(r=>{ if (prev[r.employee_id]) next[r.employee_id]=true; });
          return next;
        });
      } else {
        setRows([]);
        setLoadError(json?.message || 'Failed to load employees');
      }
    } catch(e){
      console.error(e);
      setRows([]);
      setLoadError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ loadEmployees(); },[]);

  const toggleOne = (id) => setChecked(m=>({ ...m, [id]: !m[id] }));
  const clearSel = () => setChecked({});

  const onPreview = async () => {
    setPreview(null);
    if (!adj.month) { alert('Please pick an effective month'); return; }
    if (selectedIds.length === 0) { alert('Select at least one employee'); return; }

    const payload = {
      type: adj.type,
      mode: adj.mode,
      amount: adj.mode==='fixed' ? Number(adj.amount || 0) : null,
      percent: adj.mode==='percent' ? Number(adj.percent || 0) : null,
      month: adj.month,
      note: adj.note || null,
      employee_ids: selectedIds,
      category: adj.category || 'Other',
    };

    const json = await apiPost('/salary/compensation/preview', payload);
    if (!json?.ok) { alert(json?.message || 'Preview failed'); return; }
    setPreview(json);
  };

  const onApply = async () => {
    if (!adj.month) { alert('Please pick an effective month'); return; }
    if (selectedIds.length === 0) { alert('Select at least one employee'); return; }
    if (!window.confirm(`Apply ${adj.type} to ${selectedIds.length} employee(s)?`)) return;

    const payload = {
      type: adj.type,
      mode: adj.mode,
      amount: adj.mode==='fixed' ? Number(adj.amount || 0) : null,
      percent: adj.mode==='percent' ? Number(adj.percent || 0) : null,
      month: adj.month,
      note: adj.note || null,
      employee_ids: selectedIds,
      category: adj.category || 'Other',
    };

    const json = await apiPost('/salary/compensation/apply', payload);
    if (!json?.ok) { alert(json?.message || 'Apply failed'); return; }
    alert(json.message);
    setPreview(null);
    clearSel();
    loadEmployees();
  };

  return (
    <div className="comp-container">
      <Sidebar />
      <div className="comp-content">
        <Header/>
        <header className="comp-header">
          <div>
            <div className="comp-breadcrumb">
              <span>Salary & Compensation</span> <span>›</span>
              <span className="active">Compensation Adjustment</span>
            </div>
            <h1 className="comp-title">Salary & Compensation</h1>
          </div>
        </header>

        <div className="comp-tabs">
          {[
            ['earnings','Earnings'],['deductions','Deductions'],['allowances','Allowances'],
            ['overtime','Overtime & Adjustments'],['compensation','Compensation adjustment'],
            ['summary','Net salary summary']
          ].map(([k,l])=>(
            <div key={k} className={`comp-tab ${activeTab===k?'active':''}`} onClick={()=>go(k)}>{l}</div>
          ))}
        </div>

        <div className="sc-section">
          <div className="sc-grid sc-grid-2">
            {/* Left: adjustment builder */}
            <div className="sc-card">
              <h3 className="sc-subtitle">Create Adjustment</h3>

              <label className="sc-label">Type</label>
              <select className="sc-select" value={adj.type} onChange={e=>setAdj(a=>({...a,type:e.target.value}))}>
                <option>Bonus</option>
                <option>Arrears</option>
                <option>Correction</option>
                <option>Allowance</option>
                <option>Reimbursement</option>
              </select>

              {(adj.type === 'Reimbursement' || adj.type === 'Allowance') && (
                <>
                  <label className="sc-label">Category (optional)</label>
                  <input className="sc-input" value={adj.category} onChange={e=>setAdj(a=>({...a,category:e.target.value}))}/>
                </>
              )}

              <label className="sc-label">Apply as</label>
              <select className="sc-select" value={adj.mode} onChange={e=>setAdj(a=>({...a,mode:e.target.value}))}>
                <option value="fixed">Fixed amount</option>
                <option value="percent">% of basic</option>
              </select>

              {adj.mode==='fixed' ? (
                <>
                  <label className="sc-label">Amount (LKR)</label>
                  <input className="sc-input" value={adj.amount} onChange={e=>setAdj(a=>({...a,amount:e.target.value}))}/>
                </>
              ) : (
                <>
                  <label className="sc-label">Percent (%)</label>
                  <input className="sc-input" value={adj.percent} onChange={e=>setAdj(a=>({...a,percent:e.target.value}))}/>
                </>
              )}

              <label className="sc-label">Effective month</label>
              <input type="month" className="sc-input" value={adj.month} onChange={e=>setAdj(a=>({...a,month:e.target.value}))}/>

              <label className="sc-label">Reason / note</label>
              <textarea className="sc-textarea" value={adj.note} onChange={e=>setAdj(a=>({...a,note:e.target.value}))}/>

              <div className="sc-actions" style={{marginTop:12}}>
                <button className="btn btn-primary" onClick={onPreview}>Preview Impact</button>
                <button className="btn btn-gray" onClick={onApply}>Apply to Selected</button>
              </div>

              {preview && (
                <div style={{marginTop:14}}>
                  <div className="pill ok">Preview ready</div>
                  <table className="sc-table" style={{marginTop:10}}>
                    <thead><tr><th>Employee</th><th>Basic</th><th>Computed</th></tr></thead>
                    <tbody>
                      {preview.items.map(it=>(
                        <tr key={it.employee_id}>
                          <td>{it.name} (#{it.employee_id})</td>
                          <td>{Number(it.basic_salary||0).toFixed(2)}</td>
                          <td>{Number(it.computed_amount||0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan={2} style={{textAlign:'right'}}>Total</th>
                        <th>{Number(preview.total||0).toFixed(2)}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* Right: select employees */}
            <div className="sc-card">
              <h3 className="sc-subtitle">Select Employees</h3>
              <div className="sc-row" style={{marginBottom:10}}>
                <input className="sc-input" placeholder="Search by name / id / code…" value={q} onChange={e=>setQ(e.target.value)} />
                <select className="sc-select" value={deptId} onChange={e=>setDeptId(e.target.value)}>
                  <option value="">All Departments</option>
                  {departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                <select className="sc-select" value={gradeId} onChange={e=>setGradeId(e.target.value)}>
                  <option value="">All Grades</option>
                  {grades.map(g=><option key={g.grade_id} value={g.grade_id}>{g.grade_name}</option>)}
                </select>
                <button className="btn btn-soft" onClick={loadEmployees}>Search</button>
              </div>

              <table className="sc-table">
                <thead><tr><th style={{width:40}}></th><th>Employee</th><th>ID</th><th>Department</th><th>Grade</th><th>Basic</th></tr></thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6}>Loading…</td></tr>
                  ) : loadError ? (
                    <tr><td colSpan={6} style={{color:'crimson'}}>{loadError}</td></tr>
                  ) : rows.length === 0 ? (
                    <tr><td colSpan={6}>No results</td></tr>
                  ) : rows.map((e)=>(
                    <tr key={e.employee_id}>
                      <td><input type="checkbox" checked={!!checked[e.employee_id]} onChange={()=>toggleOne(e.employee_id)} /></td>
                      <td>{e.full_name}</td>
                      <td>{e.employee_id}</td>
                      <td>{e.department_name || '-'}</td>
                      <td>{e.grade_name || '-'}</td>
                      <td>{Number(e.basic_salary||0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="sc-actions" style={{marginTop:10}}>
                <button className="btn btn-primary" onClick={onApply}>Apply to Selected</button>
                <button className="btn btn-soft" onClick={clearSel}>Clear</button>
                <div className="sc-muted" style={{marginLeft:'auto'}}>
                  Selected: {selectedIds.length}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompensationAdjustment;
