import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/Deductions.css';

const Deductions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('deductions');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch(tab) {
      case 'earnings':
        navigate('/earnings');
        break;
      case 'deductions':
        navigate('/deductions');
        break;
      case 'allowances':
        navigate('/allowances');
        break;
      case 'overtime':
        navigate('/overtime-adjustments');
        break;
      case 'compensation':
        navigate('/compensation-adjustment');
        break;
      case 'summary':
        navigate('/net-salary-summary');
        break;
      default:
        navigate('/deductions');
    }
  };

  return (
    <div className="deductions-container">
      <Sidebar />
      
      <div className="deductions-content">
        {/* Header */}
        <header className="deductions-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item">Salary & Compensation</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Deductions</span>
            </div>
            <h1 className="page-title">Salary & Compensation</h1>
          </div>
          
          <div className="header-right">
            <div className="notification-icon">🔔</div>
            <div className="user-profile">
              <div className="user-avatar"></div>
              <span className="username">John</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="deductions-tabs">
          <div className={`tab ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => handleTabClick('earnings')}>
            Earnings
          </div>
          <div className={`tab ${activeTab === 'deductions' ? 'active' : ''}`} onClick={() => handleTabClick('deductions')}>
            Deductions
          </div>
          <div className={`tab ${activeTab === 'allowances' ? 'active' : ''}`} onClick={() => handleTabClick('allowances')}>
            Allowances
          </div>
          <div className={`tab ${activeTab === 'overtime' ? 'active' : ''}`} onClick={() => handleTabClick('overtime')}>
            Overtime & Adjustments
          </div>
          <div className={`tab ${activeTab === 'compensation' ? 'active' : ''}`} onClick={() => handleTabClick('compensation')}>
            Compensation adjustment
          </div>
          <div className={`tab ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => handleTabClick('summary')}>
            Net salary summary
          </div>
        </div>

        {/* Main Content - Vertical layout as in image */}
        <div className="deductions-main">
          {/* Information Cards Section */}
          <div className="info-cards-section">
            <div className="info-cards-grid">
              {/* Tax Information Card */}
              <div className="info-card">
                <div className="card-section">
                  <h3>Income Tax</h3>
                  <p>25 % of gross</p>
                  <span className="frequency">Monthly</span>
                </div>
                
                <div className="card-section">
                  <h3>Withholding Tax</h3>
                  <p>3.5% of gross</p>
                  <span className="frequency">Monthly</span>
                </div>
                
                <div className="card-section total">
                  <h3>Total Tax</h3>
                  <p>1x burden</p>
                  <p>14.6 % of gross</p>
                </div>
              </div>

              {/* Performance Funds Card */}
              <div className="info-card">
                <h3 className="card-title">Performance Funds</h3>
                <div className="funds-content">
                  <h4>EPF & ETF Contributions</h4>
                  <div className="amount-line">
                    <span>EPF (Employee)</span>
                    <span className="amount">$ 350.00</span>
                  </div>
                  <div className="note">25 % of basic salary • Monthly</div>
                  
                  <div className="amount-line">
                    <span>ETF</span>
                    <span className="amount">$ 105.00</span>
                  </div>
                  <div className="note">3% of basic salary • Monthly</div>
                  
                  <div className="amount-line total">
                    <span>Total Funds</span>
                    <span className="amount">$ 455.00</span>
                  </div>
                  <div className="note">Retirement Savings • 6.6 % of gross</div>
                </div>
              </div>

              {/* Insurance & Loans Card */}
              <div className="info-card">
                <h3 className="card-title">Insurance & Loans</h3>
                <div className="funds-content">
                  <h4>Health, life & payments</h4>
                  <div className="amount-line">
                    <span>Health Insurance</span>
                    <span className="amount">$ 897.00</span>
                  </div>
                  <div className="note">Premium coverage • Monthly</div>
                  
                  <div className="amount-line">
                    <span>Loan Repayment</span>
                    <span className="amount">$ 100.00</span>
                  </div>
                  <div className="note">Personal Loan • Monthly</div>
                  
                  <div className="amount-line total">
                    <span>Total Tax</span>
                    <span className="amount">$ 997.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section at Bottom */}
          <div className="table-section-bottom">
            <div className="table-header">
              <h2>Deduction Configuration</h2>
              <div className="table-buttons">
                <button 
                className="add-deduction-btn"
                onClick={() => navigate('/add-deduction')}>                         {/*link the add deductin button  */}
                  + Add Deduction</button>
                <button className="filter-btn">Filter</button>
              </div>
            </div>
            
            <div className="table-container">
              <table className="deductions-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Rated Amount</th>
                    <th>Monthly Amount</th>
                    <th>Status</th>
                    <th>Effective Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Income Tax</td>
                    <td>1x</td>
                    <td></td>
                    <td>25%</td>
                    <td>$ 1,000</td>
                    <td>
                      <span className="status active">Active</span>
                    </td>
                    <td>01/02/2025</td>
                    <td className="action">✓</td>
                  </tr>
                  <tr>
                    <td>Withholding Tax</td>
                    <td>1x</td>
                    <td></td>
                    <td>3.5%</td>
                    <td>$ 1,000</td>
                    <td>
                      <span className="status active">Active</span>
                    </td>
                    <td>01/02/2025</td>
                    <td className="action">✓</td>
                  </tr>
                  <tr>
                    <td>EPF (Employee)</td>
                    <td>Statutory</td>
                    <td></td>
                    <td>10%</td>
                    <td>$ 1,000</td>
                    <td>
                      <span className="status active">Active</span>
                    </td>
                    <td>01/02/2025</td>
                    <td className="action">✓</td>
                  </tr>
                  <tr>
                    <td>ETF</td>
                    <td>Statutory</td>
                    <td></td>
                    <td>3%</td>
                    <td>$ 1,000</td>
                    <td>
                      <span className="status active">Active</span>
                    </td>
                    <td>01/02/2025</td>
                    <td className="action">✓</td>
                  </tr>
                  <tr>
                    <td>Health Insurance</td>
                    <td>Insurance</td>
                    <td></td>
                    <td>$175,000</td>
                    <td>$ 1,000</td>
                    <td>
                      <span className="status active">Active</span>
                    </td>
                    <td>01/02/2025</td>
                    <td className="action">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total at Bottom */}
            <div className="total-bottom">
              <div className="total-content">
                <span className="total-label">Total</span>
                <span className="total-amount">$ 1,980,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deductions;