import React from 'react';
import '../../styles/Reports/statcards.css';

const StatCard = ({ title, amount, change, isPositive, sentence }) => {
  return (
    <div className="report-stat-card">
      <div className='report-stat-head'>{title}</div>
      <div className="report-stat-number">{amount}</div>

      <div className="report-stat-change">
        {isPositive !== undefined ? (
          <>
            {isPositive ? '+' : '-'}
            {change}%
            {sentence && <span className="stat-sentence"> {sentence}</span>}
          </>
        ) : (
          sentence && <span className="stat-sentence">{sentence}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
