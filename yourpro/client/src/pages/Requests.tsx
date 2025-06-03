import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent, Typography, Button, Grid, Box, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel, Tooltip, Stack, Paper, InputAdornment } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TimelineIcon from '@mui/icons-material/Timeline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import NotesIcon from '@mui/icons-material/Notes';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ChatIcon from '@mui/icons-material/Chat';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import { MOCK_USER } from '../data/userData';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import MenuItem from '@mui/material/MenuItem';
import './Requests.css';
import SearchIcon from '@mui/icons-material/Search';

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

const Requests: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [requests, setRequests] = useState<Booking[]>([]);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<{ from: 'me' | 'client'; text: string; time: string }[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Booking | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'decline' | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateType, setDateType] = useState<'createdAt' | 'date'>('createdAt');
  const [dateFilter, setDateFilter] = useState('');
  const [listView, setListView] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerRequestId, setOfferRequestId] = useState<number | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerTimeRange, setOfferTimeRange] = useState('');
  const [offerFeatures, setOfferFeatures] = useState('');
  const [offerTimePlan, setOfferTimePlan] = useState('');
  const [showOfferConfirm, setShowOfferConfirm] = useState(false);
  const [showOfferThankYou, setShowOfferThankYou] = useState(false);

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    // Set status to 'pending' if missing
    const normalized = savedBookings.map((r: any) => ({ ...r, status: r.status || 'pending' }));
    setRequests(normalized);

    // Check if we need to scroll to a specific booking (using React Router location state)
    if (location.state && (location.state as any).scrollToBooking) {
      const scrollToBooking = (location.state as any).scrollToBooking;
      setTimeout(() => {
        const element = document.getElementById(`booking-${scrollToBooking}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add a highlight effect
          element.classList.add('highlight-booking');
          setTimeout(() => element.classList.remove('highlight-booking'), 2000);
        }
      }, 100);
    }
  }, [location.state]);

  const handleAccept = (id: number) => {
    setSelectedRequest(requests.find(r => r.id === id) || null);
    setActionType('accept');
    setShowConfirmModal(true);
  };

  const handleDecline = (id: number) => {
    setSelectedRequest(requests.find(r => r.id === id) || null);
    setActionType('decline');
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    if (!selectedRequest || !actionType) return;

    const updated = requests.map(r => {
      if (r.id === selectedRequest.id) {
        return { ...r, status: actionType === 'accept' ? 'confirmed' : 'declined' };
      }
      return r;
    });
    setRequests(updated);
    localStorage.setItem('bookings', JSON.stringify(updated));
    setShowConfirmModal(false);
    setActionType(null);
    setSelectedRequest(null);
  };

  const handleCancelAction = () => {
    setShowConfirmModal(false);
    setActionType(null);
    setSelectedRequest(null);
  };

  const handleOpenMessage = () => {
    setMessages([
      { from: 'client', text: `Hi, this is ${MOCK_USER.name}.`, time: new Date().toISOString() },
    ]);
    setMessageOpen(true);
  };
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setMessages(prev => [...prev, { from: 'me', text: messageInput, time: new Date().toISOString() }]);
    setMessageInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'client', text: 'Thank you for your message!', time: new Date().toISOString() }]);
    }, 1000);
  };

  const handleMessage = (request: Booking) => {
    navigate(`/message/${request.type}/${request.targetId}`, {
      state: {
        recipientName: request.targetName,
        bookingId: request.id
      }
    });
  };

  const handleSendOffer = (requestId: number) => {
    setOfferRequestId(requestId);
    setOfferModalOpen(true);
    setOfferPrice('');
    setOfferTimeRange('');
    setOfferFeatures('');
    setOfferTimePlan('');
  };

  const handleConfirmSendOffer = () => {
    setShowOfferConfirm(true);
  };

  const handleActuallySendOffer = () => {
    if (offerRequestId == null) return;
    // Update booking in localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updated = bookings.map((b: any) => {
      if (b.id === offerRequestId) {
        return {
          ...b,
          package: {
            ...b.package,
            price: offerPrice,
            timeline: offerTimeRange,
            features: offerFeatures.split(/\n|,/).map((f: string) => f.trim()).filter(Boolean),
          },
          offer: {
            price: offerPrice,
            timeRange: offerTimeRange,
            features: offerFeatures,
            timePlan: offerTimePlan,
            sentAt: new Date().toISOString(),
          },
          status: 'offered',
        };
      }
      return b;
    });
    localStorage.setItem('bookings', JSON.stringify(updated));
    setRequests(updated);
    setShowOfferConfirm(false);
    setOfferModalOpen(false);
    setShowOfferThankYou(true);
    setTimeout(() => setShowOfferThankYou(false), 2500);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.targetName.toLowerCase().includes(search.toLowerCase()) ||
      request.package.name.toLowerCase().includes(search.toLowerCase()) ||
      (request.notes || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesDate = !dateFilter ||
      (dateType === 'createdAt'
        ? format(new Date(request.createdAt), 'yyyy-MM-dd') === dateFilter
        : format(new Date(request.date), 'yyyy-MM-dd') === dateFilter);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const renderRequestCard = (request: Booking) => (
    <Card 
      id={`booking-${request.id}`}
      className="request-card" 
      sx={{ 
        mb: 4, 
        borderRadius: 4, 
        boxShadow: 4, 
        background: 'rgba(255,255,255,0.92)', 
        backdropFilter: 'blur(12px)', 
        p: 0,
        transition: 'all 0.3s ease',
        '&.highlight-booking': {
          boxShadow: '0 0 0 4px #4f46e5',
          transform: 'scale(1.02)'
        }
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Grid container alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Grid item>
            <Avatar src={MOCK_USER.avatar} alt={MOCK_USER.name} sx={{ width: 56, height: 56 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>{MOCK_USER.name}</Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>{MOCK_USER.email}</Typography>
          </Grid>
          <Grid item>
            <Chip label={request.status} color={request.status === 'confirmed' ? 'success' : request.status === 'declined' ? 'error' : 'warning'} sx={{ fontWeight: 700, fontSize: 15, textTransform: 'capitalize', px: 2, py: 1 }} />
          </Grid>
        </Grid>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ mb: 3 }}>
          <Stack spacing={2} flex={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2563eb' }}>{request.package.name} Package</Typography>
            <Typography variant="body2" sx={{ color: '#374151' }}>{request.package.description}</Typography>
            <Typography variant="body2" sx={{ color: '#222', fontWeight: 600 }}>Provider: {request.targetName}</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <MonetizationOnIcon sx={{ color: '#2563eb' }} />
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#2563eb' }}>${request.package.price}</Typography>
              <TimelineIcon sx={{ color: '#059669' }} />
              <Typography variant="body2" sx={{ color: '#059669', fontWeight: 600 }}>{request.package.timeline}</Typography>
            </Stack>
          </Stack>
          <Stack spacing={1.5} flex={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>Features:</Typography>
            <Stack spacing={1} component="ul" sx={{ pl: 2, m: 0 }}>
              {request.package.features.map((feature: string, idx: number) => (
                <Stack direction="row" alignItems="center" spacing={1} component="li" key={idx} sx={{ color: '#374151', fontSize: 15, listStyle: 'none', p: 0 }}>
                  <CheckCircleIcon sx={{ color: '#059669', fontSize: 18 }} />
                  <span>{feature}</span>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Date & Time:</Typography>
            <Typography variant="body2">{format(new Date(request.date), 'MMMM d, yyyy')} at {request.time}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Order Placed:</Typography>
            <Typography variant="body2">{format(new Date(request.createdAt), 'MMMM d, yyyy, h:mm a')}</Typography>
          </Grid>
          {request.notes && (
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <NotesIcon sx={{ color: '#2563eb', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Notes:</Typography>
                <Typography variant="body2" sx={{ color: '#374151', ml: 1 }}>{request.notes}</Typography>
              </Stack>
            </Grid>
          )}
        </Grid>
        <Box className="request-actions" sx={{ display: 'flex', gap: 1.5, mt: 3, justifyContent: 'center', alignItems: 'center', borderTop: '1px solid #e5e7eb', pt: 2.5 }}>
          {request.status === 'pending' && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleAccept(request.id)}
                size="small"
                sx={{ borderRadius: 2, fontWeight: 600, fontSize: 15, minWidth: 90 }}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => handleDecline(request.id)}
                size="small"
                sx={{ borderRadius: 2, fontWeight: 600, fontSize: 15, minWidth: 90 }}
              >
                Decline
              </Button>
              {request.package.id === 'quote' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSendOffer(request.id)}
                  size="small"
                  sx={{ borderRadius: 2, fontWeight: 600, fontSize: 15, minWidth: 120, background: '#2563eb' }}
                >
                  Send Offer
                </Button>
              )}
            </>
          )}
          <Button
            variant="outlined"
            className="message-button"
            startIcon={<ChatIcon />}
            onClick={() => handleMessage(request)}
            size="medium"
            sx={{ borderRadius: 2, fontWeight: 700, fontSize: 17, minWidth: 220, height: 42, color: '#4f46e5', borderColor: '#e0e7ff', background: '#e0e7ff', '&:hover': { background: '#c7d2fe', borderColor: '#a5b4fc' } }}
          >
            Message
          </Button>
        </Box>
        {request.package.id === 'quote' && request.package.features && request.package.features.length > 0 && (
          <>
            <div style={{ margin: '0.5rem 0' }}>
              <strong>Offer Features:</strong>
              <ul style={{ margin: '0.2rem 0 0 1.5rem', padding: 0 }}>
                {request.package.features.map((feature: string, idx: number) => (
                  <li key={idx} style={{ color: '#374151', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            {request.package.timeline && (
              <p style={{ margin: '0.5rem 0', color: '#374151' }}>
                <strong>Time Plan:</strong> {request.package.timeline}
              </p>
            )}
            {request.status === 'confirmed' && (
              <div style={{ color: '#059669', fontWeight: 700, marginTop: 8 }}>Client Confirmed</div>
            )}
            {request.status === 'declined' && (
              <div style={{ color: '#d32f2f', fontWeight: 700, marginTop: 8 }}>Client Declined</div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderListRow = (request: Booking) => (
    <div key={request.id} className="list-row">
      <img src={MOCK_USER.avatar} alt={MOCK_USER.name} className="list-row-avatar" />
      <div className="list-row-main">
        <span className="list-row-title">{MOCK_USER.name}
          <span className="list-row-status">{request.status}</span>
        </span>
        <span style={{ color: '#666', fontSize: '0.97rem' }}>{MOCK_USER.email}</span>
        <span style={{ color: '#2563eb', fontWeight: 600 }}>{request.package.name} Package</span>
        <span style={{ color: '#374151' }}>{request.package.description}</span>
        <span style={{ color: '#222', fontWeight: 600 }}>Provider: {request.targetName}</span>
        <span style={{ color: '#059669', fontWeight: 500 }}>{request.package.timeline}</span>
        <span style={{ color: '#2563eb', fontWeight: 700 }}>${request.package.price}</span>
        <span style={{ color: '#888' }}>Date: {format(new Date(request.date), 'MMM d, yyyy')} at {request.time}</span>
        {request.notes && <span style={{ color: '#666' }}>Notes: {request.notes}</span>}
      </div>
      <div className="list-row-actions">
        {request.status === 'pending' && (
          <>
            <button className="accept-button" onClick={() => handleAccept(request.id)}>Accept</button>
            <button className="decline-button" onClick={() => handleDecline(request.id)}>Decline</button>
          </>
        )}
        <button className="message-button" onClick={() => handleMessage(request)}>Message</button>
      </div>
    </div>
  );

  return (
    <div className="with-navbar-padding" style={{ padding: '6rem 0 2rem 0', background: 'none', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2563eb', fontWeight: 800, letterSpacing: 1 }}>Requests</h1>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        <Tooltip title={listView ? 'Switch to Grid View' : 'Switch to List View'}>
          <FormControlLabel
            control={
              <Switch
                checked={listView}
                onChange={() => setListView(v => !v)}
                color="primary"
                icon={<ViewModuleIcon />}
                checkedIcon={<ViewListIcon />}
              />
            }
            label={listView ? 'List View' : 'Grid View'}
            labelPlacement="end"
            sx={{ userSelect: 'none', fontWeight: 600 }}
          />
        </Tooltip>
      </Box>
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
                  <SearchIcon sx={{ color: '#2563eb' }} />
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
      {filteredRequests.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: '#6b7280', fontSize: '1.2rem' }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#e0e7ff', mb: 2 }} />
          <p>No requests yet.</p>
        </div>
      ) : (
        <div className={`requests-grid${listView ? ' list-view' : ''}`}>
          {listView
            ? filteredRequests.map(request => renderListRow(request))
            : filteredRequests.map(request => renderRequestCard(request))}
        </div>
      )}
      {/* Message Modal */}
      <Dialog open={messageOpen} onClose={() => setMessageOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={MOCK_USER.avatar} alt={MOCK_USER.name} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{MOCK_USER.name}</Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>{MOCK_USER.email}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ minHeight: 260, background: '#f8f9fa', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
            {messages.map((msg, idx) => (
              <Box key={idx} sx={{ display: 'flex', flexDirection: msg.from === 'me' ? 'row-reverse' : 'row', alignItems: 'center', mb: 1 }}>
                <Avatar src={msg.from === 'me' ? undefined : MOCK_USER.avatar} sx={{ width: 32, height: 32, ml: msg.from === 'me' ? 2 : 0, mr: msg.from === 'me' ? 0 : 2, bgcolor: msg.from === 'me' ? '#2563eb' : undefined, color: msg.from === 'me' ? '#fff' : undefined }}>
                  {msg.from === 'me' ? 'Me' : MOCK_USER.name[0]}
                </Avatar>
                <Box sx={{ background: msg.from === 'me' ? '#2563eb' : '#fff', color: msg.from === 'me' ? '#fff' : '#222', borderRadius: 3, px: 2, py: 1, maxWidth: 320, boxShadow: 1 }}>
                  <Typography variant="body2">{msg.text}</Typography>
                  <Typography variant="caption" sx={{ color: msg.from === 'me' ? '#e0e7ff' : '#888', mt: 0.5, display: 'block', textAlign: msg.from === 'me' ? 'right' : 'left' }}>{format(new Date(msg.time), 'h:mm a')}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
              sx={{ background: '#fff', borderRadius: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ borderRadius: 2, minWidth: 48 }}>
              <SendIcon />
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmModal}
        onClose={handleCancelAction}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
          {actionType === 'accept' ? 'Confirm Acceptance' : 'Confirm Decline'}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', mb: 2 }}>
            Are you sure you want to {actionType === 'accept' ? 'accept' : 'decline'} this request?
            {actionType === 'accept' ? ' This will confirm the booking.' : ' This action cannot be undone.'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="outlined"
            onClick={handleCancelAction}
            fullWidth
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={actionType === 'accept' ? 'success' : 'error'}
            onClick={handleConfirmAction}
            fullWidth
            sx={{ ml: 1 }}
          >
            {actionType === 'accept' ? 'Accept' : 'Decline'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Offer Modal */}
      <Dialog open={offerModalOpen} onClose={() => setOfferModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Offer to Client</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
          <TextField
            label="Price ($)"
            type="number"
            value={offerPrice}
            onChange={e => setOfferPrice(e.target.value)}
            fullWidth
          />
          <TextField
            label="Time Range (e.g. 2-4 weeks)"
            value={offerTimeRange}
            onChange={e => setOfferTimeRange(e.target.value)}
            fullWidth
          />
          <TextField
            label="Features (comma or newline separated)"
            value={offerFeatures}
            onChange={e => setOfferFeatures(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
          />
          <TextField
            label="Time Plan (optional)"
            value={offerTimePlan}
            onChange={e => setOfferTimePlan(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOfferModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleConfirmSendOffer}>Send Offer</Button>
        </DialogActions>
      </Dialog>
      {/* Offer Confirmation Dialog */}
      <Dialog open={showOfferConfirm} onClose={() => setShowOfferConfirm(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Send Offer</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to send this offer to the client?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOfferConfirm(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleActuallySendOffer}>Yes, Send Offer</Button>
        </DialogActions>
      </Dialog>
      {/* Offer Thank You Dialog */}
      <Dialog open={showOfferThankYou} onClose={() => setShowOfferThankYou(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Thank You!</DialogTitle>
        <DialogContent>
          <Typography>Your offer has been sent to the client.</Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Requests; 