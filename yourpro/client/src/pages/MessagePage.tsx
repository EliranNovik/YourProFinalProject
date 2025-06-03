import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FREELANCERS } from './Freelancers';
import { COMPANIES } from './Companies';
import './FreelancerProfile.css';
import './MessagePage.css';

interface ChatMessage {
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

const MessagePage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      text: 'Hi! How can I help you?',
      sender: 'them',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  let profile: any = null;
  let name = '';
  let avatar = '';

  if (type === 'freelancer') {
    profile = FREELANCERS.find(f => f.id === id);
    name = profile?.name;
    avatar = profile?.avatar;
  } else if (type === 'company') {
    profile = COMPANIES.find(c => c.id === id);
    name = profile?.name;
    avatar = profile?.logo;
  }

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleSend = () => {
    if (!message.trim()) return;
    setChat(prev => [
      ...prev,
      {
        text: message,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setMessage('');
    // Simulate a reply after 1.2s
    setTimeout(() => {
      setChat(prev => [
        ...prev,
        {
          text: 'Thanks for your message! I will get back to you soon.',
          sender: 'them',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="with-navbar-padding">
      <div className="message-page-container">
        <div className="wa-bg">
          <div className="wa-chat-card">
            <div className="wa-header">
              <Link to={type === 'freelancer' ? `/freelancer/${id}` : `/company/${id}`} className="wa-back-btn">←</Link>
              <img src={avatar} alt={name} className="wa-avatar" />
              <div className="wa-title-group">
                <div className="wa-name">{name}</div>
                <div className="wa-type">{type === 'freelancer' ? 'Freelancer' : 'Company'}</div>
              </div>
            </div>
            <div className="wa-chat-body">
              {chat.map((msg, idx) => (
                <div key={idx} className={`wa-bubble-row ${msg.sender === 'me' ? 'wa-bubble-row-me' : 'wa-bubble-row-them'}`}>
                  <div className={`wa-bubble ${msg.sender}`}>{msg.text}
                    <span className="wa-bubble-time">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form className="wa-input-row" onSubmit={e => { e.preventDefault(); handleSend(); }}>
              <textarea
                className="wa-input"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type a message..."
                rows={1}
              />
              <button className="wa-send-btn" type="submit" disabled={!message.trim()}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage; 