// src/pages/OvertimeAdjustments.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/CompensationCommon.css';
import { apiGet, apiPost } from '../services/api';

// ---- Static grades shown in UI (no backend call needed)
const STATIC_GRADES = [
  { grade_id: 1, grade_name: 'A' },
  { grade_id: 2, grade_name: 'B' },
  { grade_id: 3, grade_name: 'C' },
];

const OvertimeAdjustments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overtime');

  const go = (tab) => {
    setActiveTab(tab);
    if (tab === 'earnings') navigate('/earnings');
    else if (tab === 'deductions') navigate('/deductions');
    else if (tab === 'allowances') navigate('/allowances');
    else if (tab === 'overtime') navigate('/overtime-adjustments');
    else if (tab === 'compensation') navigate('/compensation-adjustment');
    else if (tab === 'summary') navigate('/net-salary-summary');
  };

  /* ================== Grade-first (STATIC) ================== */
  const grades = STATIC_GRADES;
  const [gradeId, setGradeId] = useState('');
  const [uiDisabled, setUiDisabled] = useState(true);

  const selectedGradeName = useMemo(
    () => grades.find((g) => String(g.grade_id) === String(gradeId))?.grade_name || '',
    [grades, gradeId]
  );

  /* ================== Grade rules overview cards ================== */
  const [rulesOverview, setRulesOverview] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const ids = [1, 2, 3];
        const out = [];
        for (const id of ids) {
          const r = await apiGet(`/salary/overtime/rules/${id}`);
          out.push({
            grade_id: id,
            grade_name: ['A', 'B', 'C'][id - 1],
            ot_rate: r?.ot_rate ?? null,
            max_ot_hours: r?.max_ot_hours ?? null,
            created_at: r?.created_at || null,
          });
        }
        setRulesOverview(out);
      } catch {
        setRulesOverview([]);
      }
    })();
  }, []);

  /* ================== Rules ================== */
  const [rules, setRules] = useState({
    weekdayRate: '',
    weekendRate: '2',
    holidayRate: '2.5',
    maxHours: '',
    effective: '',
  });
  const [savingRule, setSavingRule] = useState(false);
  const onRuleChange = (e) => setRules(r => ({ ...r, [e.target.name]: e.target.value }));

  const loadRule = async (gid) => {
    if (!gid) return;
    try {
      const data = await apiGet(`/salary/overtime/rules/${gid}`);
      setRules((cur) => ({
        ...cur,
        weekdayRate: data?.ot_rate ?? '',
        maxHours: data?.max_ot_hours ?? '',
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const onPickGrade = async (gid) => {
    setGradeId(gid);
    const enabled = !!gid;
    setUiDisabled(!enabled);
    if (enabled) {
      await loadRule(gid);
      await refreshEntries(gid);
      await loadEmployeesForGrade(gid); // also feeds search
    } else {
      setEntries([]);
      setGradeEmployees([]);
    }
  };

  const saveRule = async () => {
    if (!gradeId) return window.alert('Select a grade first.');
    if (rules.weekdayRate === '' || rules.maxHours === '') {
      return window.alert('Weekday rate and monthly OT cap are required.');
    }
    setSavingRule(true);
    try {
      await apiPost('/salary/overtime/rules', {
        grade_id: Number(gradeId),
        ot_rate: Number(rules.weekdayRate),
        max_ot_hours: Number(rules.maxHours),
      });
      window.alert('Overtime rule saved.');
      await loadRule(gradeId);

      // update overview card for this grade
      setRulesOverview((old) => {
        const idx = old.findIndex(x => Number(x.grade_id) === Number(gradeId));
        const next = [...old];
        const now = new Date().toISOString();
        const updated = {
          grade_id: Number(gradeId),
          grade_name: selectedGradeName || `#${gradeId}`,
          ot_rate: Number(rules.weekdayRate),
          max_ot_hours: Number(rules.maxHours),
          created_at: now,
        };
        if (idx >= 0) next[idx] = updated;
        else next.push(updated);
        return next;
      });

    } catch (e) {
      console.error(e);
      window.alert(e.message || 'Failed to save rule');
    } finally {
      setSavingRule(false);
    }
  };

  /* ================== Manual Adjustment ================== */
  const [empQuery, setEmpQuery] = useState('');
  const [empResults, setEmpResults] = useState([]);
  const [empSelected, setEmpSelected] = useState(null);
  const [otDate, setOtDate] = useState('');
  const [otHours, setOtHours] = useState('');
  const [otType, setOtType] = useState('weekday');
  const [otReason, setOtReason] = useState('');
  const [savingAdj, setSavingAdj] = useState(false);
  const searchTimer = useRef(null);

  // we use server rules for weekday base, then UI multipliers for weekend/holiday
  const multipliers = useMemo(() => ({
    weekday: 1,
    weekend: Number(rules.weekendRate || 2),
    holiday: Number(rules.holidayRate || 2.5),
  }), [rules.weekendRate, rules.holidayRate]);

  // ====== Employee data source for search & "Employees in grade" table
  const [allEmployees, setAllEmployees] = useState([]);     // cache
  const [gradeEmployees, setGradeEmployees] = useState([]); // filtered
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const loadEmployeesForGrade = async (gid) => {
    setLoadingEmployees(true);
    try {
      // one endpoint already used elsewhere that returns joined department name:
      const data = await apiGet('/employees'); // { ok:true, data: [...] }
      const all = Array.isArray(data?.data) ? data.data : [];
      setAllEmployees(all);
      setGradeEmployees(all.filter(e => Number(e.grade_id) === Number(gid)));
      // also seed search results with top 10 from the selected grade
      setEmpResults(all.filter(e => Number(e.grade_id) === Number(gid)).slice(0, 10).map(toSearchRow));
    } catch (e) {
      console.error(e);
      setAllEmployees([]);
      setGradeEmployees([]);
      setEmpResults([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // convert "employees" list row -> search row (same shape as old /salary/employees/search)
  const toSearchRow = (e) => ({
    employee_id: e.id,
    full_name: e.full_name,
    grade_id: e.grade_id,
    grade_name: STATIC_GRADES.find(g => Number(g.grade_id) === Number(e.grade_id))?.grade_name || '',
    department_name: e.department_name || '',
  });

  // new search: filter client-side over cached employees by name / id / department
  const runLocalSearch = (term) => {
    const q = term.trim().toLowerCase();
    let base = allEmployees;
    if (gradeId) base = base.filter(e => Number(e.grade_id) === Number(gradeId)); // limit by selected grade

    if (!q) {
      setEmpResults(base.slice(0, 10).map(toSearchRow));
      return;
    }
    const out = base.filter(e => {
      const byName = (e.full_name || '').toLowerCase().includes(q);
      const byId = String(e.id).includes(q);
      const byDept = (e.department_name || '').toLowerCase().includes(q);
      return byName || byId || byDept;
    }).slice(0, 25);
    setEmpResults(out.map(toSearchRow));
  };

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => runLocalSearch(empQuery), 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empQuery]);

  const submitAdjustment = async () => {
    if (!gradeId) return window.alert('Select a grade first.');
    if (!empSelected?.employee_id) return window.alert('Pick an employee.');
    if (otHours === '') return window.alert('Enter OT hours.');
    if (rules.weekdayRate === '') return window.alert('Weekday rate is required to compute OT rate.');

    const base = Number(rules.weekdayRate);
    const rate = base * (multipliers[otType] || 1);

    setSavingAdj(true);
    try {
      await apiPost('/salary/overtime/adjustments', {
        employee_id: Number(empSelected.employee_id),
        grade_id: Number(gradeId),
        ot_hours: Number(otHours),
        ot_rate: Number(rate.toFixed(2)),
        adjustment_reason: otReason || null,
      });
      window.alert('Overtime adjustment saved.');
      setOtHours('');
      setOtReason('');
      setOtType('weekday');
      setEmpQuery('');
      setEmpSelected(null);
      await refreshEntries(gradeId);
    } catch (e) {
      console.error(e);
      window.alert(e.message || 'Failed to save adjustment');
    } finally {
      setSavingAdj(false);
    }
  };

  /* ================== Entries table ================== */
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const refreshEntries = async (gid = gradeId) => {
    if (!gid) return;
    setLoadingEntries(true);
    try {
      const qs = new URLSearchParams();
      if (dateFrom) qs.set('from', dateFrom);
      if (dateTo) qs.set('to', dateTo);
      const data = await apiGet(`/salary/overtime/adjustments/grade/${gid}${qs.toString() ? `?${qs}` : ''}`);
      setEntries(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      window.alert('Failed to load overtime entries');
    } finally {
      setLoadingEntries(false);
    }
  };

  const amountFmt = (n) => `Rs ${Number(n || 0).toLocaleString()}`;

  return (
    <div className="comp-container">
      <Sidebar />
      <div className="comp-content">
        <Header/>
        <header className="comp-header">
          <div>
            <div className="comp-breadcrumb">
              <span>Salary & Compensation</span> <span>›</span>
              <span className="active">Overtime & Adjustments</span>
            </div>
            <h1 className="comp-title">Salary & Compensation</h1>
          </div>
        </header>

        {/* Tabs */}
        <div className="comp-tabs">
          {[
            ['earnings','Earnings'],
            ['deductions','Deductions'],
            ['allowances','Allowances'],
            ['overtime','Overtime & Adjustments'],
            ['compensation','Compensation adjustment'],
            ['summary','Net salary summary'],
          ].map(([k,label])=>(
            <div key={k} className={`comp-tab ${activeTab===k?'active':''}`} onClick={()=>go(k)}>
              {label}
            </div>
          ))}
        </div>

        {/* Grade selector (STATIC) */}
        <div className="sc-section" style={{ paddingTop: 18 }}>
          <div className="sc-card" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ minWidth: 260 }}>
              <label className="sc-label" style={{ marginBottom: 6 }}>Select Grade (required)</label>
              <select
                className="sc-select"
                value={gradeId}
                onChange={(e) => onPickGrade(e.target.value)}
              >
                <option value="">-- choose grade --</option>
                {grades.map(g => (
                  <option key={g.grade_id} value={g.grade_id}>
                    {g.grade_name} (#{g.grade_id})
                  </option>
                ))}
              </select>
            </div>
            <div className="sc-muted">Current: <strong>{selectedGradeName || '-'}</strong></div>
          </div>
        </div>

        {/* Grade rules overview cards (numbers forced to black) */}
        <div className="sc-section">
          <div className="sc-grid sc-grid-3">
            {rulesOverview.map(r => (
              <div key={r.grade_id} className="sc-card">
                <div className="sc-row" style={{justifyContent:'space-between'}}>
                  <h3 className="sc-subtitle" style={{margin:0}}>Grade {r.grade_name}</h3>
                  <span className="pill ok">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}</span>
                </div>
                <div className="sc-row" style={{marginTop:8, color:'#111'}}>
                  <div className="sc-muted">Weekday rate</div>
                  <div style={{marginLeft:'auto', fontWeight:700, color:'#111'}}>
                    {r.ot_rate ?? '—'}
                  </div>
                </div>
                <div className="sc-row" style={{marginTop:4, color:'#111'}}>
                  <div className="sc-muted">Monthly cap (hrs)</div>
                  <div style={{marginLeft:'auto', fontWeight:700, color:'#111'}}>
                    {r.max_ot_hours ?? '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules + Manual Adjustment */}
        <div className="sc-section">
          <div className="sc-grid sc-grid-2">
            {/* Overtime Rules */}
            <div className="sc-card" aria-disabled={uiDisabled} style={uiDisabled ? { opacity: 0.6, pointerEvents: 'none' } : {}}>
              <h3 className="sc-subtitle">Overtime Rules</h3>
              <label className="sc-label">Weekday rate (Rs per hour)</label>
              <input className="sc-input" name="weekdayRate" value={rules.weekdayRate} onChange={onRuleChange} type="number" step="0.01" min="0" />

              <label className="sc-label">Weekend rate (×)</label>
              <input className="sc-input" name="weekendRate" value={rules.weekendRate} onChange={onRuleChange} type="number" step="0.01" min="0" />

              <label className="sc-label">Public holiday rate (×)</label>
              <input className="sc-input" name="holidayRate" value={rules.holidayRate} onChange={onRuleChange} type="number" step="0.01" min="0" />

              <label className="sc-label">Monthly OT cap (hours)</label>
              <input className="sc-input" name="maxHours" value={rules.maxHours} onChange={onRuleChange} type="number" step="1" min="0" />

              <label className="sc-label">Effective date</label>
              <input type="date" className="sc-input" name="effective" value={rules.effective} onChange={onRuleChange} />

              <div className="sc-actions" style={{marginTop:12}}>
                <button className="btn btn-primary" onClick={saveRule} disabled={uiDisabled || savingRule}>
                  {savingRule ? 'Saving…' : 'Save Rules'}
                </button>
                <span className="sc-muted">Applies to new entries; weekend/holiday multipliers are UI helpers.</span>
              </div>
            </div>

            {/* Manual Adjustment */}
            <div className="sc-card" aria-disabled={uiDisabled} style={uiDisabled ? { opacity: 0.6, pointerEvents: 'none' } : {}}>
              <h3 className="sc-subtitle">Manual Adjustment</h3>
              <p className="sc-muted">Search by <b>Name</b>, <b>ID</b>, or <b>Department</b>. Results are limited to the selected grade.</p>

              <div className="sc-grid sc-grid-2">
                <div>
                  <label className="sc-label">Employee name / code / department</label>
                  <div style={{ position: 'relative' }}>
                    <EmployeeSearch
                      value={empQuery}
                      onChange={(v) => { setEmpSelected(null); setEmpQuery(v); }}
                      results={empResults}
                      onPick={(row) => { setEmpSelected(row); setEmpQuery(`${row.full_name} (#${row.employee_id})`); setEmpResults([]); }}
                    />
                  </div>
                </div>
                <div>
                  <label className="sc-label">Date</label>
                  <input className="sc-input" type="date" value={otDate} onChange={(e)=>setOtDate(e.target.value)} />
                </div>
              </div>

              <div className="sc-grid sc-grid-2" style={{ marginTop: 10 }}>
                <div>
                  <label className="sc-label">Hours</label>
                  <input className="sc-input" placeholder="e.g., 3.5" value={otHours} onChange={(e)=>setOtHours(e.target.value)} type="number" min="0" step="0.25" />
                </div>
                <div>
                  <label className="sc-label">Type</label>
                  <select className="sc-select" value={otType} onChange={(e)=>setOtType(e.target.value)}>
                    <option value="weekday">Weekday (×1)</option>
                    <option value="weekend">Weekend (×{rules.weekendRate || 2})</option>
                    <option value="holiday">Public holiday (×{rules.holidayRate || 2.5})</option>
                  </select>
                </div>
              </div>

              <label className="sc-label">Reason / note (optional)</label>
              <textarea className="sc-textarea" placeholder="Reason / note (optional)" value={otReason} onChange={(e)=>setOtReason(e.target.value)} />

              <div className="sc-actions" style={{marginTop:12}}>
                <button className="btn btn-primary" onClick={submitAdjustment} disabled={uiDisabled || savingAdj}>
                  {savingAdj ? 'Saving…' : 'Add OT Entry'}
                </button>
                <button className="btn btn-gray" onClick={()=>window.alert('CSV import coming soon')}>Import CSV</button>
              </div>
            </div>
          </div>
        </div>

        {/* OT entries */}
        <div className="sc-table-wrap" aria-disabled={uiDisabled} style={uiDisabled ? { opacity: 0.6, pointerEvents: 'none' } : {}}>
          <div className="sc-actions" style={{justifyContent:'space-between', padding:'10px 0'}}>
            <h3 className="sc-subtitle" style={{margin:0}}>
              Recent Overtime Entries — Grade {selectedGradeName || '-'}
            </h3>
            <div className="sc-actions">
              <input className="sc-input" type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} style={{ width: 150 }} />
              <input className="sc-input" type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} style={{ width: 150 }} />
              <button className="btn btn-soft" onClick={()=>refreshEntries()} disabled={loadingEntries}>
                {loadingEntries ? 'Loading…' : 'Filter'}
              </button>
              <button className="btn btn-primary" onClick={()=>{
                if (!entries.length) return window.alert('No data to export.');
                const headers = ['Adjustment ID','Employee ID','Employee','Grade','Hours','Rate','Amount','Reason','Created At'];
                const rows = entries.map(r => [
                  r.adjustment_id, r.employee_id, r.full_name, r.grade_name || '', r.ot_hours, r.ot_rate, r.ot_amount, r.adjustment_reason || '', r.created_at
                ]);
                const csv = [headers, ...rows]
                  .map(arr => arr.map(v => {
                    const s = String(v ?? '');
                    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
                  }).join(','))
                  .join('\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `overtime_grade_${gradeId}.csv`; a.click();
                URL.revokeObjectURL(url);
              }}>
                Export
              </button>
            </div>
          </div>

          <table className="sc-table">
            <thead>
              <tr>
                <th>Employee</th><th>Grade</th><th>Created</th><th>Hours</th><th>Rate</th><th>Amount</th><th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 && (
                <tr><td colSpan={7} className="sc-muted" style={{ padding: 18 }}>No entries found.</td></tr>
              )}
              {entries.map((r)=>(
                <tr key={r.adjustment_id}>
                  <td>{r.full_name}</td>
                  <td><span className="pill ok">{r.grade_name || '-'}</span></td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td>{Number(r.ot_hours)}</td>
                  <td>{amountFmt(r.ot_rate)}</td>
                  <td>{amountFmt(r.ot_amount)}</td>
                  <td>{r.adjustment_reason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Employees in this grade */}
        <div className="sc-table-wrap" aria-disabled={uiDisabled} style={uiDisabled ? { opacity: 0.6, pointerEvents: 'none' } : {}}>
          <div className="sc-actions" style={{justifyContent:'space-between', padding:'10px 0'}}>
            <h3 className="sc-subtitle" style={{margin:0}}>
              Employees in Grade {selectedGradeName || '-'}
            </h3>
          </div>

          <table className="sc-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Department</th><th>Designation</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loadingEmployees && <tr><td colSpan={5} className="sc-muted" style={{padding:18}}>Loading…</td></tr>}
              {!loadingEmployees && gradeEmployees.length === 0 && (
                <tr><td colSpan={5} className="sc-muted" style={{padding:18}}>No employees in this grade.</td></tr>
              )}
              {gradeEmployees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.full_name}</td>
                  <td>{emp.department_name || '-'}</td>
                  <td>{emp.designation || '-'}</td>
                  <td>{emp.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

// Search box with results dropdown (client-side filter by name/id/department)
function EmployeeSearch({ value, onChange, results, onPick }) {
  return (
    <>
      <input
        className="sc-input"
        placeholder="Type name / ID / department…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div
        style={{
          position: 'absolute',
          top: '100%', left: 0, right: 0,
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderTop: 'none',
          zIndex: 5,
          maxHeight: 260,
          overflowY: 'auto',
        }}
      >
        {results.length === 0 && value?.trim() && (
          <div className="sc-muted" style={{ padding: '10px 12px', fontSize: 12 }}>
            No matches. Try a different name, ID, or department.
          </div>
        )}
        {results.map((row) => (
          <div
            key={row.employee_id}
            onClick={() => onPick(row)}
            style={{ padding: '8px 10px', cursor: 'pointer', borderTop: '1px solid #f0f0f0' }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color:'#111' }}>{row.full_name}</div>
            <div className="sc-muted" style={{ fontSize: 11 }}>
              #{row.employee_id} • Grade {row.grade_name || '-'} • {row.department_name || 'No dept'}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default OvertimeAdjustments;
