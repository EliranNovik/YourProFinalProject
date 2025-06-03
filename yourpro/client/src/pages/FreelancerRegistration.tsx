import React, { useState } from 'react';
import { authService } from '../services/auth';
import './FreelancerRegistration.css';

const FreelancerRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
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
    try {
      const { session } = await authService.signUp(
        formData.email,
        formData.password,
        formData.fullName,
        'freelancer'
      );
      setEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="freelancer-registration with-navbar-padding">
      <h1>Join as a Freelancer</h1>
      <p className="subtitle">Register with your email and password. You will be asked to complete your profile after confirming your email and logging in.</p>
      {error && <div className="error-message">{error}</div>}
      {!emailSent ? (
        <form onSubmit={handleRegister} className="freelancer-registration-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
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
                placeholder="Create a password"
              />
            </div>
          </div>
          <button type="submit" className="create-profile-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      ) : (
        <div>
          <p>Please check your email and confirm your account to continue.</p>
        </div>
      )}
    </div>
  );
};

export default FreelancerRegistration; 