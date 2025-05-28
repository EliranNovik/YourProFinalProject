import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import './CompanyRegistration.css';

interface FormData {
  companyName: string;
  industry: string;
  email: string;
  password: string;
  confirmPassword: string;
  location: string;
  description: string;
  specialties: string[];
  workTypes: string[];
}

const CompanyRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    industry: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    description: '',
    specialties: [],
    workTypes: []
  });

  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // First, create the user account
      const { user } = await authService.signUp(
        formData.email,
        formData.password,
        formData.companyName,
        'company'
      );

      if (user) {
        // Then create the company profile
        await authService.createCompanyProfile(user.id, {
          company_name: formData.companyName,
          industry: formData.industry,
          location: formData.location,
          description: formData.description,
          specialties: formData.specialties,
          work_types: formData.workTypes,
        });

        // Redirect to company dashboard
        navigate('/company-dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-registration with-navbar-padding">
      <h1>Register Your Company</h1>
      <p className="subtitle">Find the best talent for your projects</p>

      {error && <div className="error-message">{error}</div>}

      <div className="logo-upload-section">
        <div 
          className="logo-upload"
          onClick={handleImageClick}
        >
          {logoImage ? (
            <img src={logoImage} alt="Company Logo" className="logo-preview" />
          ) : (
            <div className="logo-placeholder">
              <span>Logo</span>
              <div className="edit-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15.2C13.7673 15.2 15.2 13.7673 15.2 12C15.2 10.2327 13.7673 8.8 12 8.8C10.2327 8.8 8.8 10.2327 8.8 12C8.8 13.7673 10.2327 15.2 12 15.2Z" fill="white"/>
                  <path d="M9 3L7.17 5H4C3.45 5 3 5.45 3 6V18C3 18.55 3.45 19 4 19H20C20.55 19 21 18.55 21 18V6C21 5.45 20.55 5 20 5H16.83L15 3H9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z" fill="white"/>
                </svg>
              </div>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>

      <form onSubmit={handleSubmit}>
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
            <label htmlFor="industry">Industry</label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
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
        </div>

        <div className="form-row">
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

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="e.g. New York, NY"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Company Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Tell us about your company..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <button 
          type="submit" 
          className="register-company-button"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register Company'}
        </button>
      </form>
    </div>
  );
};

export default CompanyRegistration; 