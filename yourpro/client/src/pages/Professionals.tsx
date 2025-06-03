import React, { useState, useEffect } from 'react';
import './Professionals.css';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import { FREELANCERS, Freelancer } from './Freelancers';
import { COMPANIES, Company } from './Companies';
import { Modal, Typography, InputAdornment, IconButton, Avatar, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Rating } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextFieldProps } from '@mui/material/TextField';
import TimelineIcon from '@mui/icons-material/Timeline';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ListAltIcon from '@mui/icons-material/ListAlt';
import NotesIcon from '@mui/icons-material/Notes';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { supabase } from '../config/supabase';

interface DBFreelancer {
  user_id: string;
  full_name: string;
  professional_title: string;
  location: string;
  skills: string[];
  avatar_url?: string;
  education?: string;
  languages?: string[];
  hourly_rate?: number;
  package_rate?: number;
  services?: string[];
}

const Professionals: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFreelancers, setFilteredFreelancers] = useState(FREELANCERS);
  const [filteredCompanies, setFilteredCompanies] = useState(COMPANIES);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingTarget, setBookingTarget] = useState<null | (Freelancer | Company)>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedPackage, setSelectedPackage] = useState<{
    type: 'freelancer' | 'company';
    id: string;
    name: string;
    package: {
      id: string;
      name: string;
      description: string;
      price: number;
      timeline: string;
      features: string[];
    };
  } | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [projectNotes, setProjectNotes] = useState('');
  const [bookingMethod, setBookingMethod] = useState<'package' | 'quote'>('package');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [quoteDetails, setQuoteDetails] = useState('');
  const [quotePriceRange, setQuotePriceRange] = useState<[number, number]>([100, 1000]);
  const [dbFreelancers, setDbFreelancers] = useState<DBFreelancer[]>([]);
  const [selectedDbFreelancer, setSelectedDbFreelancer] = useState<DBFreelancer | null>(null);
  const [showDbFreelancerModal, setShowDbFreelancerModal] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [starFilter, setStarFilter] = useState('');

  // Combine and randomize filtered results
  const combinedResults = React.useMemo(() => {
    const allResults = [
      ...filteredFreelancers.map(f => ({ type: 'freelancer' as const, data: f })),
      ...filteredCompanies.map(c => ({ type: 'company' as const, data: c }))
    ];
    return allResults.sort(() => Math.random() - 0.5);
  }, [filteredFreelancers, filteredCompanies]);

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

  // Time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 8; h <= 20; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
      slots.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };
  const TIME_SLOTS = generateTimeSlots();

  // Function to get search suggestions based on current input
  const getSearchSuggestions = (input: string) => {
    if (!input) return [];

    const allTerms = [
      ...FREELANCERS.flatMap(freelancer => [...freelancer.skills, freelancer.title]),
      ...COMPANIES.flatMap(company => [...company.specialties, company.industry])
    ];

    const uniqueTerms = Array.from(new Set(allTerms));
    return uniqueTerms
      .filter(term => term.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5);
  };

  // Function to calculate relevance score for a freelancer or company based on search query
  const calculateRelevanceScore = (item: Freelancer | Company, query: string) => {
    const searchTerms = query.toLowerCase().split(' ');
    let score = 0;

    searchTerms.forEach(term => {
      // Check name and title/industry
      if (item.name.toLowerCase().includes(term)) score += 5;
      if ('title' in item && item.title.toLowerCase().includes(term)) score += 5;
      if ('industry' in item && item.industry.toLowerCase().includes(term)) score += 5;
      if (item.location.toLowerCase().includes(term)) score += 6;
      
      // Check skills/specialties
      if ('skills' in item) {
        item.skills.forEach(skill => {
          if (skill.toLowerCase().includes(term)) score += 4;
        });
      }
      if ('specialties' in item) {
        item.specialties.forEach(specialty => {
          if (specialty.toLowerCase().includes(term)) score += 4;
        });
      }
    });

    return score;
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredFreelancers(FREELANCERS);
      setFilteredCompanies(COMPANIES);
      setSearchSuggestions([]);
      return;
    }

    // Filter freelancers
    const scoredFreelancers = FREELANCERS.map(freelancer => ({
      freelancer,
      score: calculateRelevanceScore(freelancer, searchQuery)
    }));
    const filteredFreelancers = scoredFreelancers
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.freelancer);

    // Filter companies
    const scoredCompanies = COMPANIES.map(company => ({
      company,
      score: calculateRelevanceScore(company, searchQuery)
    }));
    const filteredCompanies = scoredCompanies
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.company);

    setFilteredFreelancers(filteredFreelancers);
    setFilteredCompanies(filteredCompanies);
    setSearchSuggestions([]);
  };

  // When user types, update suggestions
  useEffect(() => {
    const suggestions = getSearchSuggestions(searchQuery);
    setSearchSuggestions(suggestions);
  }, [searchQuery]);

  // Helper to get availability class
  const getAvailabilityClass = (hours: number) => {
    if (hours >= 30) return 'available';
    if (hours > 0) return 'partially-available';
    return 'not-available';
  };

  // Handler for Book Me
  const handleBook = (item: Freelancer | Company) => {
    setBookingTarget(item);
    setShowBookingModal(true);
    setBookingMethod('package');
    setSelectedPackageId('');
    setQuoteDetails('');
    setQuotePriceRange([100, 1000]);
    setSelectedDate(null);
    setSelectedTime('');
  };

  // Handler for Message Me
  const handleMessage = (id: string, type: 'freelancer' | 'company') => {
    navigate(`/message/${type}/${id}`);
  };

  const handlePackageClick = (type: 'freelancer' | 'company', id: string, name: string, packageData: any) => {
    setSelectedPackage({ type, id, name, package: packageData });
    setShowBookingModal(true);
  };

  const handleBookingConfirm = () => {
    if (bookingMethod === 'package') {
      if (!bookingTarget || !selectedPackageId || !selectedDate || !selectedTime) return;
      const pkg = ('packages' in bookingTarget ? bookingTarget.packages : []).find(p => p.id === selectedPackageId);
      if (!pkg) return;
      const booking = {
        id: Date.now(),
        type: 'freelancer' in bookingTarget ? 'freelancer' : 'company',
        targetId: bookingTarget.id,
        targetName: bookingTarget.name,
        package: pkg,
        date: selectedDate,
        time: selectedTime,
        notes: projectNotes,
        status: 'pending',
        createdAt: new Date().toISOString(),
        isQuote: false
      };
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      localStorage.setItem('bookings', JSON.stringify([...existingBookings, booking]));
    } else {
      // Quote request
      if (!bookingTarget || !quoteDetails || !selectedDate || !selectedTime) return;
      const quoteBooking = {
        id: Date.now(),
        type: 'freelancer' in bookingTarget ? 'freelancer' : 'company',
        targetId: bookingTarget.id,
        targetName: bookingTarget.name,
        package: {
          id: 'quote',
          name: 'Custom Request',
          description: quoteDetails,
          price: quotePriceRange[0] === quotePriceRange[1] ? quotePriceRange[0] : `${quotePriceRange[0]}-${quotePriceRange[1]}`,
          timeline: '',
          features: [],
        },
        date: selectedDate,
        time: selectedTime,
        notes: '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        isQuote: true,
        priceRange: quotePriceRange
      };
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      localStorage.setItem('bookings', JSON.stringify([...existingBookings, quoteBooking]));
    }
    setShowBookingModal(false);
    setShowThankYouModal(true);
    setBookingStep(1);
    setProjectNotes('');
    setSelectedPackageId('');
    setSelectedDate(null);
    setSelectedTime('');
    setQuoteDetails('');
    setQuotePriceRange([100, 1000]);
    setTimeout(() => {
      setShowThankYouModal(false);
    }, 3000);
  };

  const renderBookingModal = () => (
    <Modal
      open={showBookingModal}
      onClose={() => { setShowBookingModal(false); setBookingStep(1); setProjectNotes(''); setBookingMethod('package'); setSelectedPackageId(''); setQuoteDetails(''); setQuotePriceRange([100, 1000]); }}
      aria-labelledby="booking-modal-title"
    >
      <Box className="booking-modal" sx={{ p: 0, borderRadius: 4, boxShadow: 8, maxWidth: 480, width: '95vw', overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(24px)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #f0f0f0', bgcolor: 'rgba(37,99,235,0.07)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: '#2563eb', color: '#fff', fontWeight: 700 }}>
              {bookingTarget?.name?.[0] || '?'}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2563eb' }}>{bookingTarget?.name}</Typography>
            </Box>
          </Box>
          <IconButton onClick={() => { setShowBookingModal(false); setBookingStep(1); setProjectNotes(''); setBookingMethod('package'); setSelectedPackageId(''); setQuoteDetails(''); setQuotePriceRange([100, 1000]); }}>
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Booking method selector */}
        <Box sx={{ p: 3, pt: 2, pb: 0 }}>
          <TextField
            select
            label="Booking Type"
            value={bookingMethod}
            onChange={e => setBookingMethod(e.target.value as 'package' | 'quote')}
            fullWidth
            sx={{ mb: 2, background: '#fff', borderRadius: 2 }}
          >
            <MenuItem value="package">Select a Package</MenuItem>
            <MenuItem value="quote">Custom Request</MenuItem>
          </TextField>
        </Box>
        {/* Package selection flow */}
        {bookingMethod === 'package' && bookingTarget && (
          <Box sx={{ p: 3, pt: 2 }}>
            <TextField
              select
              label="Choose Package"
              value={selectedPackageId}
              onChange={e => setSelectedPackageId(e.target.value)}
              fullWidth
              sx={{ mb: 2, background: '#fff', borderRadius: 2 }}
            >
              <MenuItem value="">Select...</MenuItem>
              {('packages' in bookingTarget ? bookingTarget.packages : []).map(pkg => (
                <MenuItem key={pkg.id} value={pkg.id}>{pkg.name}</MenuItem>
              ))}
            </TextField>
            {/* Show package details if selected */}
            {selectedPackageId && (() => {
              const pkg = ('packages' in bookingTarget ? bookingTarget.packages : []).find(p => p.id === selectedPackageId);
              if (!pkg) return null;
              return (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: '#374151', fontWeight: 500 }}>{pkg.description}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <MonetizationOnIcon sx={{ color: '#2563eb' }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#2563eb', mr: 2 }}>${pkg.price}</Typography>
                    <TimelineIcon sx={{ color: '#059669' }} />
                    <Typography variant="body1" sx={{ color: '#059669', fontWeight: 600 }}>{pkg.timeline}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <ListAltIcon sx={{ color: '#2563eb', mr: 1, verticalAlign: 'middle' }} />
                    <Typography variant="subtitle2" sx={{ display: 'inline', fontWeight: 600 }}>Features:</Typography>
                    <ul style={{ margin: '0.5rem 0 0 1.5rem', padding: 0 }}>
                      {pkg.features.map((feature: string, index: number) => (
                        <li key={index} style={{ color: '#374151', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CheckCircleOutlineIcon sx={{ color: '#059669', fontSize: 18, mr: 1 }} /> {feature}
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Box>
              );
            })()}
            <Box className="calendar-section" sx={{ mb: 2 }}>
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
                {generateTimeSlots().map(t => (
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
              disabled={!selectedPackageId || !selectedDate || !selectedTime}
              onClick={handleBookingConfirm}
            >
              Confirm Booking
            </Button>
          </Box>
        )}
        {/* Custom request flow */}
        {bookingMethod === 'quote' && (
          <Box sx={{ p: 3, pt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, color: '#374151', fontWeight: 500 }}>Request a Custom Quote</Typography>
            <TextField
              label="Describe your request"
              multiline
              minRows={3}
              maxRows={6}
              fullWidth
              value={quoteDetails}
              onChange={e => setQuoteDetails(e.target.value)}
              sx={{ mb: 2, background: '#f8f9fa', borderRadius: 2 }}
            />
            <Box className="calendar-section" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Preferred Date</Typography>
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
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Preferred Time</Typography>
              <TextField
                select
                fullWidth
                value={selectedTime}
                onChange={e => setSelectedTime(e.target.value)}
                variant="outlined"
                sx={{ background: 'rgba(255,255,255,0.6)', borderRadius: 2, backdropFilter: 'blur(16px)' }}
              >
                <MenuItem value="">--:--</MenuItem>
                {generateTimeSlots().map(t => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Price Range ($)</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  type="number"
                  label="Min"
                  value={quotePriceRange[0]}
                  onChange={e => setQuotePriceRange([Number(e.target.value), quotePriceRange[1]])}
                  sx={{ width: 100, background: '#fff', borderRadius: 2 }}
                  inputProps={{ min: 0 }}
                />
                <span style={{ fontWeight: 600, color: '#374151' }}>-</span>
                <TextField
                  type="number"
                  label="Max"
                  value={quotePriceRange[1]}
                  onChange={e => setQuotePriceRange([quotePriceRange[0], Number(e.target.value)])}
                  sx={{ width: 100, background: '#fff', borderRadius: 2 }}
                  inputProps={{ min: quotePriceRange[0] || 0 }}
                />
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 2, borderRadius: 2, fontWeight: 700, fontSize: 18, boxShadow: 2, textTransform: 'none' }}
              disabled={!quoteDetails || !selectedDate || !selectedTime}
              onClick={handleBookingConfirm}
            >
              Confirm Request
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );

  const renderThankYouModal = () => (
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
  );

  const renderFreelancerCard = (freelancer: Freelancer) => (
    <Link to={`/freelancer/${freelancer.id}`} key={freelancer.id} className="freelancer-card-link">
      <div className="freelancer-card" style={{ height: 950, width: 600, maxWidth: '95%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: '0 auto' }}>
        <div className="freelancer-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className={`availability-badge ${getAvailabilityClass(freelancer.availableHours)}`} style={{ marginBottom: '0.5rem' }}>
              {freelancer.availableHours > 0
                ? `Available for ${freelancer.availableHours}h/week`
                : 'Not Available'}
            </div>
            <img src={freelancer.avatar} alt={freelancer.name} className="freelancer-avatar" />
          </div>
          <div className="freelancer-info-wrapper">
            <h2>{freelancer.name}</h2>
            <p className="job-title">{freelancer.title}</p>
            <div className="location-info">
              <LocationOnIcon />
              <span>{freelancer.location}</span>
            </div>
            <div className="review-stars">
              <Rating value={freelancer.rating ?? 0} readOnly precision={0.5} />
              <span className="rating-value">{freelancer.rating?.toFixed(1) ?? '0.0'}</span>
              <span className="review-count">({freelancer.reviewCount ?? 0} reviews)</span>
            </div>
          </div>
        </div>
        <div className="freelancer-body">
          <div className="skills-section">
            <h3>Skills</h3>
            <div className="skills-list">
              {freelancer.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
          <div className="package-buttons" style={{ display: 'flex', gap: 10, margin: '18px 0', justifyContent: 'center' }}>
            {freelancer.packages.map((pkg) => (
              <Button
                key={pkg.id}
                variant="outlined"
                className={`package-button ${pkg.name.toLowerCase()}`}
                onClick={e => { e.preventDefault(); handlePackageClick('freelancer', freelancer.id.toString(), freelancer.name, pkg); }}
                style={{ minWidth: 90, fontWeight: 700, fontSize: 15 }}
              >
                {pkg.name}
              </Button>
            ))}
          </div>
          {/* Package Details Section (scrollable if needed) */}
          <div className="card-packages-details" style={{ maxHeight: 110, overflowY: 'auto', marginBottom: 10 }}>
            {freelancer.packages.map((pkg) => (
              <div key={pkg.id} style={{ marginBottom: 8, border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, background: '#f9fafb' }}>
                <div style={{ fontWeight: 700, color: '#2563eb', fontSize: 15 }}>{pkg.name} <span style={{ color: '#059669', fontWeight: 600, fontSize: 14 }}>${pkg.price}</span> <span style={{ color: '#374151', fontSize: 13 }}>({pkg.timeline})</span></div>
                <div style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>{pkg.description}</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {pkg.features.map((feature, i) => (
                    <li key={i} style={{ fontSize: 12, color: '#374151' }}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="info-section">
            <div className="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
              </svg>
              <span>{freelancer.hourlyRate}/hr</span>
            </div>
          </div>
          <div className="action-buttons">
            <Button
              variant="contained"
              color="primary"
              className="book-button"
              onClick={e => { e.preventDefault(); handleBook(freelancer); }}
              startIcon={<SendIcon />}
            >
              Book Me
            </Button>
            <Button
              variant="outlined"
              className="message-button"
              onClick={e => { e.preventDefault(); handleMessage(freelancer.id.toString(), 'freelancer'); }}
              startIcon={<ChatBubbleOutlineIcon />}
            >
              Message
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );

  const renderCompanyCard = (company: Company) => (
    <Link to={`/company/${company.id}`} key={company.id} className="company-card-link">
      <div className="company-card">
        <div className="company-header">
          {company.hiring && (
            <div className="hiring-badge">Hiring</div>
          )}
          <div className="company-info-wrapper">
            <img src={company.logo} alt={company.name} className="company-logo" />
            <div className="company-basic-info">
              <h2>{company.name}</h2>
              <p className="industry">{company.industry}</p>
              <div className="location-info">
                <LocationOnIcon />
                <span>{company.location}</span>
              </div>
              <div className="review-stars">
                <Rating value={company.rating ?? 0} readOnly precision={0.5} />
                <span className="rating-value">{company.rating?.toFixed(1) ?? '0.0'}</span>
                <span className="review-count">({company.reviewCount ?? 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="company-body">
          <div className="specialties-section">
            <h3>Specialties</h3>
            <div className="specialties-list">
              {company.specialties.map((specialty, index) => (
                <span key={index} className="specialty-tag">{specialty}</span>
              ))}
            </div>
          </div>
          <div className="info-section">
            <div className="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
              </svg>
              <span>{company.employeeCount} employees</span>
            </div>
          </div>
          {company.packages && company.packages.length > 0 && (
            <div className="package-buttons">
              {company.packages.map((pkg) => (
                <Button
                  key={pkg.id}
                  variant="outlined"
                  className={`package-button ${pkg.name.toLowerCase()}`}
                  onClick={e => { e.preventDefault(); handlePackageClick('company', company.id.toString(), company.name, pkg); }}
                >
                  {pkg.name}
                </Button>
              ))}
            </div>
          )}
          <div className="action-buttons">
            <Button
              variant="contained"
              color="primary"
              onClick={e => { e.preventDefault(); handleBook(company); }}
            >
              Book Us
            </Button>
            <Button
              variant="outlined"
              onClick={e => { e.preventDefault(); handleMessage(company.id.toString(), 'company'); }}
            >
              Message
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );

  useEffect(() => {
    async function fetchDbFreelancers() {
      const { data, error } = await supabase.from('freelancer_profiles').select('*');
      if (data) setDbFreelancers(data);
    }
    fetchDbFreelancers();
  }, []);

  // Helper to map DB freelancer to mock Freelancer shape
  function mapDbFreelancerToMock(f: DBFreelancer): Freelancer {
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
    const defaultPackages: import('./Freelancers').ServicePackage[] = [
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
      rating: 4.8, // default or fetch if available
      reviewCount: 0, // default or fetch if available
      availableHours: 10, // default or fetch if available
      hourlyRate: '$50', // default or fetch if available
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

  // Get unique locations from all freelancers (mock + db)
  const allFreelancers = [...FREELANCERS, ...dbFreelancers.map(mapDbFreelancerToMock)];
  const uniqueLocations = Array.from(new Set(allFreelancers.map(f => f.location).filter(Boolean)));
  const uniqueRatings = [5, 4.5, 4, 3.5, 3];

  // Update location suggestions as user types
  useEffect(() => {
    if (!locationInput) {
      setLocationSuggestions([]);
      return;
    }
    const matches = uniqueLocations.filter(loc => loc.toLowerCase().includes(locationInput.toLowerCase()));
    setLocationSuggestions(matches.slice(0, 6));
  }, [locationInput, uniqueLocations]);

  // Filtering logic
  const applyFilters = (freelancers: Freelancer[]) => {
    return freelancers.filter(f => {
      // Location filter
      if (locationFilter && f.location !== locationFilter) return false;
      // Hourly rate filter
      const rateNum = parseInt((f.hourlyRate || '').replace(/[^\d]/g, ''));
      if (minRate && (!rateNum || rateNum < parseInt(minRate))) return false;
      if (maxRate && (!rateNum || rateNum > parseInt(maxRate))) return false;
      // Star filter
      if (starFilter && (!f.rating || f.rating < parseFloat(starFilter))) return false;
      return true;
    });
  };

  // Apply filters to both mock and db freelancers
  const filteredMockFreelancers = applyFilters(FREELANCERS);
  const filteredDbFreelancers = applyFilters(dbFreelancers.map(mapDbFreelancerToMock));

  return (
    <div className="with-navbar-padding">
      <div className="professionals-container">
        <div className="search-section">
          <h1>Find Professionals</h1>
          <Box sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            maxWidth: 1200,
            width: '100%',
            mx: 'auto',
            mb: 3,
            background: '#fff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <form onSubmit={e => { e.preventDefault(); handleSearch(); }}
              style={{
                display: 'flex',
                flexWrap: 'nowrap',
                gap: 12,
                width: '100%',
                alignItems: 'center',
                marginBottom: 0,
                justifyContent: 'center',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}>
              <TextField
                variant="outlined"
                placeholder="Search by skills, expertise, or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                  ),
                }}
                sx={{
                  background: '#f7f8fa',
                  borderRadius: 2.5,
                  border: '1px solid #e5e7eb',
                  boxShadow: 'none',
                  minWidth: 250,
                  maxWidth: 400,
                  flex: '0 0 400px',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover': { background: '#f1f3f6' },
                  transition: 'background 0.2s',
                }}
              />
              <Box sx={{ position: 'relative', minWidth: 150, maxWidth: 170, flex: '0 0 150px' }}>
                <TextField
                  label="Location"
                  value={locationInput}
                  onChange={e => {
                    setLocationInput(e.target.value);
                    setLocationFilter('');
                  }}
                  sx={{
                    background: '#f7f8fa',
                    borderRadius: 2.5,
                    border: '1px solid #e5e7eb',
                    boxShadow: 'none',
                    width: '100%',
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '&:hover': { background: '#f1f3f6' },
                    transition: 'background 0.2s',
                  }}
                  autoComplete="off"
                />
                {locationInput && locationSuggestions.length > 0 && (
                  <Box sx={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e1e1e1', borderRadius: 2, mt: 0.5, boxShadow: 3, zIndex: 1000 }}>
                    {locationSuggestions.map((loc, idx) => (
                      <Box
                        key={loc}
                        sx={{ p: 1.2, cursor: 'pointer', textAlign: 'left', '&:hover': { background: '#f5f7fa' } }}
                        onClick={() => {
                          setLocationInput(loc);
                          setLocationFilter(loc);
                          setLocationSuggestions([]);
                        }}
                      >
                        {loc}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              <TextField
                label="Min Rate ($)"
                type="number"
                value={minRate}
                onChange={e => setMinRate(e.target.value)}
                sx={{
                  minWidth: 90,
                  maxWidth: 110,
                  flex: '0 0 90px',
                  background: '#f7f8fa',
                  borderRadius: 2.5,
                  border: '1px solid #e5e7eb',
                  boxShadow: 'none',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover': { background: '#f1f3f6' },
                  transition: 'background 0.2s',
                }}
              />
              <TextField
                label="Max Rate ($)"
                type="number"
                value={maxRate}
                onChange={e => setMaxRate(e.target.value)}
                sx={{
                  minWidth: 90,
                  maxWidth: 110,
                  flex: '0 0 90px',
                  background: '#f7f8fa',
                  borderRadius: 2.5,
                  border: '1px solid #e5e7eb',
                  boxShadow: 'none',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover': { background: '#f1f3f6' },
                  transition: 'background 0.2s',
                }}
              />
              <TextField
                select
                label="Review Stars"
                value={starFilter}
                onChange={e => setStarFilter(e.target.value)}
                sx={{
                  minWidth: 100,
                  maxWidth: 120,
                  flex: '0 0 100px',
                  background: '#f7f8fa',
                  borderRadius: 2.5,
                  border: '1px solid #e5e7eb',
                  boxShadow: 'none',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover': { background: '#f1f3f6' },
                  transition: 'background 0.2s',
                }}
              >
                <MenuItem value="">All Ratings</MenuItem>
                {uniqueRatings.map(r => (
                  <MenuItem key={r} value={r}>{r}+</MenuItem>
                ))}
              </TextField>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  borderRadius: 2.5,
                  px: 4,
                  fontWeight: 600,
                  boxShadow: 'none',
                  textTransform: 'none',
                  height: 48,
                  background: '#2563eb',
                  '&:hover': { background: '#1746a0' },
                  fontSize: 17,
                  minWidth: 120,
                  flex: '0 0 120px',
                }}
                endIcon={<SearchIcon />}
              >
                Search
              </Button>
            </form>
            {searchSuggestions.length > 0 && searchQuery && (
              <Box sx={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e1e1e1', borderRadius: 2, mt: 1, boxShadow: 3, zIndex: 1000 }}>
                {searchSuggestions.map((suggestion, index) => (
                  <Box
                    key={index}
                    sx={{ p: 1.2, cursor: 'pointer', textAlign: 'left', '&:hover': { background: '#f5f7fa' } }}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      handleSearch();
                      setSearchSuggestions([]);
                      setSearchQuery('');
                    }}
                  >
                    {suggestion}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </div>

        <div className="professionals-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '40px',
          maxWidth: 900,
          margin: '0 auto',
        }}>
          {filteredMockFreelancers.concat(filteredDbFreelancers).length > 0 ? (
            filteredMockFreelancers.concat(filteredDbFreelancers).map(f => renderFreelancerCard(f))
          ) : (
            <div className="no-results">
              <h3>No professionals found matching your search criteria</h3>
              <p>Try different keywords or browse all professionals</p>
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {showBooking && bookingTarget && (
          <div className="booking-modal-overlay" onClick={() => setShowBooking(false)}>
            <div className="booking-modal" onClick={e => e.stopPropagation()}>
              <h3>Book {bookingTarget.name}</h3>
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

        {renderBookingModal()}
        {renderThankYouModal()}
      </div>
    </div>
  );
};

export default Professionals; 