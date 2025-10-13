import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/CompensationCommon.css';

const NetSalarySummary = () => {
  const navigate = useNavigate();
  const go = (k)=>{
    if(k==='earnings') navigate('/earnings');
    else if(k==='deductions') navigate('/deductions');
    else if(k==='allowances') navigate('/allowances');
    else if(k==='overtime') navigate('/overtime-adjustments');
    else if(k==='compensation') navigate('/compensation-adjustment');
    else if(k==='summary') navigate('/net-salary-summary');
  };

  const rows = [
    { emp:'Jeremy Neil', id:'AOB1C028', dept:'Support', gross:100000, deduct:14600+6600+997, net:100000-(14600+6600+997), status:'Ready' },
    { emp:'Annette Biz', id:'AOB1C086', dept:'QA',      gross:90000,  deduct:14000, net:76000, status:'Pending' },
  ];

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

        <div className="comp-tabs">
          {[
            ['earnings','Earnings'],['deductions','Deductions'],['allowances','Allowances'],
            ['overtime','Overtime & Adjustments'],['compensation','Compensation adjustment'],
            ['summary','Net salary summary']
          ].map(([k,l])=>(
            <div key={k} className={`comp-tab ${k==='summary'?'active':''}`} onClick={()=>go(k)}>{l}</div>
          ))}
        </div>

        <div className="sc-section sc-card">
          <div className="sc-row">
            <input className="sc-input" type="month" defaultValue="2025-02" />
            <select className="sc-select"><option>All Departments</option><option>HR</option><option>IT</option></select>
            <select className="sc-select"><option>All Designations</option><option>HR</option><option>QA</option></select>
            <button className="btn btn-primary">Recalculate</button>
          </div>
        </div>

        <div className="sc-table-wrap">
          <div className="sc-actions" style={{justifyContent:'space-between', padding:'10px 0'}}>
            <h3 className="sc-subtitle" style={{margin:0}}>Payroll (preview)</h3>
            <div className="sc-actions">
              <button className="btn btn-soft">Validate</button>
              <button className="btn btn-primary">Export CSV</button>
              <button className="btn btn-danger">Finalize Month</button>
            </div>
          </div>

          <table className="sc-table">
            <thead>
              <tr>
                <th>Employee</th><th>ID</th><th>Department</th>
                <th>Gross</th><th>Total Deductions</th><th>Net</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={i}>
                  <td>{r.emp}</td><td>{r.id}</td><td>{r.dept}</td>
                  <td>Rs {r.gross.toLocaleString()}</td>
                  <td>Rs {r.deduct.toLocaleString()}</td>
                  <td>Rs {r.net.toLocaleString()}</td>
                  <td><span className={`pill ${r.status==='Ready'?'ok':'warn'}`}>{r.status}</span></td>
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
