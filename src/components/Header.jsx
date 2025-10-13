// src/components/Header.jsx
import React from 'react';
import '../components/Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-right">
        <div className="notification-icon">🔔</div>
        <div className="user-profile">
          <div className="user-avatar"></div>
          <span className="username">Kamal</span>
          <span className="dropdown-arrow">▼</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
