import React, { useEffect, useState } from 'react';
import { apiGetWithParams } from '../../../services/api';
import StatCard from '../StatCard';

const PayrollSummaryCards = ({ month, year }) => {
  const [loading, setLoading] = useState(true);
  const [payroll, setPayroll] = useState({});

  useEffect(() => {
    const fetchMonthlyTotal = async () => {
      setLoading(true);
      try {
        const res = await apiGetWithParams('/reports/payroll/month', { month, year });
        setPayroll(res);
        console.log(res);
      } catch (err) {
        console.error('Failed to fetch payroll summary:', err);
      } finally {
        setLoading(false);
      }
    };

    if (month && year) {
      fetchMonthlyTotal();
    }
  }, [month, year]); // ✅ Dependency on props

  if (loading) return <p>Loading...</p>;

  const payrollCards = [
    {
      title: 'Total Net Salary',
      amount: `Rs.${Number(payroll.net_salary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      title: 'Total Allowances',
      amount: `Rs.${Number(payroll.allowances || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      title: 'Total Deductions',
      amount: `Rs.${Number(payroll.deductions || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      title: 'Total Bonuses',
      amount: `Rs.${Number(payroll.bonuses || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      title: 'Total Reimbursements',
      amount: `Rs.${Number(payroll.reimbursement || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
  ];

  return (
    <div style={{ display: 'flex', gap: '15px', padding: '10px', flexWrap: 'wrap' }}>
      {payrollCards.map((card, index) => (
        <StatCard key={index} title={card.title} amount={card.amount} />
      ))}
    </div>
  );
};

export default PayrollSummaryCards;
