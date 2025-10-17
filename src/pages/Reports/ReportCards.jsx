import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import '../../styles/Reports/statcards.css';

const ReportCards = ({ reportType }) => {
  const payrollcards = [
    { title: 'Total Payroll', amount: '$254,896.00', change: 3.2, isPositive: true, sentence: 'From Last Month' },
    { title: 'Average Salary', amount: '$6,372.00', change: 2.4, isPositive: true, sentence: 'From Last Month' },
    { title: 'Total Overtime', amount: '$18,920.00', change: 1.1, isPositive: true, sentence: 'From Last Month' },
    { title: 'Tax Liabilities', amount: '$9,540.00', change: 0.8, isPositive: true, sentence: 'From Last Month' },
  ];

  const compensateCard = [
    { title: 'Avg. Salary Growth', amount: '+15.2%', sentence: 'Over past 24 months'},
    { title: 'Benefit Value', amount: '$1,140', change: 3.2, isPositive: true },
  ];

  const costcenterCard = [
    { title: 'Total Monthly Cost', amount: '$45,000', sentence: 'Over past 24 months'},
    { title: 'Highest Cost Department', amount: 'Quality Department', change: 1.8, isPositive: true },
    { title: 'Overhead Costs', amount: 'Software Engineer', sentence: 'per Employee', change: 0.5, isPositive: false },
  ];

  const forecastCard = [
    { title: 'Projected Annual Payroll', amount: '$300,000', sentence: 'Based on current growth' },
    { title: 'Projected HeadCount', amount: '500', change: 5, isPositive: true, sentence: 'from current' },
  ];

  const [cards, setCards] = useState(payrollcards);

  useEffect(() => {
    let additionalCards = [];

    switch (reportType) {
      case 'Compensation Trends':
        additionalCards = compensateCard;
        break;
      case 'Cost Center Analysis':
        additionalCards = costcenterCard;
        break;
      case 'Forecasting & Budgeting':
        additionalCards = forecastCard;
        break;
      default:
        additionalCards = [];
    }

    setCards([...payrollcards, ...additionalCards]);
  }, [reportType]);

  return (
    <div style={{ display: 'flex', gap: '24px', padding: '24px', alignItems: 'center' }}>
      <div className='card-container'>
        {cards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            amount={card.amount}
            change={card.change}
            isPositive={card.isPositive}
            sentence={card.sentence}
          />
        ))}
      </div>
    </div>
  );
};

export default ReportCards;
