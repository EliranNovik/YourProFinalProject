import React, { useState, useRef } from 'react';
import './FreelancerRegistration.css';

const FreelancerRegistration: React.FC = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, services });
  };

  return (
    <div className="freelancer-registration with-navbar-padding">
      <h1>Join as a Freelancer</h1>
      <p className="subtitle">Create your professional profile and start finding great opportunities</p>

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
            <label htmlFor="professionalTitle">Professional Title</label>
            <input
              type="text"
              id="professionalTitle"
              name="professionalTitle"
              placeholder="e.g. Personal Coach"
              value={formData.professionalTitle}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
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
            <label htmlFor="education">Education</label>
            <input
              type="text"
              id="education"
              name="education"
              placeholder="e.g. MBA in Psychology"
              value={formData.education}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="languages">Languages (comma-separated)</label>
            <input
              type="text"
              id="languages"
              name="languages"
              placeholder="e.g. EN, ES, FR"
              value={formData.languages}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="services-section">
          <label>Services Offered</label>
          <div className="services-input">
            <input
              type="text"
              placeholder="Add a new service"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
            />
            <button type="button" onClick={handleAddService} className="add-button">
              Add
            </button>
          </div>
          {services.length > 0 && (
            <div className="services-list">
              {services.map((service, index) => (
                <div key={index} className="service-tag">{service}</div>
              ))}
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="hourlyRate">Hourly Rate ($)</label>
            <input
              type="number"
              id="hourlyRate"
              name="hourlyRate"
              placeholder="e.g. 50"
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
              placeholder="e.g. 220"
              value={formData.packageRate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="create-profile-button">
          Create Profile
        </button>
      </form>
    </div>
  );
};

export default FreelancerRegistration; 