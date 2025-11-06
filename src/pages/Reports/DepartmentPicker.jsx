import React, { useState, useEffect } from 'react';
import { apiGet } from '../../services/api';

const DepartmentPicker = ({ onChange }) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await apiGet('/reports/departments');
        const allOption = { id: 'all', name: 'ALL' };
        const deptList = [allOption, ...res];
        setDepartments(deptList);
        setSelectedDept(allOption.id);
        if (onChange) onChange(allOption.id); // send only id
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, [onChange]);

  const handleChange = (deptId) => {
    setSelectedDept(deptId);
    if (onChange) onChange(deptId); // send only id
  };


  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      Department:
      <select
        value={selectedDept}
        style={{ height: 24, padding: 2 }}
        onChange={(e) => handleChange(e.target.value)}
      >
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DepartmentPicker;
