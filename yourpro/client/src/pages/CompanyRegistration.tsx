import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import './CompanyRegistration.css';

const CompanyRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      const { session } = await authService.signUp(
        formData.email,
        formData.password,
        formData.companyName,
        'company'
      );
      setEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  // After login/confirmation, redirect to complete company profile
  React.useEffect(() => {
    const checkProfile = async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        // Optionally, check if company profile exists in DB before redirecting
        navigate('/complete-company-profile');
      }
    };
    if (emailSent) {
      checkProfile();
    }
  }, [emailSent, navigate]);

  return (
    <>
      <h1>Register Your Company</h1>
      <p className="subtitle">Find the best talent for your projects</p>
      {error && <div className="error-message">{error}</div>}
      {!emailSent ? (
        <form onSubmit={handleRegister}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Business Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="register-company-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register Company'}
          </button>
        </form>
      ) : (
        <div>
          <p>
            Please check your email and confirm your account before completing your company profile.
          </p>
        </div>
      )}
    </>
  );
};

export default CompanyRegistration; 