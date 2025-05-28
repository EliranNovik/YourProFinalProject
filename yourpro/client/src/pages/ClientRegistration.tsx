import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import './ClientRegistration.css';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  location: string;
  interests: string[];
}

const ClientRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    location: '',
    interests: []
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleRegister = async (e: React.FormEvent) => {
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
      const { user, session } = await authService.signUp(
        formData.email,
        formData.password,
        formData.fullName,
        'client'
      );

      if (!session) {
        setEmailSent(true);
        setLoading(false);
        return;
      }

      if (user) {
        await handleProfileInsert(user.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      setLoading(false);
    }
  };

  const handleProfileInsert = async (userId: string) => {
    try {
      await authService.createClientProfile(userId, {
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        location: formData.location,
        interests: formData.interests,
      });
      navigate('/'); // or wherever you want
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving profile');
    }
  };

  const handleCompleteProfile = async () => {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        await handleProfileInsert(user.id);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-registration with-navbar-padding">
      <h1>Join as a Client</h1>
      <p className="subtitle">Find the perfect professional for your needs</p>

      {error && <div className="error-message">{error}</div>}

      {!emailSent ? (
        <>
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

          <form onSubmit={handleRegister}>
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
                />
              </div>
            </div>

            <div className="form-row">
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
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

            <button 
              type="submit" 
              className="register-client-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register as Client'}
            </button>
          </form>
        </>
      ) : (
        <div>
          <p>
            Please check your email and confirm your account before completing your profile.
          </p>
          <button onClick={handleCompleteProfile} disabled={loading} className="register-client-button">
            {loading ? 'Submitting Profile...' : 'Complete Profile'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientRegistration; 