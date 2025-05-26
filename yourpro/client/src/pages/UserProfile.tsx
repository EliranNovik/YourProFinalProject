import React, { useState } from 'react';
import './FreelancerProfile.css';
import { MOCK_USER } from '../data/userData';

interface User {
  id: number;
  name: string;
  location: string;
  email: string;
  phone?: string;
  website?: string;
  avatar?: string;
  coverImage?: string;
}

// Helper to get initials from name
function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const UserAvatar: React.FC<{ avatar: string; name: string }> = ({ avatar, name }) => {
  const [avatarError, setAvatarError] = useState(false);
  if (avatarError || !avatar) {
    return <div className="profile-avatar-fallback">{getInitials(name)}</div>;
  }
  return (
    <img
      src={avatar}
      alt={name}
      className="profile-avatar"
      onError={() => setAvatarError(true)}
    />
  );
};

const UserProfile: React.FC = () => {
  const [editData, setEditData] = useState<User>(MOCK_USER);
  const [editOpen, setEditOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(MOCK_USER.avatar);
  const [coverPreview, setCoverPreview] = useState(MOCK_USER.coverImage);

  return (
    <div className="with-navbar-padding">
      <div className="user-profile-container">
        <div className="profile-container">
          <div className="profile-header" style={{ position: 'relative' }}>
            <div
              className="profile-cover"
              style={coverPreview ? { backgroundImage: `url(${coverPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: '#e6e9ff', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              {editOpen && (
                <label className="upload-cover-label-centered">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setCoverPreview(url);
                        setEditData({ ...editData, coverImage: url });
                      }
                    }}
                  />
                  <span className="upload-btn">Change Cover</span>
                </label>
              )}
            </div>
            {!editOpen && (
              <button
                className="edit-profile-btn"
                onClick={() => setEditOpen(true)}
                style={{ position: 'absolute', left: 'calc(50% - 580px)', top: '220px', transform: 'translateY(-50%)', zIndex: 5 }}
              >
                Edit Profile
              </button>
            )}
            <div className="profile-main-info">
              <div style={{ position: 'relative' }}>
                <UserAvatar avatar={avatarPreview || ''} name={editData.name} />
                {editOpen && (
                  <label className="upload-avatar-label">
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setAvatarPreview(url);
                          setEditData({ ...editData, avatar: url });
                        }
                      }}
                    />
                    <span className="upload-btn">Change Photo</span>
                  </label>
                )}
              </div>
              <div className="profile-title-section">
                {editOpen ? (
                  <input
                    className="edit-input main-name"
                    value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                  />
                ) : (
                  <h1>{editData.name}</h1>
                )}
                <div className="profile-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {editOpen ? (
                    <input
                      className="edit-input main-location"
                      value={editData.location}
                      onChange={e => setEditData({ ...editData, location: e.target.value })}
                    />
                  ) : (
                    <span>{editData.location}</span>
                  )}
                </div>
              </div>
              <div className="profile-actions">
                {editOpen ? (
                  <>
                    <button className="save-profile-btn" onClick={() => setEditOpen(false)}>Save</button>
                    <button className="cancel-profile-btn" onClick={() => setEditOpen(false)}>Cancel</button>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-main">
              <section className="contact-section">
                <h3>Contact Information</h3>
                <div className="contact-list">
                  <div className="contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13" />
                      <path d="M22 2L15 22l-4-9l-9-4l22-7z" />
                    </svg>
                    {editOpen ? (
                      <input
                        className="section-edit-input"
                        type="email"
                        value={editData.email}
                        onChange={e => setEditData({ ...editData, email: e.target.value })}
                      />
                    ) : (
                      <span>{editData.email}</span>
                    )}
                  </div>
                  <div className="contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    {editOpen ? (
                      <input
                        className="section-edit-input"
                        type="tel"
                        value={editData.phone}
                        onChange={e => setEditData({ ...editData, phone: e.target.value })}
                      />
                    ) : (
                      <span>{editData.phone}</span>
                    )}
                  </div>
                  <div className="contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                    </svg>
                    {editOpen ? (
                      <input
                        className="section-edit-input"
                        type="url"
                        value={editData.website}
                        onChange={e => setEditData({ ...editData, website: e.target.value })}
                      />
                    ) : (
                      <span>{editData.website}</span>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div style={{ marginTop: '2rem' }}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 