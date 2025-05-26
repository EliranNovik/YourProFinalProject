import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CombinedResults.css';
import { MOCK_USER } from '../data/userData';

interface Lead {
  name: string;
  source: string;
  time: string;
  projectSummary: string;
  avatar: string;
}

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

// Simple timeAgo function
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [newBookingsCount, setNewBookingsCount] = useState(0);

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    // Sort by creation date, newest first
    const sortedBookings = savedBookings.sort((a: Booking, b: Booking) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setBookings(sortedBookings);
    // Count pending bookings
    setNewBookingsCount(sortedBookings.filter((b: Booking) => b.status === 'pending').length);
  }, []);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const companyInfo = {
    name: "CloudTech Solutions",
    logo: "https://logo.clearbit.com/cloudtech.com",
    industry: "Cloud Services"
  };
  
  const stats = {
    newBookings: newBookingsCount,
    unreadMessages: 8,
    tasks: 12,
    bookings2025: "$16,989.95"
  };

  const messages = [
    {
      sender: 'Sarah Lee',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      message: 'Hi, can you send the contract?',
      time: '2m ago'
    },
    {
      sender: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      message: 'Looking forward to our call!',
      time: '10m ago'
    },
    {
      sender: 'Emily Chen',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      message: 'Sent the files you requested.',
      time: '30m ago'
    }
  ];

  const recentActivity = [
    { client: "Sarah Lee", avatar: "https://randomuser.me/api/portraits/women/44.jpg", activity: "Invoice paid" },
    { client: "John Smith", avatar: "https://randomuser.me/api/portraits/men/32.jpg", activity: "Contract signed" },
    { client: "Emily Chen", avatar: "https://randomuser.me/api/portraits/women/68.jpg", activity: "Sent project proposal" },
    { client: "Michael Brown", avatar: "https://randomuser.me/api/portraits/men/45.jpg", activity: "Received feedback on design" },
    { client: "Olivia Green", avatar: "https://randomuser.me/api/portraits/women/65.jpg", activity: "Uploaded final deliverables" },
    { client: "David Kim", avatar: "https://randomuser.me/api/portraits/men/36.jpg", activity: "Scheduled onboarding call" },
    { client: "Sophia Turner", avatar: "https://randomuser.me/api/portraits/women/51.jpg", activity: "Added new team member" },
    { client: "Lucas White", avatar: "https://randomuser.me/api/portraits/men/52.jpg", activity: "Requested project extension" },
    { client: "Mia Patel", avatar: "https://randomuser.me/api/portraits/women/53.jpg", activity: "Shared project files" }
  ];

  const handleBookingClick = (booking: Booking) => {
    navigate('/requests', { state: { scrollToBooking: booking.id } });
  };

  return (
    <div className="dashboard-modern">
      <div className="dashboard-header">
        <div className="company-info">
          <img src={companyInfo.logo} alt={companyInfo.name} className="company-logo" />
          <div className="company-details">
            <h1>{companyInfo.name}</h1>
            <div className="current-date">{formattedDate}</div>
          </div>
        </div>
        <div className="header-actions">
          <div className="search-container">
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <h3>New bookings <span className="info-icon">ⓘ</span></h3>
          <div className="stat-value">{stats.newBookings}</div>
        </div>
        <div className="stat-box">
          <h3>Unread messages <span className="info-icon">ⓘ</span></h3>
          <div className="stat-value">{stats.unreadMessages}</div>
        </div>
        <div className="stat-box">
          <h3>New activities <span className="info-icon">ⓘ</span></h3>
          <div className="stat-value">{stats.tasks}</div>
        </div>
        <div className="stat-box">
          <h3>2025 bookings <span className="info-icon">ⓘ</span></h3>
          <div className="stat-value">{stats.bookings2025}</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-left">
          <div className="leads-section">
            <div className="leads-list">
              <div className="leads-header">
                <h2>New bookings ({bookings.filter(b => b.status === 'pending').length}) <span className="info-icon">ⓘ</span></h2>
                <button className="lead-form-btn" onClick={() => navigate('/requests')}>View all</button>
              </div>
              {bookings.filter(b => b.status === 'pending').slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="lead-item clickable-row"
                  tabIndex={0}
                  onClick={() => handleBookingClick(booking)}
                >
                  <div className="lead-info lead-info-vertical">
                    <img
                      src={MOCK_USER.avatar}
                      alt={MOCK_USER.name}
                      className="lead-avatar"
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', marginRight: 12 }}
                    />
                    <div className="lead-name" style={{ fontWeight: 700 }}>{MOCK_USER.name}</div>
                  </div>
                  <div className="lead-summary">
                    {booking.package.name} Package - ${booking.package.price}
                    {(booking.package.id === 'quote') && booking.package.description && (
                      <div style={{ color: '#374151', fontSize: 14, marginTop: 2, fontWeight: 500 }}>
                        {booking.package.description}
                      </div>
                    )}
                    {booking.notes && booking.package.id !== 'quote' && (
                      <div style={{ color: '#374151', fontSize: 14, marginTop: 2, fontWeight: 500 }}>{booking.notes}</div>
                    )}
                  </div>
                  <div className="lead-time">
                    {new Date(booking.createdAt).toLocaleDateString()}
                    <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>{timeAgo(booking.createdAt)}</div>
                  </div>
                </div>
              ))}
              {bookings.filter(b => b.status === 'pending').length > 5 && (
                <button className="show-more-btn" onClick={() => navigate('/requests')}>
                  Show more ({bookings.filter(b => b.status === 'pending').length - 5}) →
                </button>
              )}
            </div>
          </div>

          <div className="messages-section">
            <div className="messages-list">
              <div className="messages-header">
                <h2>New messages ({messages.length}) <span className="info-icon">ⓘ</span></h2>
                <button className="meeting-btn">View all</button>
              </div>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className="message-item clickable-row"
                  tabIndex={0}
                  onClick={() => alert(`Clicked message from ${msg.sender}`)}
                >
                  <img src={msg.avatar} alt={msg.sender} className="message-avatar" />
                  <div className="message-content">
                    <div className="message-sender">{msg.sender}</div>
                    <div className="message-text">{msg.message}</div>
                  </div>
                  <div className="message-time">{msg.time}</div>
                </div>
              ))}
              <button className="go-to-calendar-btn">Show more (5) →</button>
            </div>
          </div>
        </div>

        <div className="content-right">
          <div className="activity-section">
            <h2>Activity (7) <span className="info-icon">ⓘ</span></h2>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="activity-item clickable-row"
                  tabIndex={0}
                  onClick={() => alert(`Clicked activity for ${activity.client}`)}
                >
                  <img src={activity.avatar} alt={activity.client} className="activity-avatar" />
                  <div className="activity-info">
                    <div className="activity-title">{activity.client}</div>
                    <div className="activity-description">{activity.activity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 