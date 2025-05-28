import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { supabase } from '../config/supabase';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user } = await authService.signIn(formData.email, formData.password);
      if (user) {
        // Check if freelancer profile exists
        const { data: profile, error: profileError } = await supabase
          .from('freelancer_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (profileError || !profile) {
          navigate('/complete-freelancer-profile');
        } else {
          navigate('/'); // or your dashboard
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="with-navbar-padding">
      <div className="login-container">
        <div className="login-bg">
          <div className="login-card">
            <h1 className="login-title">Sign In to YourPro</h1>
            {error && <div className="error-message">{error}</div>}
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="login-btn"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
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