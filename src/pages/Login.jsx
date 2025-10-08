import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../services/api';
import { Building2, Mail, Lock, LogIn, Users, UserCheck } from 'lucide-react';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiPost('/login', { email, password, role });

      if (response.ok) {
        // Save JWT and user info
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Navigate based on role
        if (role === 'hr') {
          navigate('/dashboard'); // HR admin dashboard
        } else {
          navigate('/employee-dashboard'); // Employee dashboard
        }
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page or show modal
    console.log('Forgot password clicked');
  };

  const handleContactSupport = () => {
    // Navigate to support page or open email
    console.log('Contact support clicked');
  };

  return (
    <div className="login-container">
      {/* Background Pattern */}
      <div className="background-pattern">
        <div className="pattern-circle pattern-circle-1"></div>
        <div className="pattern-circle pattern-circle-2"></div>
      </div>

      {/* Login Card */}
      <div className="login-wrapper">
        <div className="login-card">
          {/* Header Section */}
          <div className="login-header">
            <div className="logo-container">
              <div className="logo-icon">
                <Building2 size={32} />
              </div>
            </div>
            <h1 className="login-title">Payroll Management System</h1>
            <p className="login-subtitle">Secure access to your payroll portal</p>
          </div>

          {/* Form Section */}
          <div className="login-body">
            <form onSubmit={handleLogin} className="login-form">
              {/* Role Selection */}
              <div className="form-group">
                <label className="form-label">Select Your Role</label>
                <div className="role-buttons">
                  <button
                    type="button"
                    onClick={() => setRole('hr')}
                    className={`role-button ${role === 'hr' ? 'role-button-active' : ''}`}
                  >
                    <UserCheck size={20} />
                    <span>HR Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('employee')}
                    className={`role-button ${role === 'employee' ? 'role-button-active' : ''}`}
                  >
                    <Users size={20} />
                    <span>Employee</span>
                  </button>
                </div>
              </div>

              {/* Email Input */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox-input"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="forgot-link"
                >
                  Forgot password?
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="login-button"
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="login-footer">
              <p className="footer-text">
                Need help? Contact{' '}
                <button
                  type="button"
                  onClick={handleContactSupport}
                  className="support-link"
                >
                  IT Support
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="security-badge">
          <Lock size={16} />
          <span>Secured with 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
};

export default Login;