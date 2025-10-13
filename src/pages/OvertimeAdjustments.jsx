import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/CompensationCommon.css';

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

  // Simple local state (you can wire to backend later)
  const [rules, setRules] = useState({
    weekdayRate: 1.5, weekendRate: 2.0, holidayRate: 2.5, maxHours: 60, effective: ''
  });

  const [entries, setEntries] = useState([
    { emp:'Jeremy Neil', date:'2025-02-01', hours:3, rate:1.5, amount:4500, approved:true },
    { emp:'Annette Biz', date:'2025-02-02', hours:5, rate:2.0, amount:9000, approved:false },
  ]);

  const onChange = (e) => setRules(r => ({...r, [e.target.name]: e.target.value}));

  return (
    <div className="comp-container">
      <Sidebar />

      <div className="comp-content">
        {/* Header */}
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

        {/* Rules + Quick add */}
        <div className="sc-section">
          <div className="sc-grid sc-grid-2">
            <div className="sc-card">
              <h3 className="sc-subtitle">Overtime Rules</h3>
              <label className="sc-label">Weekday rate (× basic hourly)</label>
              <input className="sc-input" name="weekdayRate" value={rules.weekdayRate} onChange={onChange} />

              <label className="sc-label">Weekend rate (×)</label>
              <input className="sc-input" name="weekendRate" value={rules.weekendRate} onChange={onChange} />

              <label className="sc-label">Public holiday rate (×)</label>
              <input className="sc-input" name="holidayRate" value={rules.holidayRate} onChange={onChange} />

              <label className="sc-label">Monthly OT cap (hours)</label>
              <input className="sc-input" name="maxHours" value={rules.maxHours} onChange={onChange} />

              <label className="sc-label">Effective date</label>
              <input type="date" className="sc-input" name="effective" value={rules.effective} onChange={onChange} />

              <div className="sc-actions" style={{marginTop:12}}>
                <button className="btn btn-primary">Save Rules</button>
                <span className="sc-muted">Applies to payroll calculation from the effective month.</span>
              </div>
            </div>

            <div className="sc-card">
              <h3 className="sc-subtitle">Manual Adjustment</h3>
              <p className="sc-muted">Use for one-offs (e.g., public holiday correction).</p>
              <div className="sc-row">
                <input className="sc-input" placeholder="Employee name / code" />
                <input className="sc-input" type="date" />
              </div>
              <div className="sc-row">
                <input className="sc-input" placeholder="Hours" />
                <select className="sc-select">
                  <option value="weekday">Weekday (×{rules.weekdayRate})</option>
                  <option value="weekend">Weekend (×{rules.weekendRate})</option>
                  <option value="holiday">Public holiday (×{rules.holidayRate})</option>
                </select>
              </div>
              <textarea className="sc-textarea" placeholder="Reason / note (optional)" />
              <div className="sc-actions" style={{marginTop:12}}>
                <button className="btn btn-primary">Add OT Entry</button>
                <button className="btn btn-gray">Import CSV</button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="sc-table-wrap">
          <div className="sc-actions" style={{justifyContent:'space-between', padding:'10px 0'}}>
            <h3 className="sc-subtitle" style={{margin:0}}>Recent Overtime Entries</h3>
            <div className="sc-actions">
              <button className="btn btn-soft">Filter</button>
              <button className="btn btn-primary">Export</button>
            </div>
          </div>

          <table className="sc-table">
            <thead>
              <tr>
                <th>Employee</th><th>Date</th><th>Hours</th><th>Rate</th><th>Amount</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((r,i)=>(
                <tr key={i}>
                  <td>{r.emp}</td>
                  <td>{r.date}</td>
                  <td>{r.hours}</td>
                  <td>×{r.rate}</td>
                  <td>Rs {r.amount.toLocaleString()}</td>
                  <td><span className={`pill ${r.approved?'ok':'warn'}`}>{r.approved?'Approved':'Pending'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default OvertimeAdjustments;
