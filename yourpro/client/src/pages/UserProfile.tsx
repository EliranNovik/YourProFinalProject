import React, { useState, useEffect } from 'react';
import './FreelancerProfile.css';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';

interface UserProfileData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  website?: string;
  avatar_url?: string;
  cover_image?: string;
  location?: string;
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

const UserAvatar: React.FC<{ avatar: string | undefined; name: string }> = ({ avatar, name }) => {
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
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const [coverPreview, setCoverPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) {
        setProfile(null);
      } else {
        setProfile(data);
        setAvatarPreview(data.avatar_url);
        setCoverPreview(data.cover_image);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found.</div>;

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
                        setProfile({ ...profile, cover_image: url });
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
                <UserAvatar avatar={avatarPreview} name={profile.full_name} />
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
                          setProfile({ ...profile, avatar_url: url });
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
                    value={profile.full_name}
                    onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                  />
                ) : (
                  <h1>{profile.full_name}</h1>
                )}
                <div className="profile-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {editOpen ? (
                    <input
                      className="edit-input main-location"
                      value={profile.location || ''}
                      onChange={e => setProfile({ ...profile, location: e.target.value })}
                    />
                  ) : (
                    <span>{profile.location}</span>
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
                        value={profile.email}
                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                      />
                    ) : (
                      <span>{profile.email}</span>
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
                        value={profile.phone || ''}
                        onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      />
                    ) : (
                      <span>{profile.phone}</span>
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
                        value={profile.website || ''}
                        onChange={e => setProfile({ ...profile, website: e.target.value })}
                      />
                    ) : (
                      <span>{profile.website}</span>
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