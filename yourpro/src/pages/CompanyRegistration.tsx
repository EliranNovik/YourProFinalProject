import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Registration.css';

interface FormData {
  companyName: string;
  email: string;
  password: string;
  industry: string;
  companySize: string;
  description: string;
  location: string;
  website: string;
  logo: File | null;
}

const CompanyRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    email: '',
    password: '',
    industry: '',
    companySize: '',
    description: '',
    location: '',
    website: '',
    logo: null
  });
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'logo' && value) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      const response = await fetch('/api/companies/register', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      navigate(`/company/profile/${data.id}`);
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="registration-container">
      <h1>Company Registration</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="companyName">Company Name *</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="industry">Industry *</label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="companySize">Company Size *</label>
          <select
            id="companySize"
            name="companySize"
            value={formData.companySize}
            onChange={handleInputChange}
            required
          >
            <option value="">Select size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501+">501+ employees</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Company Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="logo">Company Logo</label>
          <input
            type="file"
            id="logo"
            name="logo"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <button type="submit" className="submit-button">Register</button>
      </form>
    </div>
  );
};

export default CompanyRegistration; 