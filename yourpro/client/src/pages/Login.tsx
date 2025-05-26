import React from 'react';
import './Login.css';

const Login: React.FC = () => {
  return (
    <div className="with-navbar-padding">
      <div className="login-container">
        <div className="login-bg">
          <div className="login-card">
            <h1 className="login-title">Sign In to YourPro</h1>
            <form className="login-form">
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="Enter your email" required />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="Enter your password" required />
              </div>
              <button type="submit" className="login-btn">Login</button>
            </form>
            <div className="login-footer">
              <span>Don't have an account?</span>
              <a href="/register" className="register-link">Register</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 