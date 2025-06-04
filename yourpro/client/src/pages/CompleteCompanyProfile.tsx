import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { supabase } from '../config/supabase';

const CompleteCompanyProfile: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    location: '',
    description: '',
    specialties: '', // comma-separated
    work_types: '', // comma-separated
    logo_url: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setFormData(prev => ({ ...prev, logo_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
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
            role: 'company',
          },
        ]);
      }
      // Insert company profile
      const { error: insertError } = await supabase.from('company_profiles').insert([
        {
          user_id: user.id,
          company_name: formData.company_name,
          industry: formData.industry,
          location: formData.location,
          description: formData.description,
          specialties: formData.specialties.split(',').map(s => s.trim()),
          work_types: formData.work_types.split(',').map(w => w.trim()),
          logo_url: formData.logo_url,
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
    <div className="company-registration with-navbar-padding">
      <h1>Complete Your Company Profile</h1>
      <p className="subtitle">Fill out your company details to finish registration.</p>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company_name">Company Name</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
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
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="specialties">Specialties (comma-separated)</label>
            <input
              type="text"
              id="specialties"
              name="specialties"
              value={formData.specialties}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="work_types">Work Types (comma-separated)</label>
            <input
              type="text"
              id="work_types"
              name="work_types"
              value={formData.work_types}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="logo_url">Company Logo</label>
            <input
              type="file"
              id="logo_url"
              name="logo_url"
              accept="image/*"
              onChange={handleLogoChange}
            />
            {logoPreview && (
              <img src={logoPreview} alt="Logo Preview" style={{ width: 80, height: 80, borderRadius: '50%', marginTop: 8 }} />
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ width: '100%' }}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 8, border: '2px solid #e1e1e1', fontSize: '1rem' }}
            />
          </div>
        </div>
        <button type="submit" className="register-company-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Complete Profile'}
        </button>
      </form>
    </div>
  );
};

export default CompleteCompanyProfile; 