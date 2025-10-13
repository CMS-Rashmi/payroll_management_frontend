import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/CompensationCommon.css';

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

  const [adj, setAdj] = useState({
    type:'Bonus', mode:'fixed', amount:'', percent:'', month:'', note:''
  });
  const [selection, setSelection] = useState([
    { id:'AOB1C028', name:'Jeremy Neil', dept:'Support', checked:false },
    { id:'AOB1C086', name:'Annette Biz', dept:'QA', checked:false },
    { id:'AOB1C025', name:'Theresa Wu', dept:'People Ops', checked:false },
  ]);

  const toggle = (i)=>setSelection(list=>{
    const copy=[...list]; copy[i]={...copy[i], checked:!copy[i].checked}; return copy;
  });

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
                <option>Reimbursement</option>
              </select>

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
                <button className="btn btn-primary">Preview Impact</button>
                <button className="btn btn-gray" onClick={()=>navigate('/bulk-actions')}>Bulk actions…</button>
              </div>
            </div>

            {/* Right: select employees */}
            <div className="sc-card">
              <h3 className="sc-subtitle">Select Employees</h3>
              <div className="sc-row" style={{marginBottom:10}}>
                <input className="sc-input" placeholder="Search employees…" />
                <select className="sc-select">
                  <option>All Departments</option><option>HR</option><option>IT</option><option>Finance</option>
                </select>
              </div>

              <table className="sc-table">
                <thead><tr><th></th><th>Employee</th><th>ID</th><th>Department</th></tr></thead>
                <tbody>
                  {selection.map((e,i)=>(
                    <tr key={e.id}>
                      <td><input type="checkbox" checked={e.checked} onChange={()=>toggle(i)} /></td>
                      <td>{e.name}</td><td>{e.id}</td><td>{e.dept}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="sc-actions" style={{marginTop:10}}>
                <button className="btn btn-primary">Apply to Selected</button>
                <button className="btn btn-soft">Clear</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompensationAdjustment;
