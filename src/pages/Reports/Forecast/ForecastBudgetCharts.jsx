import React from 'react'
import PayRollCostProjectionChart from './PayRollCostProjectionChart'
import DepartmentBudgetChart from './DepartmentBudgetChart'
import '../../../styles/Reports/chart.css';

const ForecastBudgetCharts = () => {
  return (
    <div>
      <div className='charts-container'>
        <div className="chart-outline">
          <PayRollCostProjectionChart />
        </div>

        <div className="chart-outline">
          <DepartmentBudgetChart />
        </div>

      </div>
    </div>
  )
}

export default ForecastBudgetCharts
