import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import './FreelancerRegistration.css';

const FreelancerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    professionalTitle: '',
    email: '',
    password: '',
    education: '',
    languages: '',
    hourlyRate: '',
    packageRate: '',
  });

  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setProfileImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddService = () => {
    if (newService.trim()) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // First, create the user account
      const { user } = await authService.signUp(
        formData.email,
        formData.password,
        formData.fullName,
        'freelancer'
      );

      if (user) {
        // Then create the freelancer profile
        await authService.createFreelancerProfile(user.id, {
          professional_title: formData.professionalTitle,
          education: formData.education,
          languages: formData.languages.split(',').map(lang => lang.trim()),
          hourly_rate: parseFloat(formData.hourlyRate),
          package_rate: parseFloat(formData.packageRate),
          services: services,
        });

        // Redirect to freelancer dashboard
        navigate('/freelancer-dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component remains the same...
  return (
    <div className="freelancer-registration with-navbar-padding">
      <h1>Join as a Freelancer</h1>
      <p className="subtitle">Create your professional profile and start finding great opportunities</p>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-photo-section">
        <div 
          className="profile-photo-upload"
          onClick={handleImageClick}
        >
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-preview" />
          ) : (
            <div className="photo-placeholder">
              <span>Photo</span>
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
        {/* Rest of your form remains the same... */}
        <button 
          type="submit" 
          className="create-profile-button"
          disabled={loading}
        >
          {loading ? 'Creating Profile...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

export default FreelancerRegistration; 