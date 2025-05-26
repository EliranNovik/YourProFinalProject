import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { COMPANIES, Company, ServicePackage } from './Companies';
import './FreelancerProfile.css';
import { Modal, Typography, IconButton, Avatar, MenuItem, TextField, Button, Box, Card, CardContent, CardActions, Grid, Chip, Divider, List, ListItem, ListItemIcon, ListItemText, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Link as MuiLink } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ListAltIcon from '@mui/icons-material/ListAlt';
import NotesIcon from '@mui/icons-material/Notes';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BarChartIcon from '@mui/icons-material/BarChart';
import DiamondIcon from '@mui/icons-material/Diamond';
import CancelIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';
import { Rating } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';

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

// Helper to get initials from company name
function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const CompanyLogo: React.FC<{ logo: string; name: string }> = ({ logo, name }) => {
  const [logoError, setLogoError] = useState(false);
  if (logoError || !logo) {
    return <div className="company-logo-fallback">{getInitials(name)}</div>;
  }
  return (
    <img
      src={logo}
      alt={name}
      className="profile-avatar"
      onError={() => setLogoError(true)}
    />
  );
};

const CompanyProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const company = COMPANIES.find((c: Company) => c.id === Number(id)) || COMPANIES[0];
  const navigate = useNavigate();

  // Calculate package price (5-hour package with 10% discount)
  const hourlyRate = company.hourlyRate ? parseInt(company.hourlyRate.replace('$', '')) : 0;
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
  const [editData, setEditData] = useState({ ...company });
  const [coverPreview, setCoverPreview] = useState(company.coverImage || '');
  const [logoPreview, setLogoPreview] = useState(company.logo || '');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newWorkType, setNewWorkType] = useState('');

  const [portfolioEdit, setPortfolioEdit] = useState((editData.portfolioImages || []).map(item => ({ ...item, link: item.link || '' })));
  const [projectsEdit, setProjectsEdit] = useState(editData.recentProjects || []);
  const [newTechs, setNewTechs] = useState<string[]>(projectsEdit.map(() => ''));

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [projectNotes, setProjectNotes] = useState('');

  const [newFeatureInputs, setNewFeatureInputs] = useState<{ [pkgId: string]: string }>({});
  const [newTechInputs, setNewTechInputs] = useState<{ [idx: number]: string }>({});

  useEffect(() => {
    if (editOpen) {
      setPortfolioEdit((editData.portfolioImages || []).map(item => ({ ...item, link: item.link || '' })));
      setProjectsEdit(editData.recentProjects || []);
      setNewTechs((editData.recentProjects || []).map(() => ''));
    }
  }, [editOpen, editData]);

  // Calendar helpers
  const today = new Date();
  const daysInMonth = (month: Date) => new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = (month: Date) => new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const isToday = (date: Date) => date.toDateString() === today.toDateString();
  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    const d1 = new Date(selectedDate);
    return (
      date.getFullYear() === d1.getFullYear() &&
      date.getMonth() === d1.getMonth() &&
      date.getDate() === d1.getDate()
    );
  };

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

  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);

  const handlePackageClick = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedPackage || !selectedDate || !selectedTime) return;
    const booking = {
      id: Date.now(),
      type: 'company',
      targetId: company.id,
      targetName: company.name,
      package: selectedPackage,
      date: selectedDate,
      time: selectedTime,
      notes: projectNotes,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existing, booking]));
    setShowBookingModal(false);
    setShowThankYouModal(true);
    setBookingStep(1);
    setProjectNotes('');
    setTimeout(() => {
      setShowThankYouModal(false);
      setSelectedPackage(null);
      setSelectedDate(null);
      setSelectedTime('');
    }, 3000);
  };

  const handleDateChange = (newValue: Date | null) => {
    if (newValue) {
      setSelectedDate(newValue);
    }
  };

  return (
    <div className="with-navbar-padding">
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: { xs: 1, md: 4 } }}>
        <div className={`profile-container${editOpen ? ' edit-mode' : ''}`}>
          <div className="profile-header">
            <div
              className="profile-cover"
              style={coverPreview ? { backgroundImage: `url(${coverPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
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

            <Button 
              variant="outlined" 
              className="edit-profile-btn"
              onClick={() => setEditOpen(true)}
              sx={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                bgcolor: 'white',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              Edit Profile
            </Button>

            <div className="profile-main-info">
              <div style={{ position: 'relative' }}>
                <img src={logoPreview} alt={editData.name} className="profile-avatar" />
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
                          setLogoPreview(url);
                          setEditData({ ...editData, logo: url });
                        }
                      }}
                    />
                    <span className="upload-btn">Change Logo</span>
                  </label>
                )}
              </div>

              <div className="profile-title-section">
                {editOpen ? (
                  <TextField
                    className="edit-input main-name"
                    value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                    variant="standard"
                    label="Company Name"
                  />
                ) : (
                  <h1>{editData.name}</h1>
                )}
                <div className="profile-review-stars">
                  <Rating value={company.rating ?? 0} readOnly precision={0.5} />
                  <span className="rating-value">{company.rating?.toFixed(1) ?? '0.0'}</span>
                  <span className="review-count">({company.reviewCount ?? 0} reviews)</span>
                </div>
                {editOpen ? (
                  <TextField
                    className="edit-input main-title"
                    value={editData.industry}
                    onChange={e => setEditData({ ...editData, industry: e.target.value })}
                    variant="standard"
                    label="Industry"
                  />
                ) : (
                  <h2>{editData.industry}</h2>
                )}
                <div className="profile-location">
                  <LocationOnIcon />
                  {editOpen ? (
                    <TextField
                      className="edit-input main-location"
                      value={editData.location}
                      onChange={e => setEditData({ ...editData, location: e.target.value })}
                      variant="standard"
                      label="Location"
                    />
                  ) : (
                    <span>{editData.location}</span>
                  )}
                </div>
              </div>
              <div className="profile-quick-info">
                <div className="info-badge">
                  <span className="label">Employees</span>
                  <span className="value">{company.employeeCount}</span>
                </div>
                {company.hiring && (
                  <div className="info-badge">
                    <span className="label">Open Positions</span>
                    <span className="value">{company.openPositions}</span>
                  </div>
                )}
              </div>
              <div className="profile-actions">
                {editOpen ? (
                  <>
                    <Button variant="contained" color="primary" onClick={() => setEditOpen(false)} sx={{ mr: 2 }}>Save</Button>
                    <Button variant="outlined" color="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button variant="contained" color="primary" onClick={() => setShowBookingModal(true)} sx={{ mr: 2 }}>Book Us</Button>
                    <Button variant="outlined" color="primary" onClick={() => navigate(`/message/company/${company.id}`)} sx={{ mr: 2 }}>Message Us</Button>
                    <IconButton onClick={() => setEditOpen(true)}><EditIcon /></IconButton>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, background: '#fff', borderRadius: 4, boxShadow: 2, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>About Us</Typography>
            {editOpen ? (
              <TextField
                multiline
                minRows={3}
                maxRows={8}
                fullWidth
                value={editData.about || ''}
                onChange={e => setEditData({ ...editData, about: e.target.value })}
                placeholder="Describe your company, mission, and what makes you unique..."
              />
            ) : (
              <Typography variant="body1" sx={{ color: '#222', fontSize: 17, textAlign: 'center' }}>{editData.about || 'No company description available.'}</Typography>
            )}
          </Paper>

          {/* Info Grid Section */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, background: '#fff', borderRadius: 4, boxShadow: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>Specialties</Typography>
                {editOpen ? (
                  <>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {editData.specialties.map((spec: string, idx: number) => (
                        <Chip
                          key={idx}
                          label={spec}
                          onDelete={() => setEditData({ ...editData, specialties: editData.specialties.filter((_, i) => i !== idx) })}
                          sx={{ bgcolor: '#dcfce7', color: '#059669', fontWeight: 600 }}
                        />
                      ))}
                    </Box>
                    <TextField
                      value={newSpecialty}
                      onChange={e => setNewSpecialty(e.target.value)}
                      onKeyDown={e => {
                        if ((e.key === 'Enter' || e.key === ',') && newSpecialty.trim()) {
                          e.preventDefault();
                          if (!editData.specialties.includes(newSpecialty.trim())) {
                            setEditData({ ...editData, specialties: [...editData.specialties, newSpecialty.trim()] });
                          }
                          setNewSpecialty('');
                        }
                      }}
                      placeholder="Add specialty"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {editData.specialties.map((spec: string, idx: number) => (
                      <Chip key={idx} label={spec} sx={{ fontWeight: 600, fontSize: 16, background: '#dcfce7', color: '#059669', px: 2, py: 1, borderRadius: 2 }} />
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, background: '#fff', borderRadius: 4, boxShadow: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>Work Types</Typography>
                {editOpen ? (
                  <>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {editData.workTypes.map((type: string, idx: number) => (
                        <Chip
                          key={idx}
                          label={type}
                          onDelete={() => setEditData({ ...editData, workTypes: editData.workTypes.filter((_, i) => i !== idx) })}
                          sx={{ bgcolor: '#f3f4f6', color: '#374151', fontWeight: 600 }}
                        />
                      ))}
                    </Box>
                    <TextField
                      value={newWorkType}
                      onChange={e => setNewWorkType(e.target.value)}
                      onKeyDown={e => {
                        if ((e.key === 'Enter' || e.key === ',') && newWorkType.trim()) {
                          e.preventDefault();
                          if (!editData.workTypes.includes(newWorkType.trim())) {
                            setEditData({ ...editData, workTypes: [...editData.workTypes, newWorkType.trim()] });
                          }
                          setNewWorkType('');
                        }
                      }}
                      placeholder="Add work type"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {editData.workTypes.map((type: string, idx: number) => (
                      <Chip key={idx} label={type} sx={{ fontWeight: 600, fontSize: 16, background: '#f3f4f6', color: '#374151', px: 2, py: 1, borderRadius: 2 }} />
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, background: '#fff', borderRadius: 4, boxShadow: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>Contact Info</Typography>
                {editOpen ? (
                  <>
                    <TextField
                      label="Email"
                      value={editData.email || ''}
                      onChange={e => setEditData({ ...editData, email: e.target.value })}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Website"
                      value={editData.website || ''}
                      onChange={e => setEditData({ ...editData, website: e.target.value })}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Phone"
                      value={editData.phone || ''}
                      onChange={e => setEditData({ ...editData, phone: e.target.value })}
                      fullWidth
                    />
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: '#222', fontSize: 16, mb: 1 }}><b>Email:</b> {editData.email}</Typography>
                    <Typography sx={{ color: '#2563eb', fontSize: 16, mb: 1 }}><b>Website:</b> {editData.website}</Typography>
                    {editData.phone && <Typography sx={{ color: '#059669', fontSize: 16 }}><b>Phone:</b> {editData.phone}</Typography>}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Service Packages Section */}
          <Grid container spacing={4} justifyContent="center" sx={{ mb: 6, mt: 5 }}>
            {editData.packages.map((pkg: any, idx: number) => (
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
                      {pkg.features.map((feature: string, i: number) => (
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
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setShowBookingModal(true);
                        }}
                      >Book Now</Button>
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

          {/* Portfolio Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 5, background: '#fff', borderRadius: 4, boxShadow: 2, maxWidth: 1200, mx: 'auto' }}>
            <section className="portfolio-section">
              <h3 style={{ textAlign: 'center', fontWeight: 700, fontSize: 26, marginBottom: 24 }}>Portfolio</h3>
              {editOpen ? (
                <div className="portfolio-edit-grid">
                  {(editData.portfolioImages || []).map((item: any, index: number) => (
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
                              const updated = [...(editData.portfolioImages || [])];
                              updated[index] = { ...updated[index], url };
                              setEditData({ ...editData, portfolioImages: updated });
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
                          const updated = [...(editData.portfolioImages || [])];
                          updated[index].title = e.target.value;
                          setEditData({ ...editData, portfolioImages: updated });
                        }}
                      />
                      <div className="edit-input-label">Description</div>
                      <textarea
                        className="edit-input"
                        placeholder="Description"
                        value={item.description}
                        onChange={e => {
                          const updated = [...(editData.portfolioImages || [])];
                          updated[index].description = e.target.value;
                          setEditData({ ...editData, portfolioImages: updated });
                        }}
                      />
                      <div className="edit-input-label">Link</div>
                      <input
                        className="edit-input"
                        placeholder="Link (optional)"
                        value={item.link || ''}
                        onChange={e => {
                          const updated = [...(editData.portfolioImages || [])];
                          updated[index].link = e.target.value;
                          setEditData({ ...editData, portfolioImages: updated });
                        }}
                      />
                      <div className="portfolio-edit-actions">
                        <button className="portfolio-edit-remove" onClick={() => {
                          setEditData({ ...editData, portfolioImages: (editData.portfolioImages || []).filter((_: any, i: number) => i !== index) });
                        }}>Remove</button>
                      </div>
                    </div>
                  ))}
                  <button className="portfolio-edit-add" onClick={() => {
                    setEditData({
                      ...editData,
                      portfolioImages: [
                        ...(editData.portfolioImages || []),
                        { url: '', title: '', description: '', link: '' }
                      ]
                    });
                  }}>+ Add Portfolio Item</button>
                </div>
              ) : (
                <div className="portfolio-grid">
                  {(editData.portfolioImages || []).map((image: any, index: number) => (
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

          {/* Recent Projects Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 5, background: '#fff', borderRadius: 4, boxShadow: 2, maxWidth: 1200, mx: 'auto' }}>
            <section className="projects-section">
              <h3 style={{ textAlign: 'center', fontWeight: 700, fontSize: 26, marginBottom: 24 }}>Recent Projects</h3>
              {editOpen ? (
                <div className="section-edit-list">
                  {(editData.recentProjects || []).map((proj: any, idx: number) => (
                    <div className="section-edit-row" key={idx}>
                      <div className="edit-input-label">Name</div>
                      <input
                        className="section-edit-input"
                        placeholder="Name"
                        value={proj.name}
                        onChange={e => {
                          const updated = [...(editData.recentProjects || [])];
                          updated[idx].name = e.target.value;
                          setEditData({ ...editData, recentProjects: updated });
                        }}
                      />
                      <div className="edit-input-label">Description</div>
                      <input
                        className="section-edit-input"
                        placeholder="Description"
                        value={proj.description}
                        onChange={e => {
                          const updated = [...(editData.recentProjects || [])];
                          updated[idx].description = e.target.value;
                          setEditData({ ...editData, recentProjects: updated });
                        }}
                      />
                      <div className="edit-input-label">Technologies</div>
                      <div className="tech-chip-input">
                        {(proj.technologies || []).map((tech: string, techIndex: number) => (
                          <span key={techIndex} className="tech-tag">
                            {tech}
                            <span
                              className="chip-remove"
                              onClick={() => {
                                const updated = [...(editData.recentProjects || [])];
                                updated[idx].technologies = updated[idx].technologies.filter((_: any, i: number) => i !== techIndex);
                                setEditData({ ...editData, recentProjects: updated });
                              }}
                              style={{ marginLeft: 6, cursor: 'pointer', color: '#b91c1c', fontWeight: 700 }}
                            >×</span>
                          </span>
                        ))}
                        <input
                          className="section-edit-input"
                          placeholder="Add technology"
                          value={newTechInputs[idx] || ''}
                          onChange={e => setNewTechInputs({ ...newTechInputs, [idx]: e.target.value })}
                          onKeyDown={e => {
                            if ((e.key === 'Enter' || e.key === ',') && (newTechInputs[idx] || '').trim()) {
                              e.preventDefault();
                              const updated = [...(editData.recentProjects || [])];
                              if (!updated[idx].technologies.includes(newTechInputs[idx].trim())) {
                                updated[idx].technologies.push(newTechInputs[idx].trim());
                              }
                              setNewTechInputs({ ...newTechInputs, [idx]: '' });
                              setEditData({ ...editData, recentProjects: updated });
                            }
                          }}
                        />
                        <button
                          className="chip-add-btn"
                          type="button"
                          onClick={() => {
                            if ((newTechInputs[idx] || '').trim() && !proj.technologies.includes(newTechInputs[idx].trim())) {
                              const updated = [...(editData.recentProjects || [])];
                              updated[idx].technologies.push(newTechInputs[idx].trim());
                              setNewTechInputs({ ...newTechInputs, [idx]: '' });
                              setEditData({ ...editData, recentProjects: updated });
                            }
                          }}
                          style={{ marginLeft: 6 }}
                        >Add</button>
                      </div>
                      <div className="edit-input-label">Year</div>
                      <input
                        className="section-edit-input"
                        placeholder="Year"
                        value={proj.year}
                        onChange={e => {
                          const updated = [...(editData.recentProjects || [])];
                          updated[idx].year = e.target.value;
                          setEditData({ ...editData, recentProjects: updated });
                        }}
                      />
                      <button className="section-edit-remove" onClick={() => setEditData({ ...editData, recentProjects: (editData.recentProjects || []).filter((_: any, i: number) => i !== idx) })}>Remove</button>
                    </div>
                  ))}
                  <button className="section-edit-add" onClick={() => setEditData({ ...editData, recentProjects: [...(editData.recentProjects || []), { name: '', description: '', technologies: [], year: '' }] })}>+ Add Project</button>
                </div>
              ) : (
                <div className="projects-grid">
                  {(editData.recentProjects || []).map((project: any, index: number) => (
                    <div key={index} className="project-card">
                      <h4>{project.name}</h4>
                      <p>{project.description}</p>
                      <div className="project-technologies">
                        {(project.technologies || []).map((tech: string, techIndex: number) => (
                          <span key={techIndex} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                      <span className="project-year">{project.year}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </Paper>
        </div>
      </Box>

      {/* Booking Modal */}
      <Modal
        open={showBookingModal}
        onClose={() => { setShowBookingModal(false); setBookingStep(1); setProjectNotes(''); }}
        aria-labelledby="booking-modal-title"
      >
        <Box component="div" className="booking-modal-overlay" onClick={() => setShowBooking(false)}>
          <Box component="div" className="booking-modal" onClick={e => e.stopPropagation()}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #f0f0f0', bgcolor: 'rgba(37,99,235,0.07)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: '#2563eb', color: '#fff', fontWeight: 700 }}>
                  {company.name[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2563eb' }}>{selectedPackage?.name} Package</Typography>
                  <Typography variant="body2" sx={{ color: '#374151' }}>{company.name}</Typography>
                </Box>
              </Box>
              <IconButton onClick={() => { setShowBookingModal(false); setBookingStep(1); setProjectNotes(''); }}>
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
                    {selectedPackage?.features.map((feature: string, index: number) => (
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
                      onChange={handleDateChange}
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
        </Box>
      </Modal>

      {/* Thank You Modal */}
      <Modal
        open={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
      >
        <Box className="thank-you-modal">
          <CheckCircleIcon className="success-icon" />
          <Typography variant="h5">Thank You!</Typography>
          <Typography variant="body1">Your booking has been confirmed.</Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default CompanyProfile; 