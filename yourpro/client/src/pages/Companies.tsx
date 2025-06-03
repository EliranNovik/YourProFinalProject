import React, { useState, useEffect } from 'react';
import './Companies.css';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';

export interface ServicePackage {
  id: string;
  name: 'Basic' | 'Pro' | 'Premium';
  description: string;
  price: number;
  timeline: string;
  features: string[];
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  specialties: string[];
  keywords?: string[];
  workTypes: string[];
  employeeCount: string;
  location: string;
  email: string;
  website: string;
  hiring: boolean;
  openPositions: number;
  hourlyRate?: string;
  about?: string;
  phone?: string;
  portfolioImages?: { url: string; title: string; description: string; link?: string }[];
  coverImage?: string;
  recentProjects?: { name: string; description: string; technologies: string[]; year: string }[];
  rating?: number;
  reviewCount?: number;
  packages: ServicePackage[];
}

// Enhanced mock data with more detailed industry information
export const COMPANIES: Company[] = [
  {
    id: "1",
    name: "TechVision Solutions",
    logo: "https://logo.clearbit.com/techvision.com",
    industry: "Software Development",
    specialties: ["Enterprise Software", "Cloud Solutions", "AI/ML", "Mobile Apps", "Web Development"],
    keywords: ["software", "programming", "coding", "tech", "applications", "apps", "artificial intelligence", "machine learning", "development", "IT"],
    workTypes: ["Custom Software", "Mobile Applications", "Web Applications", "Enterprise Solutions", "Cloud Migration"],
    employeeCount: "50-200",
    location: "San Francisco, CA",
    email: "contact@techvision.com",
    phone: "",
    website: "www.techvision.com",
    hiring: true,
    openPositions: 8,
    rating: 4.7,
    reviewCount: 87,
    portfolioImages: [
      { url: 'https://picsum.photos/800/600?random=101', title: 'Office', description: 'Our main office building' },
      { url: 'https://picsum.photos/800/600?random=102', title: 'Team', description: 'Our team at work' },
      { url: 'https://picsum.photos/800/600?random=103', title: 'Project', description: 'Recent project highlight' },
    ],
    coverImage: 'https://picsum.photos/1200/300?random=201',
    hourlyRate: '$120',
    about: 'We are a leading provider of innovative software solutions, helping businesses achieve digital transformation and operational excellence.',
    recentProjects: [
      { name: 'AI-Powered Analytics Platform', description: 'Developed a scalable analytics platform using AI/ML for real-time business insights.', technologies: ['AI', 'ML', 'Cloud'], year: '2023' },
      { name: 'Mobile App Suite', description: 'Launched a suite of mobile apps for enterprise clients.', technologies: ['React Native', 'AWS'], year: '2022' }
    ],
    packages: [
      {
        id: 'basic',
        name: 'Basic' as 'Basic',
        description: 'Basic service package for TechVision Solutions: includes essential software setup and support.',
        price: 1000,
        timeline: '1-2 weeks',
        features: [
          'Initial consultation',
          'Basic software setup',
          'Email support'
        ]
      },
      {
        id: 'pro',
        name: 'Pro' as 'Pro',
        description: 'Pro service package for TechVision Solutions: includes advanced features and priority support.',
        price: 3000,
        timeline: '2-4 weeks',
        features: [
          'All Basic features',
          'Advanced configuration',
          'Priority email support',
          'Monthly progress reports'
        ]
      },
      {
        id: 'premium',
        name: 'Premium' as 'Premium',
        description: 'Premium service package for TechVision Solutions: full customization, dedicated manager, and 24/7 support.',
        price: 6000,
        timeline: '4-8 weeks',
        features: [
          'All Pro features',
          'Full customization',
          'Dedicated account manager',
          '24/7 support'
        ]
      }
    ],
  }
];

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
      className="company-logo"
      onError={() => setLogoError(true)}
    />
  );
};

const Companies: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState(COMPANIES);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingTarget, setBookingTarget] = useState<null | typeof COMPANIES[0]>(null);
  const [selectedPackage, setSelectedPackage] = useState<null | ServicePackage>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [showThankYouModal, setShowThankYouModal] = useState(false);

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
          onClick={() => setSelectedDate(date.toISOString())}
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

  // Function to calculate relevance score for a company based on search query
  const calculateRelevanceScore = (company: typeof COMPANIES[0], query: string) => {
    const searchTerms = query.toLowerCase().split(' ');
    let score = 0;

    searchTerms.forEach(term => {
      // Check company name
      if (company.name.toLowerCase().includes(term)) score += 5;
      
      // Check industry
      if (company.industry.toLowerCase().includes(term)) score += 4;
      
      // Check specialties
      company.specialties.forEach(specialty => {
        if (specialty.toLowerCase().includes(term)) score += 3;
      });
      
      // Check keywords
      if (company.keywords) {
        company.keywords.forEach(keyword => {
          if (keyword.toLowerCase().includes(term)) score += 2;
        });
      }

      // Check work types
      company.workTypes.forEach(workType => {
        if (workType.toLowerCase().includes(term)) score += 3;
      });
    });

    return score;
  };

  // Function to get search suggestions based on current input
  const getSearchSuggestions = (input: string) => {
    if (!input) return [];

    const allTerms = COMPANIES.flatMap(company => [
      ...company.specialties,
      ...company.workTypes,
      company.industry
    ]);

    const uniqueTerms = Array.from(new Set(allTerms));
    return uniqueTerms
      .filter(term => term.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredCompanies(COMPANIES);
      setSearchSuggestions([]);
      return;
    }

    const scored = COMPANIES.map(company => ({
      company,
      score: calculateRelevanceScore(company, searchQuery)
    }));

    const filtered = scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.company);

    setFilteredCompanies(filtered.length > 0 ? filtered : []);
    setSearchSuggestions([]);
  };

  useEffect(() => {
    const suggestions = getSearchSuggestions(searchQuery);
    setSearchSuggestions(suggestions);
  }, [searchQuery]);

  // Handler for Book Us
  const handleBook = (company: typeof COMPANIES[0]) => {
    setBookingTarget(company);
    setShowBooking(true);
  };

  // Handler for Message Us
  const handleMessage = (companyId: string) => {
    navigate(`/message/company/${companyId}`);
  };

  const handleConfirmBooking = () => {
    if (!bookingTarget || !selectedPackage || !selectedDate || !selectedTime) return;
    const booking = {
      id: Date.now(),
      type: 'company',
      targetId: bookingTarget.id,
      targetName: bookingTarget.name,
      package: selectedPackage,
      date: selectedDate,
      time: selectedTime,
      notes: '', // Add notes field if you have a notes input
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existing, booking]));
    setShowBooking(false);
    setShowThankYouModal(true);
    setSelectedPackage(null);
    setSelectedDate(null);
    setSelectedTime('');
    setTimeout(() => setShowThankYouModal(false), 3000);
  };

  return (
    <div className="with-navbar-padding">
      <div className="companies-container">
        <div style={{ marginBottom: '1rem' }}>
        </div>
        <div className="search-section">
          <h1>Discover Top Companies</h1>
          <Paper elevation={4} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4, maxWidth: 600, mx: 'auto', mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', position: 'relative' }}>
            <Box component="form" onSubmit={e => { e.preventDefault(); handleSearch(); }} sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by type of work (e.g., 'mobile app development', 'web design'...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                  ),
                }}
                sx={{ background: '#fff', borderRadius: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ borderRadius: 2, px: 4, fontWeight: 600, boxShadow: 2, textTransform: 'none' }}
                endIcon={<SearchIcon />}
              >
                Search
              </Button>
            </Box>
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
                    }}
                  >
                    {suggestion}
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </div>

        <div className="companies-grid">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map(company => {
              return (
                <React.Fragment key={company.id}>
                  <Link to={`/company/${company.id}`} className="company-card-link">
                  <div className="company-card">
                    <div className="company-header">
                      {company.hiring && (
                        <div className="hiring-badge">
                          {company.openPositions} Open Positions
                        </div>
                      )}
                      <div className="company-info-wrapper">
                        <CompanyLogo logo={company.logo || ''} name={company.name} />
                        <div className="company-basic-info">
                          <h2>{company.name}</h2>
                          <div className="company-review-stars">
                            <span className="stars">
                              {[1,2,3,4,5].map(n => (
                                <svg
                                  key={n}
                                  width="18"
                                  height="18"
                                  viewBox="0 0 20 20"
                                  fill={n <= Math.round(company.rating || 0) ? '#FBBF24' : '#E5E7EB'}
                                  stroke="#FBBF24"
                                  style={{ marginRight: 2 }}
                                >
                                  <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                                </svg>
                              ))}
                              <span className="rating-value">{company.rating?.toFixed(1) ?? '4.6'}</span>
                              <span className="review-count" style={{ marginLeft: 6 }}>({company.reviewCount ?? 0})</span>
                            </span>
                          </div>
                          <p className="industry">{company.industry}</p>
                          <p className="employee-count">{company.employeeCount} employees</p>
                        </div>
                      </div>
                    </div>
                    <div className="company-details">
                      <div className="work-types">
                        <h3>Services</h3>
                        <div className="work-types-list">
                          {company.workTypes.map((workType, index) => (
                            <span key={index} className="work-type-tag">{workType}</span>
                          ))}
                        </div>
                      </div>
                      <div className="rate-section">
                        <span className="rate-label">Rate:</span> <span className="rate-value">{company.hourlyRate}/hr</span>
                      </div>
                      <div className="package-section">
                          <span className="package-label">5-Hour Package:</span> <span className="package-value">{company.hourlyRate ? (parseInt(company.hourlyRate.replace('$','')) * 5 * 0.9).toFixed(0) : '-'}</span> <span className="package-discount">(Save 10%)</span>
                      </div>
                      <div className="contact-info">
                        <div className="info-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{company.location}</span>
                        </div>
                        <div className="info-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 2L11 13" />
                            <path d="M22 2L15 22l-4-9l-9-4l22-7z" />
                          </svg>
                          <span>{company.email}</span>
                        </div>
                        <div className="info-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                          </svg>
                          <span>{company.website}</span>
                        </div>
                      </div>
                      <div className="action-buttons">
                        <button className="book-button" onClick={e => { e.preventDefault(); handleBook(company); }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                          </svg>
                          Book Us
                        </button>
                        <button className="message-button" onClick={e => { e.preventDefault(); handleMessage(company.id); }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                          </svg>
                          Message Us
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
                  {/* Package buttons outside the Link, always visible */}
                  {company.packages && company.packages.length > 0 && (
                    <div className="package-buttons" style={{ margin: '0 0 1.5rem 0' }}>
                      {company.packages.map((pkg) => (
                        <button
                          key={pkg.id}
                          className={`package-button ${pkg.name.toLowerCase()}`}
                          onClick={e => {
                            e.preventDefault();
                            setBookingTarget(company);
                            setSelectedPackage(pkg);
                            setShowBooking(true);
                          }}
                        >
                          {pkg.name}
                        </button>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <div className="no-results">
              <h3>No companies found matching your search criteria</h3>
              <p>Try different keywords or browse all companies</p>
            </div>
          )}
        </div>
        {/* Booking Modal */}
        {showBooking && bookingTarget && selectedPackage && (
          <div className="booking-modal-overlay" onClick={() => setShowBooking(false)}>
            <div className="booking-modal" onClick={e => e.stopPropagation()}>
              <h3>Book {bookingTarget.name} - {selectedPackage.name} Package</h3>
              <div className="package-details">
                <div><strong>Description:</strong> {selectedPackage.description}</div>
                <div><strong>Price:</strong> ${selectedPackage.price}</div>
                <div><strong>Timeline:</strong> {selectedPackage.timeline}</div>
                <div><strong>Features:</strong>
                  <ul>
                    {selectedPackage.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
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
                <button onClick={handleConfirmBooking}>Confirm Booking</button>
                <button onClick={() => setShowBooking(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {showThankYouModal && (
          <div className="thank-you-modal">
            <h3>Booking Confirmed!</h3>
            <p>Thank you for booking with us!</p>
            <button onClick={() => setShowThankYouModal(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies; 