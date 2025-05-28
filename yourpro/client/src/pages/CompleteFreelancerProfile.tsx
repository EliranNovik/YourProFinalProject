import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { supabase } from '../config/supabase';

const CompleteFreelancerProfile: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    professionalTitle: '',
    education: '',
    languages: '',
    hourlyRate: '',
    packageRate: '',
    services: '',
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
      const user = await authService.getCurrentUser();
      if (!user) {
        setError('Not authenticated. Please log in again.');
        setLoading(false);
        return;
      }
      // Ensure user exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();
      if (!existingUser) {
        await supabase.from('users').insert([
          {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || '',
            role: 'freelancer',
          },
        ]);
      }
      // Insert freelancer profile
      const { error: insertError } = await supabase.from('freelancer_profiles').insert([
        {
          user_id: user.id,
          professional_title: formData.professionalTitle,
          education: formData.education,
          languages: formData.languages.split(',').map(l => l.trim()),
          hourly_rate: parseFloat(formData.hourlyRate),
          package_rate: parseFloat(formData.packageRate),
          services: formData.services.split(',').map(s => s.trim()),
        },
      ]);
      if (insertError) {
        setError(insertError.message);
      } else {
        navigate('/'); // or dashboard
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="freelancer-registration with-navbar-padding">
      <h1>Complete Your Freelancer Profile</h1>
      <p className="subtitle">Fill out your professional details to finish registration.</p>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="professionalTitle">Professional Title</label>
            <input
              type="text"
              id="professionalTitle"
              name="professionalTitle"
              value={formData.professionalTitle}
              onChange={handleChange}
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
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="languages">Languages (comma-separated)</label>
            <input
              type="text"
              id="languages"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="services">Services (comma-separated)</label>
            <input
              type="text"
              id="services"
              name="services"
              value={formData.services}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="hourlyRate">Hourly Rate ($)</label>
            <input
              type="number"
              id="hourlyRate"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="packageRate">Package Rate ($ per 5 hours)</label>
            <input
              type="number"
              id="packageRate"
              name="packageRate"
              value={formData.packageRate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button type="submit" className="create-profile-button" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default CompleteFreelancerProfile; 