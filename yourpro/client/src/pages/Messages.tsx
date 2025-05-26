import React from 'react';
import { MOCK_USER } from '../data/userData';
import './Clients.css';
import { FREELANCERS } from './Freelancers';
import { COMPANIES } from './Companies';

const companyProfile = {
  name: "CloudTech Solutions",
  logo: "https://logo.clearbit.com/cloudtech.com",
  industry: "Cloud Services",
  location: "Seattle, WA",
  email: "contact@cloudtech.com",
  website: "www.cloudtech.com"
};

const mockMessages = [
  { from: 'company', text: 'Hello Alex, we have an update on your project timeline.', time: '2024-06-12T08:55:00Z' },
  { from: 'me', text: 'Thank you for the update! Looking forward to the details.', time: '2024-06-12T08:56:00Z' },
  { from: 'company', text: 'The kickoff meeting is scheduled for tomorrow at 10am. Please confirm your availability.', time: '2024-06-12T09:00:00Z' },
  { from: 'me', text: 'Confirmed, I will be there.', time: '2024-06-12T09:01:00Z' },
  { from: 'company', text: 'Great! We will send you the meeting link shortly.', time: '2024-06-12T09:02:00Z' },
];

// Contact type for sidebar
interface Contact {
  id: string;
  name: string;
  avatar: string;
  subtitle: string;
  type: 'freelancer' | 'company';
}

const getContactList = (searchTerm: string): Contact[] => {
  const term = searchTerm.toLowerCase();
  const freelancerContacts: Contact[] = FREELANCERS.filter(f =>
    f.name.toLowerCase().includes(term) || f.title.toLowerCase().includes(term)
  ).map(f => ({
    id: `freelancer-${f.id}`,
    name: f.name,
    avatar: f.avatar,
    subtitle: f.title,
    type: 'freelancer' as const,
  }));
  const companyContacts: Contact[] = COMPANIES.filter(c =>
    c.name.toLowerCase().includes(term) || c.industry.toLowerCase().includes(term)
  ).map(c => ({
    id: `company-${c.id}`,
    name: c.name,
    avatar: c.logo || '',
    subtitle: c.industry,
    type: 'company' as const,
  }));
  return [...freelancerContacts, ...companyContacts];
};

// Demo: generate mock messages for a contact
const getMessagesForContact = (contact: Contact | null) => {
  if (!contact) return [];
  if (contact.type === 'company') {
    return [
      { from: 'company', text: `Hello, this is ${contact.name}. How can we help you today?`, time: '2024-06-12T08:55:00Z' },
      { from: 'me', text: 'Hi! I have a question about your services.', time: '2024-06-12T08:56:00Z' },
      { from: 'company', text: 'Sure, feel free to ask!', time: '2024-06-12T09:00:00Z' },
    ];
  } else {
    return [
      { from: 'freelancer', text: `Hi, I'm ${contact.name}, a ${contact.subtitle}. How can I assist you?`, time: '2024-06-12T10:00:00Z' },
      { from: 'me', text: 'Hello! I am interested in your work.', time: '2024-06-12T10:01:00Z' },
      { from: 'freelancer', text: 'Thank you! Let me know what you need.', time: '2024-06-12T10:02:00Z' },
    ];
  }
};

const isDarkMode = typeof document !== 'undefined' && document.body.classList.contains('dark-mode');

const Messages: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const contacts = getContactList(search);
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<any[]>([]);
  const [showContactsMobile, setShowContactsMobile] = React.useState(true);
  const [hoveredContactId, setHoveredContactId] = React.useState<string | null>(null);

  // Detect mobile view
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mount, load last selected contact from localStorage or default to first contact
  React.useEffect(() => {
    const lastContactId = localStorage.getItem('lastSelectedContactId');
    if (lastContactId && contacts.length > 0) {
      const found = contacts.find(c => c.id === lastContactId);
      if (found) setSelectedContact(found);
      else setSelectedContact(contacts[0]);
    } else if (contacts.length > 0) {
      setSelectedContact(contacts[0]);
    }
    // eslint-disable-next-line
  }, [search]);

  // When selectedContact changes, persist to localStorage
  React.useEffect(() => {
    if (selectedContact) {
      localStorage.setItem('lastSelectedContactId', selectedContact.id);
    }
  }, [selectedContact]);

  // Load messages when contact changes
  React.useEffect(() => {
    if (selectedContact) {
      setMessages(getMessagesForContact(selectedContact));
    } else {
      setMessages([]);
    }
  }, [selectedContact]);

  // Add a style tag for the custom input placeholder color
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .dark-blue-input::placeholder {
        color: #1e293b;
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle sending a message
  const handleSend = () => {
    if (!input.trim() || !selectedContact) return;
    const newMsg = {
      from: 'me',
      text: input,
      time: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    // Simulate automated response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          from: selectedContact.type,
          text:
            selectedContact.type === 'company'
              ? `Thank you for your message! (${selectedContact.name})`
              : `Thanks for reaching out! (${selectedContact.name})`,
          time: new Date(Date.now() + 1000).toISOString(),
        },
      ]);
    }, 1200);
  };

  // Swipe left to open sidebar on mobile
  const touchStartX = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return;
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!isMobile) return;
    if (
      touchStartX.current !== null &&
      touchEndX.current !== null &&
      touchStartX.current - touchEndX.current > 60
    ) {
      // Swipe left detected
      window.dispatchEvent(new Event('openSidebar'));
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      style={{
        display: isMobile ? 'block' : 'flex',
        height: 'calc(100vh - 30px)',
        background: isDarkMode ? '#181c24' : '#f8fafc',
        marginTop: 30,
        position: 'relative',
        overflow: 'hidden'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sidebar */}
      <div
        style={{
          width: isMobile ? '100vw' : 320,
          background: isDarkMode ? '#23263a' : '#fff',
          borderRight: isMobile ? 'none' : isDarkMode ? '1px solid #23263a' : '1px solid #e5e7eb',
          padding: 0,
          display: (isMobile && !showContactsMobile) ? 'none' : 'flex',
          flexDirection: 'column',
          position: isMobile ? 'fixed' : 'fixed',
          top: 30,
          left: 0,
          bottom: 0,
          height: 'calc(100vh - 30px)',
          zIndex: 2,
          paddingTop: isMobile ? 56 : 0,
        }}
      >
        <div style={{ padding: '24px 24px 0 24px', borderBottom: isDarkMode ? '1px solid #23263a' : '1px solid #e5e7eb', background: isDarkMode ? '#181c24' : '#f1f5f9', marginTop: isMobile ? 8 : 0 }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contacts..."
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: isDarkMode ? '1.5px solid #23263a' : '1.5px solid #e5e7eb', fontSize: 16, outline: 'none', background: isDarkMode ? '#23263a' : '#fff', color: isDarkMode ? '#f3f4f6' : '#1e293b' }}
          />
        </div>
        <div style={{ flex: 1, maxHeight: 'calc(100vh - 80px)', overflowY: 'auto', padding: '0' }}>
          {contacts.length === 0 && (
            <div style={{ color: '#64748b', textAlign: 'center', marginTop: 32 }}>No contacts found</div>
          )}
          {contacts.map(contact => {
            const contactMessages = getMessagesForContact(contact);
            const lastMsg = contactMessages.length > 0 ? contactMessages[contactMessages.length - 1] : null;
            let lastTime = '';
            if (lastMsg) {
              const msgDate = new Date(lastMsg.time);
              const now = new Date();
              if (
                msgDate.getDate() === now.getDate() &&
                msgDate.getMonth() === now.getMonth() &&
                msgDate.getFullYear() === now.getFullYear()
              ) {
                // Today: show time
                lastTime = msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              } else {
                // Not today: show date
                lastTime = msgDate.toLocaleDateString();
              }
            }
            const isSelected = selectedContact && selectedContact.id === contact.id;
            const isHovered = hoveredContactId === contact.id;
            return (
              <div
                key={contact.id}
                onClick={() => {
                  setSelectedContact(contact);
                  if (isMobile) setShowContactsMobile(false);
                }}
                className={isHovered ? 'contact-hovered' : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  padding: '12px 24px',
                  cursor: 'pointer',
                  borderBottom: isDarkMode ? '1px solid #23263a' : '1px solid #f1f5f9',
                  transition: 'background 0.2s',
                  background: isSelected ? (isDarkMode ? '#2563eb' : '#e0f2fe') : 'transparent',
                  fontWeight: isSelected ? 700 : 400,
                  position: 'relative',
                  color: isDarkMode ? '#f3f4f6' : undefined,
                }}
                onMouseEnter={() => setHoveredContactId(contact.id)}
                onMouseLeave={() => setHoveredContactId(null)}
              >
                <img src={contact.avatar} alt={contact.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', background: isDarkMode ? '#181c24' : '#f1f5f9' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 17 }}>{contact.name}</div>
                  <div style={{ color: isDarkMode ? '#bfc8f8' : '#64748b', fontSize: 14 }}>{contact.subtitle}</div>
                </div>
                {lastTime && (
                  <div style={{ color: isDarkMode ? '#bfc8f8' : '#b6c2d4', fontSize: 11, position: 'absolute', right: 16, top: 20, fontWeight: 400, minWidth: 48, textAlign: 'right', letterSpacing: 0.2 }}>
                    {lastTime}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Main chat area */}
      <div
        style={{
          flex: 1,
          display: (isMobile && showContactsMobile) ? 'none' : 'flex',
          flexDirection: 'column',
          marginLeft: isMobile ? 0 : 320,
          height: 'calc(100vh - 30px)',
          width: isMobile ? '100vw' : 'calc(100vw - 80px)',
          maxWidth: isMobile ? '100vw' : 'calc(100vw - 80px)',
          position: isMobile ? 'fixed' : 'relative',
          top: isMobile ? 30 : undefined,
          left: isMobile ? 0 : undefined,
          zIndex: 3,
          background: isDarkMode ? '#23263a' : '#fff',
          marginRight: isMobile ? 0 : 80,
        }}
      >
        <div className="with-navbar-padding" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="client-details-section" style={{ height: '100%', background: isDarkMode ? '#23263a' : '#fff', borderRadius: 0, boxShadow: 'none', padding: 32, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', color: isDarkMode ? '#f3f4f6' : undefined }}>
            {selectedContact ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
                  {isMobile && (
                    <button
                      onClick={() => setShowContactsMobile(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        marginRight: 10,
                        cursor: 'pointer',
                        fontSize: 22,
                        color: isDarkMode ? '#bfc8f8' : '#1e293b',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 28, marginRight: 2, lineHeight: 1 }}>&larr;</span>
                    </button>
                  )}
                  <img src={selectedContact.avatar} alt={selectedContact.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', background: isDarkMode ? '#181c24' : undefined }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 22, color: isDarkMode ? '#f3f4f6' : undefined }}>{selectedContact.name}</div>
                    <div style={{ color: isDarkMode ? '#bfc8f8' : '#64748b', fontSize: 16 }}>{selectedContact.subtitle}</div>
                  </div>
                </div>
                <div style={{ borderTop: isDarkMode ? '1px solid #23263a' : '1px solid #e5e7eb', margin: '18px 0' }} />
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, overflowY: 'auto', marginBottom: 0, minHeight: 0, maxHeight: 'calc(100vh - 270px)' }}>
                    {messages.map((msg, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: msg.from === 'me' ? 'row-reverse' : 'row', alignItems: 'flex-end', marginBottom: 12 }}>
                        {msg.from !== 'me' && (
                          <img src={selectedContact.avatar} alt={selectedContact.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', marginRight: 10, marginLeft: 0, background: isDarkMode ? '#181c24' : undefined }} />
                        )}
                        <div style={{
                          background: msg.from === 'me' ? (isDarkMode ? '#2563eb' : '#1e293b') : (isDarkMode ? '#181c24' : '#f1f5f9'),
                          color: msg.from === 'me' ? '#fff' : (isDarkMode ? '#f3f4f6' : '#222'),
                          borderRadius: 12,
                          padding: '10px 18px',
                          maxWidth: 320,
                          fontSize: 16,
                          boxShadow: isDarkMode ? '0 1px 4px #10121a' : '0 1px 4px #e5eaf1',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          border: isDarkMode ? (msg.from === 'me' ? '1.5px solid #2563eb' : '1.5px solid #23263a') : undefined,
                        }}>
                          {msg.from !== 'me' && (
                            <span style={{ fontWeight: 600, color: isDarkMode ? '#6be1ff' : '#2563eb', fontSize: 14, marginBottom: 2 }}>{selectedContact.name}</span>
                          )}
                          <span>{msg.text}</span>
                          <span style={{ fontSize: 12, color: isDarkMode ? '#bfc8f8' : '#94a3b8', alignSelf: 'flex-end', marginTop: 6 }}>{new Date(msg.time).toLocaleString()}</span>
                        </div>
                        {msg.from === 'me' && (
                          <img src={MOCK_USER.avatar} alt={MOCK_USER.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', marginLeft: 10, marginRight: 0, background: isDarkMode ? '#181c24' : undefined }} />
                        )}
                      </div>
                    ))}
                  </div>
                  <form
                    style={{ display: 'flex', gap: 12, marginTop: 0, paddingTop: 12, borderTop: isDarkMode ? '1px solid #23263a' : '1px solid #e5e7eb', background: isDarkMode ? '#23263a' : '#fff' }}
                    onSubmit={e => {
                      e.preventDefault();
                      handleSend();
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="dark-blue-input"
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: isDarkMode ? '1.5px solid #23263a' : '1.5px solid #1e293b',
                        fontSize: 16,
                        outline: 'none',
                        background: isDarkMode ? '#181c24' : '#fff',
                        color: isDarkMode ? '#f3f4f6' : '#1e293b',
                      }}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      disabled={!selectedContact}
                    />
                    <button
                      type="submit"
                      style={{ background: isDarkMode ? '#6be1ff' : '#2563eb', color: isDarkMode ? '#181c24' : '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: 16, cursor: input.trim() ? 'pointer' : 'not-allowed', opacity: input.trim() ? 1 : 0.7 }}
                      disabled={!input.trim()}
                    >
                      Send
                    </button>
                  </form>
                  <div style={{ color: isDarkMode ? '#bfc8f8' : '#64748b', fontSize: 13, marginTop: 8, marginBottom: 0 }}>(Messaging is in demo mode)</div>
                </div>
              </>
            ) : (
              <div style={{ color: isDarkMode ? '#bfc8f8' : '#64748b', textAlign: 'center', marginTop: 120, fontSize: 20 }}>
                Select a contact to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages; 