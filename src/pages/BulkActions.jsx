import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/CompensationCommon.css';

const BulkActions = () => {
  const [sel, setSel] = useState([{id:'A1',name:'Jeremy Neil',dept:'Support'},
    {id:'A2',name:'Annette Biz',dept:'QA'},{id:'A3',name:'Theresa Wu',dept:'People Ops'}].map(x=>({...x,checked:false})));
  const [action,setAction]=useState('Bonus');

  const toggle = i => setSel(list => { const c=[...list]; c[i].checked=!c[i].checked; return c; });

  return (
    <div className="comp-container">
      <Sidebar />
      <div className="comp-content">
        <header className="comp-header">
          <div>
            <div className="comp-breadcrumb"><span>Administration</span> <span>›</span> <span className="active">Bulk Actions</span></div>
            <h1 className="comp-title">Bulk Actions</h1>
          </div>
          <div className="comp-right"><div className="comp-avatar" /><span className="sc-muted">John</span></div>
        </header>

        <div className="sc-section sc-card">
          <div className="sc-row">
            <select className="sc-select" value={action} onChange={e=>setAction(e.target.value)}>
              <option>Bonus</option><option>Allowance</option><option>Deduction</option>
            </select>
            <input className="sc-input" placeholder="Amount / %"/>
            <input className="sc-input" placeholder="Reason"/>
            <button className="btn btn-primary">Apply</button>
          </div>
        </div>

        <div className="sc-table-wrap">
          <table className="sc-table">
            <thead><tr><th></th><th>Employee</th><th>ID</th><th>Department</th></tr></thead>
            <tbody>
              {sel.map((r,i)=>(
                <tr key={r.id}>
                  <td><input type="checkbox" checked={r.checked} onChange={()=>toggle(i)} /></td>
                  <td>{r.name}</td><td>{r.id}</td><td>{r.dept}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default BulkActions;
