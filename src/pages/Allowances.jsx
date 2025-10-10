import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/Allowances.css';

const Allowances = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('allowances');
  const [travelAmount, setTravelAmount] = useState('00.00');
  const [frequency, setFrequency] = useState('2025');
  const [targeted, setTargeted] = useState('0');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [category, setCategory] = useState('Transportation');

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
        navigate('/allowances');
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setTravelAmount(value);
  };

  const frequencyOptions = ['2025', '2024', '2023', 'Monthly', 'Quarterly', 'Annual'];
  const targetedOptions = ['0', '1', '2', '3', '5', '10'];
  const categoryOptions = ['Transportation', 'Meal', 'Housing', 'Medical', 'Communication', 'Other'];

  return (
    <div className="allowances-container">
      <Sidebar />
      
      <div className="allowances-content">
        {/* Header */}
        <header className="allowances-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Salary & Compensation</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Allowance</span>
            </div>
            <h1 className="page-title">SSalary & Compensation</h1>
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
        <div className="allowances-tabs">
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

        {/* Main Content */}
        <div className="allowances-main">
          <div className="configuration-section">
            <h2>Allowances Configuration</h2>
            <p className="subtitle">Enable and configure employee allowances</p>

            {/* Travel Allowance Card */}
            <div className="allowance-card">
              <div className="allowance-header">
                <h3>Travel Allowance</h3>
                <span className="allowance-description">Transportation and commute support</span>
              </div>

              <div className="configuration-grid">
                {/* Amount Section */}
                <div className="config-section">
                  <h4>Amount</h4>
                  <div className="input-group">
                    <div className="amount-input-container">
                      <span className="currency-symbol">$</span>
                      <input 
                        type="text" 
                        value={travelAmount}
                        onChange={handleAmountChange}
                        placeholder="00.00"
                        className="amount-input"
                      />
                    </div>
                  </div>
                  <div className="config-details">
                    <div className="detail-item">
                      <span>Frequency:</span>
                      <select 
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="detail-select"
                      >
                        {frequencyOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div className="detail-item">
                      <span>Targeted:</span>
                      <select 
                        value={targeted}
                        onChange={(e) => setTargeted(e.target.value)}
                        className="detail-select"
                      >
                        {targetedOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Effective Date Section */}
                <div className="config-section">
                  <h4>Effective Date</h4>
                  <div className="input-group">
                    <input 
                      type="date" 
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className="date-input"
                    />
                  </div>
                  <div className="config-details">
                    <div className="detail-item">
                      <span>Category:</span>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="detail-select"
                      >
                        {categoryOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description & Notes */}
              <div className="description-section">
                <h4>Description & Notes</h4>
                <p>For daily commute and business travel expenses, includes fuel, public transport, and parking costs</p>
              </div>
            </div>
          </div>

          {/* Other Allowances Grid */}
          <div className="other-allowances">
            <div className="allowances-grid">
              <div className="allowance-item">
                <div className="allowance-item-header">
                  <h4>Meal Allowance</h4>
                </div>
                <p className="description">daily meal and refreshment support</p>
                <div className="allowance-details">
                  <span className="frequency">Monthly:</span>
                  <span className="amount">$3500.00</span>
                </div>
              </div>

              <div className="allowance-item">
                <div className="allowance-item-header">
                  <h4>Housing Allowance</h4>
                </div>
                <p className="description">Accommodation and rental support</p>
                <div className="allowance-details">
                  <span className="frequency">Monthly:</span>
                  <span className="amount">$3500.00</span>
                </div>
              </div>

              <div className="allowance-item">
                <div className="allowance-item-header">
                  <h4>Medical Allowance</h4>
                </div>
                <p className="description">Healthcare and medical expenses</p>
                <div className="allowance-details">
                  <span className="frequency">Monthly:</span>
                  <span className="amount">$3500.00</span>
                </div>
              </div>

              <div className="allowance-item">
                <div className="allowance-item-header">
                  <h4>Performance Incentives</h4>
                </div>
                <p className="description">Merit based performance rewards</p>
                <div className="allowance-details">
                  <span className="frequency">Monthly:</span>
                  <span className="amount">$3500.00</span>
                </div>
              </div>

              <div className="allowance-item">
                <div className="allowance-item-header">
                  <h4>Communication Allowance</h4>
                </div>
                <p className="description">Phone and internet expenses</p>
                <div className="allowance-details">
                  <span className="frequency">Monthly:</span>
                  <span className="amount">$3500.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allowances;