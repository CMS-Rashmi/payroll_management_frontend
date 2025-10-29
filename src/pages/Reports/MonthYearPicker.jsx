import React, { useState } from 'react';

const MonthYearPicker = ({ onChange }) => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1); // 1–12
  const [year, setYear] = useState(now.getFullYear());

  // Generate years: from (current year - 10) up to current year
  const years = Array.from({ length: 11 }, (_, i) => now.getFullYear() - 10 + i);

  const handleChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
    if (onChange) onChange({ month: newMonth, year: newYear });
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <label>
        Month:
        <select
          value={month}
          onChange={(e) => handleChange(Number(e.target.value), year)}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </label>

      <label>
        Year:
        <select
          value={year}
          onChange={(e) => handleChange(month, Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default MonthYearPicker;
