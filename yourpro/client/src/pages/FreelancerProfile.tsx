import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FreelancerProfile.css';
import { Card, CardContent, CardActions, Typography, Button, Grid, Box, Chip, Divider, List, ListItem, ListItemIcon, ListItemText, Paper, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField, Modal, Avatar, MenuItem } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BarChartIcon from '@mui/icons-material/BarChart';
import DiamondIcon from '@mui/icons-material/Diamond';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TimelineIcon from '@mui/icons-material/Timeline';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ListAltIcon from '@mui/icons-material/ListAlt';
import NotesIcon from '@mui/icons-material/Notes';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { supabase } from '../config/supabase';

// Import the FREELANCERS array from Freelancers.tsx
import { Freelancer, FREELANCERS, ServicePackage } from './Freelancers';

interface Project {
  name: string;
  description: string;
  technologies: string[];
  year: string;
}

interface PortfolioImage {
  url: string;
  title: string;
  description: string;
  link?: string;
}

// Helper for generating time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let h = 8; h <= 20; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    slots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  return slots;
};
const TIME_SLOTS = generateTimeSlots();

const FreelancerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dbFreelancer, setDbFreelancer] = useState<Freelancer | null>(null);

  // Find the freelancer based on the ID from the URL
  const freelancer = FREELANCERS.find((f: Freelancer) => String(f.id) === String(id));

  // Helper to map DB freelancer to mock Freelancer shape
  function mapDbFreelancerToMock(f: any): Freelancer {
    let skills: string[] = [];
    if (Array.isArray(f.skills)) {
      skills = f.skills;
    } else if (typeof f.skills === 'string') {
      skills = (f.skills as string).split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    let languages: string[] = [];
    if (Array.isArray(f.languages)) {
      languages = f.languages;
    } else if (typeof f.languages === 'string') {
      languages = (f.languages as string).split(',').map((l: string) => l.trim()).filter(Boolean);
    }
    // Default packages for DB freelancers
    const defaultPackages: ServicePackage[] = [
      {
        id: 'basic',
        name: 'Basic',
        description: 'A basic package for small projects',
        price: 50,
        timeline: '1-2 weeks',
        features: ['Feature 1', 'Feature 2']
      },
      {
        id: 'pro',
        name: 'Pro',
        description: 'A comprehensive package for medium-sized projects',
        price: 100,
        timeline: '2-4 weeks',
        features: ['Feature 3', 'Feature 4']
      },
      {
        id: 'premium',
        name: 'Premium',
        description: 'A premium package for large-scale projects',
        price: 150,
        timeline: '4-6 weeks',
        features: ['Feature 5', 'Feature 6']
      }
    ];
    return {
      id: String(f.user_id),
      name: f.full_name,
      title: f.professional_title || '',
      location: f.location || '',
      skills,
      avatar: f.avatar_url || '/default-avatar.png',
      rating: 4.8,
      reviewCount: 0,
      availableHours: 10,
      hourlyRate: '$50',
      packages: defaultPackages,
      about: '',
      languages,
      education: typeof f.education === 'string' && f.education ? [{ degree: f.education, school: '', year: '' }] : [],
      certifications: [],
      recentProjects: [],
      portfolioImages: [],
      coverImage: '',
      email: '',
      portfolio: '',
      yearsExperience: 1,
    };
  }

  useEffect(() => {
    if (!freelancer && id) {
      setLoading(true);
      supabase.from('freelancer_profiles').select('*').eq('user_id', id).single().then(({ data }) => {
        if (data) {
          setDbFreelancer(mapDbFreelancerToMock(data));
        }
        setLoading(false);
      });
    }
  }, [freelancer, id]);

  const profile = freelancer || dbFreelancer;
  // Calculate package price (5-hour package with 10% discount)
  const hourlyRate = profile ? parseInt(profile.hourlyRate.replace('$', '')) : 0;
  const packageHours = 5;
  const packageDiscount = 0.10; // 10% discount
  const packagePrice = hourlyRate * packageHours * (1 - packageDiscount);

  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [editOpen, setEditOpen] = useState(false);
  // Only allow editing for mock freelancers (not DB freelancers)
  const isMockFreelancer = !!freelancer;
  const [editData, setEditData] = useState<Freelancer>(profile ? { ...profile } : ({} as Freelancer));
  const [avatarPreview, setAvatarPreview] = useState(profile ? profile.avatar : '');
  const [coverPreview, setCoverPreview] = useState(profile && profile.coverImage ? profile.coverImage : '/default.jpg');
  // Portfolio editing state
  const [portfolioEdit, setPortfolioEdit] = useState<PortfolioImage[]>(editData.portfolioImages ? editData.portfolioImages.map(item => ({ ...item, link: item.link || '' })) : []);

  // Inline edit state for other sections
  const [languagesEdit, setLanguagesEdit] = useState<string[]>(editData.languages || []);
  const [educationEdit, setEducationEdit] = useState(editData.education || []);
  const [certificationsEdit, setCertificationsEdit] = useState(editData.certifications || []);
  const [projectsEdit, setProjectsEdit] = useState(editData.recentProjects || []);
  const [hourlyRateEdit, setHourlyRateEdit] = useState(editData.hourlyRate || '');
  const [emailEdit, setEmailEdit] = useState(editData.email || '');
  const [portfolioEditField, setPortfolioEditField] = useState(editData.portfolio || '');

  // Calendar helpers
  const today = new Date();
  const daysInMonth = (month: Date) => new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = (month: Date) => new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const isToday = (date: Date) => date.toDateString() === today.toDateString();
  const isSelected = (date: Date) => selectedDate && date.toDateString() === new Date(selectedDate).toDateString();

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(calendarMonth);
    const startDay = firstDayOfWeek(calendarMonth);
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), d);
      const disabled = date < today;
      days.push(
        <button
          key={d}
          className={`calendar-day${isToday(date) ? ' today' : ''}${isSelected(date) ? ' selected' : ''}`}
          disabled={disabled}
          onClick={() => setSelectedDate(date)}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  // When entering edit mode, sync portfolioEdit with editData
  useEffect(() => {
    if (editOpen && isMockFreelancer) {
      setLanguagesEdit(editData.languages || []);
      setEducationEdit(editData.education || []);
      setCertificationsEdit(editData.certifications || []);
      setProjectsEdit(editData.recentProjects || []);
      setHourlyRateEdit(editData.hourlyRate || '');
      setPortfolioEdit(editData.portfolioImages?.map(item => ({ ...item, link: item.link || '' })) || []);
      setEmailEdit(editData.email || '');
      setPortfolioEditField(editData.portfolio || '');
    }
  }, [editOpen, editData, isMockFreelancer]);

  const [newSkill, setNewSkill] = useState('');
  const [newTechs, setNewTechs] = useState<string[]>(projectsEdit.map(() => ''));

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [projectNotes, setProjectNotes] = useState('');

  const [newFeatureInputs, setNewFeatureInputs] = useState<{ [key: string]: string }>({});

  const handleBuyNow = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedPackage || !selectedDate || !selectedTime) return;
    const booking = {
      id: Date.now(),
      type: 'freelancer',
      targetId: profile?.id,
      targetName: profile?.name,
      package: selectedPackage,
      date: selectedDate.toISOString ? selectedDate.toISOString() : selectedDate,
      time: selectedTime,
      notes: projectNotes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existing, booking]));
    setBookingModalOpen(false);
    setThankYouOpen(true);
    setBookingStep(1);
    setProjectNotes('');
  };

  if (loading || !profile) {
    return <div style={{ textAlign: 'center', marginTop: 60 }}>Loading profile...</div>;
  }

  return (
    <div className="with-navbar-padding">
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: { xs: 1, md: 4 } }}>
        <div className={`profile-container${editOpen ? ' edit-mode' : ''}`}>
          <div className="profile-header">
            <div
              className="profile-cover"
              style={coverPreview ? { backgroundImage: `url(${coverPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundImage: 'url(/random.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
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
            <div className="profile-main-info">
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <img src={avatarPreview} alt={editData.name} className="profile-avatar" />
                  {!editOpen && isMockFreelancer && (
                    <button className="edit-profile-btn" onClick={() => setEditOpen(true)}>
                      Edit Profile
                    </button>
                  )}
                </div>
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
                <div className="profile-review-stars">
                  <span className="stars">
                    {[1,2,3,4,5].map((n) => (
                      <svg
                        key={n}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill={n <= 4 ? '#FBBF24' : '#E5E7EB'}
                        stroke="#FBBF24"
                        style={{ marginRight: 2 }}
                      >
                        <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                      </svg>
                    ))}
                    <span className="rating-value">4.8</span>
                  </span>
                  <span className="review-count">(32 reviews)</span>
                </div>
                {editOpen ? (
                  <input
                    className="edit-input main-title"
                    value={editData.title}
                    onChange={e => setEditData({ ...editData, title: e.target.value })}
                  />
                ) : (
                  <h2>{editData.title}</h2>
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
                    <span>{profile.location}</span>
                  )}
                </div>
              </div>
              <div className="profile-quick-info">
                <div className="info-badge">
                  <span className="label">Experience</span>
                  <span className="value">{profile.yearsExperience} years</span>
                </div>
                <div className="info-badge">
                  <span className="label">Availability</span>
                  <span className="value">{profile.availableHours}h/week</span>
                </div>
              </div>
              <div className="profile-actions">
                {editOpen ? (
                  <>
                    <button className="save-profile-btn" onClick={() => {
                      setEditData({
                        ...editData,
                        portfolioImages: portfolioEdit,
                        languages: languagesEdit,
                        education: educationEdit,
                        certifications: certificationsEdit,
                        recentProjects: projectsEdit,
                        hourlyRate: hourlyRateEdit,
                        email: emailEdit,
                        portfolio: portfolioEditField
                      });
                      setEditOpen(false);
                    }}>
                      Save
                    </button>
                    <button className="cancel-profile-btn" onClick={() => { setEditData({ ...profile }); setAvatarPreview(profile.avatar); setCoverPreview(profile.coverImage || ''); setEditOpen(false); }}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="book-profile-btn" onClick={() => setShowBooking(true)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                      </svg>
                      Book Me
                    </button>
                    <button className="message-profile-btn" onClick={() => navigate(`/message/freelancer/${profile.id}`)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                      </svg>
                      Message Me
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* About Me (full width) */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, background: '#fff', borderRadius: 4, boxShadow: 2, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>About Me</Typography>
            <Typography variant="body1" sx={{ color: '#222', fontSize: 17, textAlign: 'center' }}>{profile.about}</Typography>
          </Paper>
          {/* Languages, Education, Skills in a row */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, background: '#fff', borderRadius: 4, boxShadow: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>Languages</Typography>
                {(profile.languages || []).map((lang, idx) => (
                  <Typography key={idx} sx={{ color: '#222', fontSize: 16, mb: 1, textAlign: 'center' }}>{lang}</Typography>
                ))}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, background: '#fff', borderRadius: 4, boxShadow: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>Education</Typography>
                {(profile.education || []).map((edu, idx) => (
                  <Box key={idx} sx={{ mb: 2, textAlign: 'center' }}>
                    <Typography sx={{ color: '#222', fontWeight: 600 }}>{edu.degree}</Typography>
                    <Typography sx={{ color: '#2563eb', fontSize: 15 }}>{edu.school}</Typography>
                    <Typography sx={{ color: '#888', fontSize: 14 }}>{edu.year}</Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, background: '#fff', borderRadius: 4, boxShadow: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>Skills</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                  {(profile.skills || []).map((skill, idx) => (
                    <Chip key={idx} label={skill} sx={{ fontWeight: 600, fontSize: 16, background: '#dcfce7', color: '#059669', px: 2, py: 1, borderRadius: 2 }} />
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
          {/* Packages Section (full width) */}
          <section className="packages-section" style={{ marginBottom: 40 }}>
            <h3 style={{ textAlign: 'center', fontWeight: 700, fontSize: 26, marginBottom: 24 }}></h3>
            <Button variant="outlined" startIcon={<EditIcon />} sx={{ mb: 2 }} onClick={() => setEditOpen(!editOpen)}>
              {editOpen ? 'Cancel Edit' : 'Edit Packages'}
            </Button>
            <Grid container spacing={4} justifyContent="center" sx={{ mb: 6, mt: 5 }}>
              {(editOpen ? (editData.packages || []) : (profile.packages || [])).map((pkg: any, idx: number) => (
                <Grid item xs={12} md={4} key={pkg.id}>
                  <Card sx={{
                    borderRadius: 4,
                    boxShadow: 3,
                    p: 0,
                    minHeight: 420,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: '#fff',
                    position: 'relative',
                    overflow: 'visible',
                    width: '100%',
                    maxWidth: 420,
                  }}>
                    {/* Title Container */}
                    <Box
                      sx={{
                        width: '80%',
                        mx: 'auto',
                        mt: -4,
                        mb: 2,
                        p: 2,
                        background:
                          pkg.name === 'Basic'
                            ? '#D1FAE5'
                            : pkg.name === 'Pro'
                            ? '#DBEAFE'
                            : '#EDE9FE',
                        borderRadius: 3,
                        boxShadow: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 2,
                      }}
                    >
                      {editOpen ? (
                        <TextField
                          value={pkg.name}
                          onChange={e => {
                            const updated = [...editData.packages];
                            updated[idx].name = e.target.value as 'Basic' | 'Pro' | 'Premium';
                            setEditData({ ...editData, packages: updated });
                          }}
                          label="Package Name"
                          variant="standard"
                          sx={{ fontWeight: 900, letterSpacing: 1, color: '#2563eb', fontSize: 28, textAlign: 'center' }}
                        />
                      ) : (
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>{pkg.name?.toUpperCase()}</Typography>
                      )}
                      <Typography variant="caption" sx={{ color: '#888', fontWeight: 600, letterSpacing: 1, fontSize: 14 }}>
                        PACKAGE
                      </Typography>
                    </Box>
                    <CardContent sx={{ width: '100%', textAlign: 'center', p: 3, pt: 0 }}>
                      <Divider sx={{ mb: 2, mx: 'auto', width: '60%' }} />
                      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 0 }}>
                          {editOpen ? (
                            <TextField
                              value={pkg.price}
                              onChange={e => {
                                const updated = [...editData.packages];
                                updated[idx].price = Number(e.target.value);
                                setEditData({ ...editData, packages: updated });
                              }}
                              label="Price"
                              variant="standard"
                              sx={{ fontWeight: 900, color: '#181c2a', fontSize: 64, lineHeight: 1, mb: 0, textAlign: 'center' }}
                            />
                          ) : (
                            <Typography variant="h2" sx={{ fontWeight: 900, color: '#181c2a', fontSize: 64, lineHeight: 1, mb: 0 }}>
                              ${pkg.price}
                            </Typography>
                          )}
                          {editOpen ? (
                            <TextField
                              value={pkg.timeline}
                              onChange={e => {
                                const updated = [...editData.packages];
                                updated[idx].timeline = e.target.value;
                                setEditData({ ...editData, packages: updated });
                              }}
                              label="Timeline"
                              variant="standard"
                              sx={{ color: '#222', fontWeight: 600, fontSize: 18, alignSelf: 'flex-end', mt: 0.5, textAlign: 'center' }}
                            />
                          ) : (
                            <Typography variant="subtitle2" sx={{ color: '#222', fontWeight: 600, fontSize: 18, alignSelf: 'flex-end', mt: 0.5 }}>
                              / {pkg.timeline?.replace('weeks', 'wk').replace('months', 'mo')}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      {/* Package Description */}
                      {editOpen ? (
                        <TextField
                          value={pkg.description}
                          onChange={e => {
                            const updated = [...editData.packages];
                            updated[idx].description = e.target.value;
                            setEditData({ ...editData, packages: updated });
                          }}
                          label="Description"
                          variant="standard"
                          fullWidth
                          sx={{ color: '#444', mb: 2, fontWeight: 500, fontSize: 17, minHeight: 40, textAlign: 'center' }}
                        />
                      ) : (
                        <Box sx={{ background: '#f5f7fa', borderRadius: 2, p: 2, my: 2 }}>
                          <Typography variant="body2" sx={{ color: '#444', fontSize: 16, lineHeight: 1.6, textAlign: 'center' }}>
                            {pkg.description}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ mb: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {(pkg.features || []).map((feature: string, i: number) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', width: '80%', mb: 0.5, justifyContent: 'flex-start' }}>
                            {editOpen ? (
                              <>
                                <TextField
                                  value={feature}
                                  onChange={e => {
                                    const updated = [...editData.packages];
                                    updated[idx].features[i] = e.target.value;
                                    setEditData({ ...editData, packages: updated });
                                  }}
                                  size="small"
                                  sx={{ mr: 1, width: '80%' }}
                                />
                                <IconButton onClick={() => {
                                  const updated = [...editData.packages];
                                  updated[idx].features.splice(i, 1);
                                  setEditData({ ...editData, packages: updated });
                                }} size="small"><CancelIcon sx={{ color: '#e74c3c' }} /></IconButton>
                              </>
                            ) : (
                              <>
                                <CheckCircleIcon sx={{ color: '#43b96e', mr: 1, fontSize: 22 }} />
                                <Typography sx={{ color: '#222', fontWeight: 500, fontSize: 18, textAlign: 'left' }}>{feature}</Typography>
                              </>
                            )}
                          </Box>
                        ))}
                        {editOpen && (
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '80%', mt: 1 }}>
                            <TextField
                              value={newFeatureInputs[pkg.id] || ''}
                              onChange={e => setNewFeatureInputs({ ...newFeatureInputs, [pkg.id]: e.target.value })}
                              size="small"
                              placeholder="Add feature"
                              sx={{ mr: 1, width: '80%' }}
                              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if ((e.key === 'Enter' || e.key === ',') && (newFeatureInputs[pkg.id] || '').trim()) {
                                  e.preventDefault();
                                  const updated = [...editData.packages];
                                  if (!updated[idx].features.includes(newFeatureInputs[pkg.id].trim())) {
                                    updated[idx].features.push(newFeatureInputs[pkg.id].trim());
                                  }
                                  setNewFeatureInputs({ ...newFeatureInputs, [pkg.id]: '' });
                                  setEditData({ ...editData, packages: updated });
                                }
                              }}
                            />
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                if ((newFeatureInputs[pkg.id] || '').trim()) {
                                  const updated = [...editData.packages];
                                  if (!updated[idx].features.includes(newFeatureInputs[pkg.id].trim())) {
                                    updated[idx].features.push(newFeatureInputs[pkg.id].trim());
                                  }
                                  setNewFeatureInputs({ ...newFeatureInputs, [pkg.id]: '' });
                                  setEditData({ ...editData, packages: updated });
                                }
                              }}
                            >Add</Button>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ width: '100%', justifyContent: 'center', pb: 3 }}>
                      {editOpen ? (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            const updated = [...editData.packages];
                            updated.splice(idx, 1);
                            setEditData({ ...editData, packages: updated });
                          }}
                        >Remove Package</Button>
                      ) : (
                        <Button
                          variant="contained"
                          sx={{
                            background: 'linear-gradient(90deg, #00c6fb 0%, #005bea 100%)',
                            color: '#fff',
                            borderRadius: 99,
                            px: 4,
                            py: 1.2,
                            fontWeight: 700,
                            fontSize: 18,
                            boxShadow: 2,
                            textTransform: 'none',
                            '&:hover': {
                              background: 'linear-gradient(90deg, #00c6fb 0%, #005bea 100%)',
                              opacity: 0.9,
                            },
                          }}
                          onClick={() => handleBuyNow(pkg)}
                        >Buy Now</Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              {editOpen && (
                <Grid item xs={12} md={4}>
                  <Card sx={{ border: '2px dashed #bbb', borderRadius: 4, boxShadow: 0, p: 3, minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', cursor: 'pointer' }} onClick={() => {
                    const packageTypes = ['Basic', 'Pro', 'Premium'] as const;
                    const nextType: 'Basic' | 'Pro' | 'Premium' = packageTypes[editData.packages.length % 3];
                    setEditData({ ...editData, packages: [...editData.packages, { id: Date.now().toString(), name: nextType, description: '', price: 0, timeline: '', features: [] }] });
                  }}>
                    <Typography variant="h6" sx={{ color: '#2563eb', fontWeight: 700 }}>+ Add Package</Typography>
                  </Card>
                </Grid>
              )}
            </Grid>
          </section>
          {/* Portfolio Section (full width) */}
          <Paper elevation={2} sx={{ p: 3, mb: 5, background: '#fff', borderRadius: 4, boxShadow: 2, maxWidth: 1200, mx: 'auto' }}>
            <section className="portfolio-section">
              <h3 style={{ textAlign: 'center', fontWeight: 700, fontSize: 26, marginBottom: 24 }}>Portfolio</h3>
              {editOpen ? (
                <div className="portfolio-edit-grid">
                  {(portfolioEdit || []).map((item, index) => (
                    <div className="portfolio-edit-card" key={index}>
                      <div style={{ position: 'relative', width: '100%' }}>
                        <img src={item.url} alt={item.title} />
                        <label className="upload-btn" style={{ position: 'absolute', top: 8, right: 8, padding: '4px 10px', fontSize: '0.95rem' }}>
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/><polyline points="7 9 12 4 17 9"/><line x1="12" y1="4" x2="12" y2="16"/></svg>
                          Change
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              const updated = [...portfolioEdit];
                              updated[index] = { ...updated[index], url };
                              setPortfolioEdit(updated);
                            }
                          }} />
                        </label>
                      </div>
                      <div className="edit-input-label">Title</div>
                      <input
                        className="edit-input"
                        placeholder="Title"
                        value={item.title}
                        onChange={e => {
                          const updated = [...portfolioEdit];
                          updated[index].title = e.target.value;
                          setPortfolioEdit(updated);
                        }}
                      />
                      <div className="edit-input-label">Description</div>
                      <textarea
                        className="edit-input"
                        placeholder="Description"
                        value={item.description}
                        onChange={e => {
                          const updated = [...portfolioEdit];
                          updated[index].description = e.target.value;
                          setPortfolioEdit(updated);
                        }}
                      />
                      <div className="edit-input-label">Link</div>
                      <input
                        className="edit-input"
                        placeholder="Link (optional)"
                        value={item.link || ''}
                        onChange={e => {
                          const updated = [...portfolioEdit];
                          updated[index].link = e.target.value;
                          setPortfolioEdit(updated);
                        }}
                      />
                      <div className="portfolio-edit-actions">
                        <button className="portfolio-edit-remove" onClick={() => {
                          setPortfolioEdit(portfolioEdit.filter((_, i) => i !== index));
                        }}>Remove</button>
                      </div>
                    </div>
                  ))}
                  <button className="portfolio-edit-add" onClick={() => {
                    setPortfolioEdit([
                      ...portfolioEdit,
                      { url: '', title: '', description: '', link: '' }
                    ]);
                  }}>+ Add Portfolio Item</button>
                </div>
              ) : (
                <div className="portfolio-grid">
                  {(editData.portfolioImages || []).map((image: PortfolioImage, index: number) => (
                    <div key={index} className="portfolio-item">
                      <img src={image.url} alt={image.title} />
                      <div className="portfolio-item-overlay">
                        <h4>{image.title}</h4>
                        <p>{image.description}</p>
                        {image.link && <a href={image.link} target="_blank" rel="noopener noreferrer">View Work</a>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </Paper>
        </div>

        {showBooking && (
          <div className="booking-modal-overlay" onClick={() => setShowBooking(false)}>
            <div className="booking-modal" onClick={e => e.stopPropagation()}>
              <h3>Book {profile.name}</h3>
              <div className="calendar-container">
                <div className="calendar-header">
                  <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}>&lt;</button>
                  <span>{calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                  <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}>&gt;</button>
                </div>
                <div className="calendar-grid">
                  {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} className="calendar-day-label">{d}</div>)}
                  {renderCalendar()}
                </div>
              </div>
              <div className="time-picker-container">
                <label>Time:
                  <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)}>
                    <option value="">Select time</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>
              </div>
              <div style={{marginTop: '1rem'}}>
                <button onClick={() => {/* handle book for now */}}>Book for Now</button>
                <button onClick={() => {/* handle confirm booking */}}>Confirm Booking</button>
                <button onClick={() => setShowBooking(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <Modal
          open={bookingModalOpen}
          onClose={() => { setBookingModalOpen(false); setBookingStep(1); setProjectNotes(''); }}
          aria-labelledby="booking-modal-title"
        >
          <Box className="booking-modal" sx={{ p: 0, borderRadius: 4, boxShadow: 8, maxWidth: 480, width: '95vw', overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(24px)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #f0f0f0', bgcolor: 'rgba(37,99,235,0.07)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: '#2563eb', color: '#fff', fontWeight: 700 }}>
                  {profile.name[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2563eb' }}>{selectedPackage?.name} Package</Typography>
                  <Typography variant="body2" sx={{ color: '#374151' }}>{profile.name}</Typography>
                </Box>
              </Box>
              <IconButton onClick={() => { setBookingModalOpen(false); setBookingStep(1); setProjectNotes(''); }}>
                <CloseIcon />
              </IconButton>
            </Box>
            {/* Step Indicator */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 2 }}>
              <Box sx={{ width: 32, height: 6, borderRadius: 3, bgcolor: bookingStep === 1 ? '#2563eb' : '#e5e7eb', transition: 'all 0.2s' }} />
              <Box sx={{ width: 32, height: 6, borderRadius: 3, bgcolor: bookingStep === 2 ? '#2563eb' : '#e5e7eb', transition: 'all 0.2s' }} />
            </Box>
            {/* Step 1: Details */}
            {bookingStep === 1 && (
              <Box sx={{ p: 3, pt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, color: '#374151', fontWeight: 500 }}>{selectedPackage?.description}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <MonetizationOnIcon sx={{ color: '#2563eb' }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#2563eb', mr: 2 }}>${selectedPackage?.price}</Typography>
                  <TimelineIcon sx={{ color: '#059669' }} />
                  <Typography variant="body1" sx={{ color: '#059669', fontWeight: 600 }}>{selectedPackage?.timeline}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <ListAltIcon sx={{ color: '#2563eb', mr: 1, verticalAlign: 'middle' }} />
                  <Typography variant="subtitle2" sx={{ display: 'inline', fontWeight: 600 }}>Features:</Typography>
                  <ul style={{ margin: '0.5rem 0 0 1.5rem', padding: 0 }}>
                    {(selectedPackage?.features || []).map((feature: string, index: number) => (
                      <li key={index} style={{ color: '#374151', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircleOutlineIcon sx={{ color: '#059669', fontSize: 18, mr: 1 }} /> {feature}
                      </li>
                    ))}
                  </ul>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <NotesIcon sx={{ color: '#2563eb', mr: 1, verticalAlign: 'middle' }} />
                  <Typography variant="subtitle2" sx={{ display: 'inline', fontWeight: 600 }}>Project Notes (optional):</Typography>
                  <TextField
                    multiline
                    minRows={2}
                    maxRows={4}
                    fullWidth
                    placeholder="Share any details or requests for your project..."
                    value={projectNotes}
                    onChange={e => setProjectNotes(e.target.value)}
                    sx={{ mt: 1, background: '#f8f9fa', borderRadius: 2 }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Select Date</Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={selectedDate}
                      onChange={(newValue: Date | null) => setSelectedDate(newValue)}
                      minDate={new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                          className: 'date-picker',
                          sx: { background: '#fff', borderRadius: 2 }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Select Time</Typography>
                  <TextField
                    select
                    fullWidth
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                    variant="outlined"
                    sx={{ background: 'rgba(255,255,255,0.6)', borderRadius: 2, backdropFilter: 'blur(16px)' }}
                  >
                    <MenuItem value="">--:--</MenuItem>
                    {TIME_SLOTS.map(t => (
                      <MenuItem key={t} value={t}>{t}</MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mt: 2, borderRadius: 2, fontWeight: 700, fontSize: 18, boxShadow: 2, textTransform: 'none' }}
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setBookingStep(2)}
                >
                  Next: Confirm
                </Button>
              </Box>
            )}
            {/* Step 2: Confirm */}
            {bookingStep === 2 && (
              <Box sx={{ p: 3, pt: 2 }}>
                <Typography variant="h6" sx={{ color: '#2563eb', fontWeight: 700, mb: 2 }}>Confirm Your Booking</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Package:</Typography>
                  <Typography variant="body1">{selectedPackage?.name} - {selectedPackage?.description}</Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <MonetizationOnIcon sx={{ color: '#2563eb' }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#2563eb', mr: 2 }}>${selectedPackage?.price}</Typography>
                  <TimelineIcon sx={{ color: '#059669' }} />
                  <Typography variant="body1" sx={{ color: '#059669', fontWeight: 600 }}>{selectedPackage?.timeline}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Date & Time:</Typography>
                  <Typography variant="body1">{selectedDate ? new Date(selectedDate).toLocaleDateString() : ''} at {selectedTime}</Typography>
                </Box>
                {projectNotes && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Project Notes:</Typography>
                    <Typography variant="body1">{projectNotes}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
                    onClick={() => setBookingStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', boxShadow: 2 }}
                    onClick={handleConfirmBooking}
                  >
                    Confirm Booking
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Modal>
        <Dialog open={thankYouOpen} onClose={() => setThankYouOpen(false)} maxWidth="xs">
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>Thank You!</DialogTitle>
          <DialogContent>
            <Typography sx={{ textAlign: 'center', mb: 2 }}>
              Your booking has been confirmed.<br />You will see it in your Bookings page.
            </Typography>
            <Button variant="contained" color="primary" fullWidth onClick={() => setThankYouOpen(false)}>
              Close
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  );
};

export default FreelancerProfile; 