import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FREELANCERS, Freelancer } from './Freelancers';
import { COMPANIES } from './Companies';
import './CombinedResults.css';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Theme } from '@mui/material/styles';

// Helper to get query param
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface StarRatingProps {
  rating: number;
}

// Star rating component
const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`star ${star <= rating ? 'filled' : ''}`}>★</span>
      ))}
    </div>
  );
};

// Haversine formula for distance between two lat/lng points
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Dummy geocode function (replace with real geocoding API for production)
const cityToLatLng: Record<string, [number, number]> = {
  'San Francisco, CA': [37.7749, -122.4194],
  'New York, NY': [40.7128, -74.0060],
  'Boston, MA': [42.3601, -71.0589],
  'Seattle, WA': [47.6062, -122.3321],
  'Austin, TX': [30.2672, -97.7431],
  'Miami, FL': [25.7617, -80.1918],
  'Montreal, CA': [45.5017, -73.5673],
  'Los Angeles, CA': [34.0522, -118.2437],
  'Chicago, IL': [41.8781, -87.6298],
  'Berlin, DE': [52.52, 13.405],
  'Stockholm, SE': [59.3293, 18.0686],
  'Barcelona, ES': [41.3851, 2.1734],
  'Cambridge, UK': [52.2053, 0.1218],
  'Tokyo, JP': [35.6895, 139.6917],
  'Munich, DE': [48.1351, 11.582],
  'Tel Aviv, Israel': [32.0853, 34.7818],
  'Haifa, Israel': [32.7940, 34.9896],
  'Jerusalem, Israel': [31.7683, 35.2137],
  'Rishon LeZion, Israel': [31.9730, 34.7925],
  'Beer Sheva, Israel': [31.2518, 34.7913],
  // Add more as needed
};

const radiusOptions = [5, 10, 25, 50, 100, 200];

// Helper to get initials from company name
function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface MapDialogTransitionProps extends TransitionProps {
  children: React.ReactElement;
}

const MapDialogTransition = React.forwardRef(function Transition(
  props: MapDialogTransitionProps,
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface CombinedResultItem extends Partial<Freelancer> {
  _type: 'freelancer' | 'company';
  id: number;
  name: string;
  location: string;
  rating?: number;
  reviewCount?: number;
  hourlyRate?: string;
  title?: string;
  industry?: string;
  skills?: string[];
  specialties?: string[];
  avatar?: string;
  logo?: string;
}

const CombinedResults: React.FC = () => {
  const query = useQuery();
  const initialQuery = query.get('query') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(25);
  const [filteredFreelancers, setFilteredFreelancers] = useState<Freelancer[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const [bookingType, setBookingType] = useState<'freelancer' | 'company' | null>(null);
  const [bookingTarget, setBookingTarget] = useState<CombinedResultItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [mapOpen, setMapOpen] = useState(false);

  // Get lat/lng for a city string
  const getLatLng = (city: string) => cityToLatLng[city] || null;

  // Search/filter logic (reuse from Freelancers/Companies)
  useEffect(() => {
    // Filter freelancers
    let freelancers = FREELANCERS.filter(f => {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        f.skills.some(s => s.toLowerCase().includes(q)) ||
        f.skills.some(s => s.toLowerCase().includes(q)) ||
        f.skills.some(s => s.toLowerCase().includes(q))
      );
    });
    // Filter companies
    let companies = COMPANIES.filter((c: any) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.specialties.some((s: string) => s.toLowerCase().includes(q)) ||
        c.workTypes.some((w: string) => w.toLowerCase().includes(q))
      );
    });
    // Location + radius filter
    if (location && getLatLng(location)) {
      const [lat1, lon1] = getLatLng(location);
      freelancers = freelancers.filter(f => {
        const loc = getLatLng(f.location);
        if (!loc) return false;
        const [lat2, lon2] = loc;
        return getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) <= radius;
      });
      companies = companies.filter((c: any) => {
        const loc = getLatLng(c.location);
        if (!loc) return false;
        const [lat2, lon2] = loc;
        return getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) <= radius;
      });
    }
    setFilteredFreelancers(freelancers);
    setFilteredCompanies(companies);
  }, [searchQuery, location, radius]);

  // All unique locations for dropdown
  const allLocations = Array.from(new Set([
    ...FREELANCERS.map(f => f.location),
    ...COMPANIES.map((c: any) => c.location)
  ]));

  // Calendar helpers (reuse from profile pages)
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

  // Handlers
  const handleBook = (type: 'freelancer' | 'company', target: CombinedResultItem) => {
    setBookingType(type);
    setBookingTarget(target);
    setShowBooking(true);
    setSelectedDate(null);
    setSelectedTime('');
    setCalendarMonth(() => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), 1);
    });
  };
  const handleMessage = (type: 'freelancer' | 'company', id: number) => {
    navigate(`/message/${type}/${id}`);
  };

  // Merge freelancers and companies into a single array for display
  const combinedResults: CombinedResultItem[] = [
    ...filteredFreelancers.map(f => ({ ...f, _type: 'freelancer' as const })),
    ...filteredCompanies.map(c => ({ ...c, _type: 'company' as const })),
  ];

  // Optionally, sort combinedResults by relevance, rating, or name
  // combinedResults.sort((a, b) => ...);

  // Custom icon for markers
  const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  return (
    <div className="with-navbar-padding">
      <div className="results-container">
        <div className="combined-search-bar">
          <input
            type="text"
            placeholder="Search for skills, companies, or services..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <select value={location} onChange={e => setLocation(e.target.value)}>
            <option value="">Choose location (optional)</option>
            {allLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <select value={radius} onChange={e => setRadius(Number(e.target.value))}>
            {radiusOptions.map(r => (
              <option key={r} value={r}>{r} km</option>
            ))}
          </select>
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setMapOpen(true)}
              sx={{ fontWeight: 600 }}
            >
              Show on Map
            </Button>
          </Box>
        </div>
        <div className="results-grid-horizontal">
          {combinedResults.length === 0 ? <p>No results found.</p> : (
            combinedResults.map((item: CombinedResultItem) => {
              const isFreelancer = item._type === 'freelancer';
              const price = item.hourlyRate ? parseInt(item.hourlyRate.replace('$','')) : null;
              const packageDeal = price ? Math.round(price * 5 * 0.9) : null;
              return (
                <Link to={`/${isFreelancer ? 'freelancer' : 'company'}/${item.id}`} key={item.id + item._type} className="result-card-link" style={{ textDecoration: 'none' }}>
                  <Card
                    sx={{
                      minWidth: 320,
                      maxWidth: 370,
                      borderRadius: 3,
                      boxShadow: 4,
                      mb: 2,
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      transition: 'box-shadow 0.2s, transform 0.2s',
                      '&:hover': {
                        boxShadow: 8,
                        transform: 'translateY(-6px) scale(1.03)',
                      },
                    }}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2.5 }}>
                        <Avatar
                          src={isFreelancer ? item.avatar : item.logo}
                          alt={item.name}
                          sx={{ width: 60, height: 60, borderRadius: isFreelancer ? '50%' : 2, boxShadow: 1 }}
                        >
                          {!isFreelancer && item.name ? getInitials(item.name) : ''}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Chip
                            label={isFreelancer ? 'Freelancer' : 'Company'}
                            color={isFreelancer ? 'primary' : 'secondary'}
                            size="small"
                            sx={{ fontWeight: 600, letterSpacing: 0.5, mb: 1.2 }}
                          />
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#23236a', mb: 0.7, mt: 0.2 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b', mb: 0.7 }}>
                            {isFreelancer ? item.title : item.industry} &mdash; {item.location}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StarRating rating={item.rating || 4.5} />
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>({item.reviewCount || 12} reviews)</Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 1.5 }} />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, mb: 2.2 }}>
                        {(isFreelancer ? item.skills || [] : item.specialties || []).slice(0, 4).map((s: string) => (
                          <Chip key={s} label={s} size="small" sx={{ background: '#e6f3ff', color: '#2563eb', fontWeight: 500 }} />
                        ))}
                      </Box>
                      {price && (
                        <Box sx={{ mt: 1.5, mb: 2.2 }}>
                          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 1 }}>
                            Rate: <span style={{ color: '#2563eb', fontWeight: 700 }}>${price}/hr</span>
                          </Typography>
                          <Box sx={{
                            mt: 1,
                            background: '#e6f7ed',
                            border: '2px solid #34a853',
                            borderRadius: 2,
                            px: 1.5,
                            py: 0.7,
                            maxWidth: 180,
                            color: '#34a853',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            textAlign: 'center',
                            mx: 'auto',
                            display: 'block',
                          }}>
                            5-Hour Package: ${packageDeal} <span style={{ fontWeight: 500, fontSize: '0.95rem', color: '#34a853', background: '#b7ebc9', borderRadius: 6, padding: '0.1rem 0.4rem', marginLeft: 6 }}>(Save 10%)</span>
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                    <CardActions sx={{ pt: 0, pb: 1, px: 2, display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', flex: 1 }}
                        startIcon={
                          <svg viewBox="0 0 24 24" width="18" height="18">
                            <path fill="none" stroke="currentColor" strokeWidth="2" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                          </svg>
                        }
                        onClick={e => { e.preventDefault(); handleBook(item._type, item); }}
                      >
                        {isFreelancer ? 'Book Me' : 'Book Us'}
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', flex: 1 }}
                        startIcon={
                          <svg viewBox="0 0 24 24" width="18" height="18">
                            <path fill="none" stroke="currentColor" strokeWidth="2" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                          </svg>
                        }
                        onClick={e => { e.preventDefault(); handleMessage(item._type, item.id); }}
                      >
                        {isFreelancer ? 'Message Me' : 'Message Us'}
                      </Button>
                    </CardActions>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
        {/* Booking Modal */}
        {showBooking && bookingTarget && (
          <div className="booking-modal-overlay" onClick={() => setShowBooking(false)}>
            <div className="booking-modal" onClick={e => e.stopPropagation()}>
              <h3>Book {bookingType === 'freelancer' ? bookingTarget.name : bookingTarget.name}</h3>
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
        <Dialog
          open={mapOpen}
          onClose={() => setMapOpen(false)}
          maxWidth="md"
          fullWidth
          TransitionComponent={MapDialogTransition}
        >
          <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700, color: '#23236a' }}>
            Freelancers & Companies Map
            <IconButton
              aria-label="close"
              onClick={() => setMapOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <div style={{ height: 500, width: '100%' }}>
            <MapContainer center={[32.0853, 34.7818]} zoom={2} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {combinedResults.map((item: CombinedResultItem) => {
                const loc = cityToLatLng[item.location];
                if (!loc) return null;
                return (
                  <Marker key={item.id + item._type} position={loc} icon={markerIcon}>
                    <Popup>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          src={item._type === 'freelancer' ? item.avatar : item.logo}
                          alt={item.name}
                          sx={{ width: 40, height: 40, borderRadius: item._type === 'freelancer' ? '50%' : 2, boxShadow: 1 }}
                        >
                          {item._type === 'company' && item.name ? getInitials(item.name) : ''}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#23236a' }}>{item.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>{item._type === 'freelancer' ? item.title : item.industry}</Typography>
                        </Box>
                      </Box>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default CombinedResults; 