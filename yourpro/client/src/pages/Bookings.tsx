import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './Bookings.css';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TimelineIcon from '@mui/icons-material/Timeline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import NotesIcon from '@mui/icons-material/Notes';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ChatIcon from '@mui/icons-material/Chat';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { MOCK_USER } from '../data/userData';

interface Booking {
  id: number;
  type: 'freelancer' | 'company';
  targetId: number;
  targetName: string;
  package: {
    id: string;
    name: string;
    description: string;
    price: number;
    timeline: string;
    features: string[];
  };
  date: string;
  time: string;
  status: string;
  createdAt: string;
  notes?: string;
}

const Bookings: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateType, setDateType] = useState<'createdAt' | 'date'>('createdAt');
  const [dateFilter, setDateFilter] = useState('');
  const [confirmBuyId, setConfirmBuyId] = useState<number | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(savedBookings);
  }, []);

  const handleCancelBooking = (bookingId: number) => {
    const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
  };

  const handleBuyNow = (bookingId: number) => {
    setConfirmBuyId(bookingId);
  };

  const handleConfirmBuy = () => {
    if (confirmBuyId === null) return;
    const updatedBookings = bookings.map(b =>
      b.id === confirmBuyId ? { ...b, status: 'confirmed' } : b
    );
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    // Add to clients if not already present
    const confirmedBooking = bookings.find(b => b.id === confirmBuyId);
    if (confirmedBooking) {
      const clients = JSON.parse(localStorage.getItem('clients') || '[]');
      const exists = clients.some((c: any) => c.bookingId === confirmedBooking.id);
      if (!exists) {
        // Get client data from MOCK_USER
        const newClient = {
          id: MOCK_USER.id,
          bookingId: confirmedBooking.id,
          targetId: confirmedBooking.targetId,
          type: confirmedBooking.type,
          name: MOCK_USER.name,
          avatar: MOCK_USER.avatar,
          project: confirmedBooking.package.id === 'quote' ? confirmedBooking.package.description : confirmedBooking.package.name,
          date: confirmedBooking.date,
          time: confirmedBooking.time,
          status: 'active',
          createdAt: confirmedBooking.createdAt,
          contact: MOCK_USER.email,
          phone: MOCK_USER.phone,
          location: MOCK_USER.location,
          // Add process data for the Processes page
          process: [{
            status: 'in-progress',
            date: new Date().toISOString(),
            description: 'Project started'
          }],
          dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), // Set due date to 30 days from now
          joined: new Date().toISOString()
        };
        clients.push(newClient);
        localStorage.setItem('clients', JSON.stringify(clients));
      }
    }
    setConfirmBuyId(null);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 2500);
  };

  const handleDeclineOffer = (bookingId: number) => {
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'declined' } : b
    );
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.targetName.toLowerCase().includes(search.toLowerCase()) ||
      booking.package.name.toLowerCase().includes(search.toLowerCase()) ||
      (booking.notes || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesDate = !dateFilter ||
      (dateType === 'createdAt'
        ? format(new Date(booking.createdAt), 'yyyy-MM-dd') === dateFilter
        : format(new Date(booking.date), 'yyyy-MM-dd') === dateFilter);
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="with-navbar-padding" style={{ padding: '6rem 0 2rem 0', background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2563eb', fontWeight: 800, letterSpacing: 1 }}>My Bookings</h1>
      <Paper elevation={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, borderRadius: 3, boxShadow: 3, mb: 4, maxWidth: 900, mx: 'auto', background: '#f8fafc' }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
          <TextField
            label="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="medium"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ChatIcon sx={{ color: '#2563eb' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2, background: '#fff' }
            }}
            sx={{ minWidth: 200, borderRadius: 2, background: '#fff' }}
          />
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            size="medium"
            variant="outlined"
            sx={{ minWidth: 140, borderRadius: 2, background: '#fff' }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="declined">Declined</MenuItem>
          </TextField>
          <TextField
            select
            label="Date Type"
            value={dateType}
            onChange={e => setDateType(e.target.value as 'createdAt' | 'date')}
            size="medium"
            variant="outlined"
            sx={{ minWidth: 160, borderRadius: 2, background: '#fff' }}
          >
            <MenuItem value="createdAt">Date Requested</MenuItem>
            <MenuItem value="date">Date Chosen</MenuItem>
          </TextField>
          <TextField
            label={dateType === 'createdAt' ? 'Requested On' : 'Chosen Date'}
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            size="medium"
            variant="outlined"
            sx={{ minWidth: 170, borderRadius: 2, background: '#fff' }}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </Paper>
      {filteredBookings.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: '#6b7280', fontSize: '1.2rem' }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#e0e7ff', mb: 2 }} />
          <p>You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div className="bookings-grid" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {filteredBookings.map(booking => (
            <div key={booking.id} className="booking-card" style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(16px)',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(37,99,235,0.08)',
              overflow: 'hidden',
              border: '1.5px solid #e0e7ff',
              marginBottom: 24,
              transition: 'transform 0.18s, box-shadow 0.18s',
              position: 'relative',
            }}>
              <div className="booking-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(37,99,235,0.07)', padding: '1.2rem 1.5rem', borderBottom: '1px solid #e0e7ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ListAltIcon sx={{ color: '#2563eb', fontSize: 28 }} />
                  <h3 style={{ margin: 0, color: '#1a1a1a', fontWeight: 700, fontSize: '1.2rem' }}>{booking.package.name} Package</h3>
                </div>
                <span className={`status ${booking.status}`} style={{
                  background: booking.status === 'confirmed' ? '#e6f4ea' : '#fbe9e7',
                  color: booking.status === 'confirmed' ? '#059669' : '#d32f2f',
                  padding: '0.35rem 1.1rem',
                  borderRadius: 20,
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'capitalize',
                  letterSpacing: 0.5,
                  boxShadow: '0 1px 4px #e0e7ff',
                }}>{booking.status}</span>
              </div>
              <div className="booking-details" style={{ padding: '1.5rem 1.5rem 1rem 1.5rem' }}>
                <p style={{ margin: '0.5rem 0', color: '#374151', fontWeight: 500 }}>
                  <strong>Provider:</strong>{' '}
                  <Link to={`/${booking.type}/${booking.targetId}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 700 }}>{booking.targetName}</Link>
                </p>
                <p style={{ margin: '0.5rem 0', color: '#374151' }}>
                  <MonetizationOnIcon sx={{ color: '#2563eb', fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
                  <strong>Price:</strong> ${booking.package.price}
                </p>
                {booking.package.id === 'quote' && (
                  <>
                    {booking.package.description && (
                      <p style={{ margin: '0.5rem 0', color: '#374151' }}>
                        <NotesIcon sx={{ color: '#2563eb', fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
                        <strong>Request Note:</strong> {booking.package.description}
                      </p>
                    )}
                    {booking.package.features && booking.package.features.length > 0 && (
                      <div style={{ margin: '0.5rem 0' }}>
                        <strong>Offer Features:</strong>
                        <ul style={{ margin: '0.2rem 0 0 1.5rem', padding: 0 }}>
                          {booking.package.features.map((feature: string, idx: number) => (
                            <li key={idx} style={{ color: '#374151', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <CheckCircleIcon sx={{ color: '#059669', fontSize: 18, mr: 1 }} /> {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {booking.package.timeline && (
                      <p style={{ margin: '0.5rem 0', color: '#374151' }}>
                        <TimelineIcon sx={{ color: '#059669', fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
                        <strong>Time Plan:</strong> {booking.package.timeline}
                      </p>
                    )}
                  </>
                )}
                <p style={{ margin: '0.5rem 0', color: '#374151' }}>
                  <strong>Date:</strong> {format(new Date(booking.date), 'MMMM d, yyyy')}
                  {' '}<strong>at</strong> {booking.time}
                </p>
                {booking.notes && (
                  <p style={{ margin: '0.5rem 0', color: '#374151' }}>
                    <NotesIcon sx={{ color: '#2563eb', fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
                    <strong>Notes:</strong> {booking.notes}
                  </p>
                )}
                <div style={{ margin: '0.5rem 0 0.5rem 0' }}>
                  <strong>Features:</strong>
                  <ul style={{ margin: '0.2rem 0 0 1.5rem', padding: 0 }}>
                    {booking.package.features.map((feature: string, idx: number) => (
                      <li key={idx} style={{ color: '#374151', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircleIcon sx={{ color: '#059669', fontSize: 18, mr: 1 }} /> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="booking-actions" style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e0e7ff', display: 'flex', justifyContent: 'flex-end', background: 'rgba(37,99,235,0.03)' }}>
                {booking.package.id === 'quote' && (booking.status === 'pending' || booking.status === 'offered') && booking.package.features && booking.package.features.length > 0 && (
                  <>
                    <Button variant="contained" color="primary" sx={{ mr: 2, borderRadius: 2, fontWeight: 700 }} onClick={() => handleBuyNow(booking.id)}>
                      Buy Now
                    </Button>
                    <Button variant="outlined" color="error" sx={{ borderRadius: 2, fontWeight: 700 }} onClick={() => handleDeclineOffer(booking.id)}>
                      Decline Offer
                    </Button>
                  </>
                )}
                <button
                  className="cancel-button"
                  style={{ background: '#f8f9fa', color: '#dc3545', fontWeight: 600, borderRadius: 8, border: 'none', padding: '0.6rem 1.3rem', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Buy Now Confirmation Dialog */}
      <Dialog open={!!confirmBuyId} onClose={() => setConfirmBuyId(null)}>
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent>Are you sure you want to continue with this purchase?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmBuyId(null)} color="inherit">Cancel</Button>
          <Button onClick={handleConfirmBuy} color="primary" variant="contained">Yes, Buy Now</Button>
        </DialogActions>
      </Dialog>
      {/* Thank You Message */}
      <Dialog open={showThankYou} onClose={() => setShowThankYou(false)}>
        <DialogTitle>Thank You!</DialogTitle>
        <DialogContent>Your purchase was successful.</DialogContent>
      </Dialog>
    </div>
  );
};

export default Bookings; 