import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Registration.css';

interface FormData {
  name: string;
  email: string;
  password: string;
  title: string;
  skills: string[];
  languages: string[];
  education: string;
  location: string;
  description: string;
  aboutMe: string;
  hourlyRate: string;
  packageRate: string;
  profileImage: File | null;
}

const FreelancerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    title: '',
    skills: [],
    languages: [],
    education: '',
    location: '',
    description: '',
    aboutMe: '',
    hourlyRate: '',
    packageRate: '',
    profileImage: null
  });
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev: FormData) => ({ ...prev, profileImage: e.target.files![0] }));
    }
  };

  const handleArrayInput = (e: React.ChangeEvent<HTMLInputElement>, field: 'skills' | 'languages') => {
    const values = e.target.value.split(',').map((item: string) => item.trim());
    setFormData((prev: FormData) => ({ ...prev, [field]: values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'skills' || key === 'languages') {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (key === 'profileImage' && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== null) {
          formDataToSend.append(key, String(value));
        }
      });

      const response = await fetch('/api/freelancers/register', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      navigate(`/freelancer/profile/${data.id}`);
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="registration-container">
      <h1>Freelancer Registration</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
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
          <label htmlFor="title">Professional Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="skills">Skills (comma-separated) *</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills.join(', ')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleArrayInput(e, 'skills')}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="languages">Languages (comma-separated) *</label>
          <input
            type="text"
            id="languages"
            name="languages"
            value={formData.languages.join(', ')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleArrayInput(e, 'languages')}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="education">Education</label>
          <input
            type="text"
            id="education"
            name="education"
            value={formData.education}
            onChange={handleInputChange}
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
          <label htmlFor="description">Professional Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="aboutMe">About Me</label>
          <textarea
            id="aboutMe"
            name="aboutMe"
            value={formData.aboutMe}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="hourlyRate">Hourly Rate ($)</label>
          <input
            type="number"
            id="hourlyRate"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="packageRate">Package Rate ($)</label>
          <input
            type="number"
            id="packageRate"
            name="packageRate"
            value={formData.packageRate}
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="profileImage">Profile Image</label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <button type="submit" className="submit-button">Register</button>
      </form>
    </div>
  );
};

export default FreelancerRegistration; 