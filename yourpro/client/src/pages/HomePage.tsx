import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Paper,
  IconButton,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import './HomePage.css';
import AISearchBar from '../components/AISearchBar';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedFile, setDraggedFile] = useState<File | null>(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [freelancerInfoVisible, setFreelancerInfoVisible] = useState(false);
  const [companyInfoVisible, setCompanyInfoVisible] = useState(false);
  const freelancerRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);
  const aiInputRef = useRef<HTMLInputElement>(null);
  const [aiHighlight, setAiHighlight] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setDraggedFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDraggedFile(file);
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleSpeech = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          setSearchQuery(event.results[0][0].transcript);
        }
        setListening(false);
      };
      recognitionRef.current.onerror = () => setListening(false);
      recognitionRef.current.onend = () => setListening(false);
    }
    if (!listening) {
      setListening(true);
      recognitionRef.current.start();
    } else {
      setListening(false);
      recognitionRef.current.stop();
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/results?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Function to trigger highlight
  const triggerAiHighlight = () => {
    setAiHighlight(true);
    setTimeout(() => setAiHighlight(false), 1200);
    if (aiInputRef.current) {
      aiInputRef.current.focus();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (freelancerRef.current) {
        const rect = freelancerRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) setFreelancerInfoVisible(true);
      }
      if (companyRef.current) {
        const rect = companyRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) setCompanyInfoVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#fff',
      pt: 18,
      pb: 6 
    }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 900,
            color: '#1976d2',
            mb: 5,
            letterSpacing: '-0.5px',
            lineHeight: 1.2
          }}
        >
          Connect with Professionals
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: '#475569',
            mb: 10,
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.5,
            fontWeight: 500
          }}
        >
          Join our platform as a freelancer, company or client, start collaborating or find your professional today
        </Typography>

        {/* Search Section - minimal, no container */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '40px 0 32px 0' }}>
          <AISearchBar
            onSearch={() => {}}
            inputRef={aiInputRef}
            highlight={aiHighlight}
          />
        </div>

        {/* Feature Cards */}
        <Grid container spacing={3} sx={{ mt: 6, mb: 15 }}>
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid #2563eb',
                bgcolor: '#2563eb',
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                color: '#fff',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 25px -5px rgb(37 99 235 / 0.18), 0 8px 10px -6px rgb(37 99 235 / 0.12)',
                  bgcolor: '#1d4ed8',
                }
              }}
              onClick={triggerAiHighlight}
            >
              <CardContent sx={{ p: 3 }}>
                <AutoAwesomeIcon sx={{ fontSize: 40, color: '#fff', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
                  Search and hire a pro with enhanced AI features
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid #2563eb',
                bgcolor: '#2563eb',
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                color: '#fff',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 25px -5px rgb(37 99 235 / 0.18), 0 8px 10px -6px rgb(37 99 235 / 0.12)',
                  bgcolor: '#1d4ed8',
                }
              }}
              onClick={() => navigate('/professionals')}
            >
              <CardContent sx={{ p: 3 }}>
                <CalendarTodayIcon sx={{ fontSize: 40, color: '#fff', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
                  Book a pro with ease with our intuitive booking system
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid #2563eb',
                bgcolor: '#2563eb',
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                color: '#fff',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 25px -5px rgb(37 99 235 / 0.18), 0 8px 10px -6px rgb(37 99 235 / 0.12)',
                  bgcolor: '#1d4ed8',
                }
              }}
              onClick={() => navigate('/contact')}
            >
              <CardContent sx={{ p: 3 }}>
                <SupportAgentIcon sx={{ fontSize: 40, color: '#fff', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
                  Get advice from an industry expert
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  Consultations →
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ height: { xs: 32, md: 56 } }} />
      </Box>

      {showUpload && (
        <div className="upload-section upload-animate">
          <h2>Upload your image or project, we will find the best professionals for you</h2>
          <p className="upload-description">
            Our AI will instantly match you with qualified professionals who specialize in exactly what you need
          </p>
          <div
            className="drop-zone"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleDropZoneClick}
            style={{ cursor: 'pointer' }}
          >
            <input
              type="file"
              accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {draggedFile ? (
              <div className="drop-zone-preview">
                {draggedFile.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(draggedFile)}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 12, marginBottom: 12 }}
                  />
                ) : (
                  <div style={{ marginBottom: 12 }}>
                    <strong>Uploaded:</strong> {draggedFile.name}
                  </div>
                )}
              </div>
            ) : (
              <div className="drop-zone-content">
                <div className="upload-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 8L12 3L7 8" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 3V15" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="drop-text">Click or drag & drop a file here</p>
                <p className="drop-hint">Supported: images, PDF, Word, Excel, PPT, TXT (max 10MB)</p>
              </div>
            )}
          </div>
          {draggedFile && (
            <button
              className="cta-button submit-btn"
              style={{ marginTop: 18 }}
              onClick={() => {
                console.log('Submitted file:', draggedFile);
                alert('Submitted!');
              }}
            >
              Submit
            </button>
          )}
        </div>
      )}
      {/* Freelancer Info and Container Row */}
      <div className="split-row freelancer-row" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', margin: '0 auto', maxWidth: '1600px' }}>
        <div className="side-info freelancer-info" style={{ marginTop: '48px', flex: '0 0 320px', opacity: freelancerInfoVisible ? 1 : 0, transform: freelancerInfoVisible ? 'translateX(0)' : 'translateX(-40px)', transition: 'opacity 0.7s, transform 0.7s', fontSize: '1.35rem', color: '#23236a', fontWeight: 600, marginLeft: '2.5rem', maxWidth: 320, zIndex: 10, textAlign: 'left' }}>
          Are you a freelancer? <br />Join our community and enjoy all its features.
        </div>
        <section className="feature-section freelancer-feature split-hero-section" ref={freelancerRef} style={{ flex: 1, marginLeft: '2.5rem' }}>
          <div className="split-hero-image">
            <img src="/freelancer.jpg" alt="Freelancer" />
          </div>
          <div className="split-hero-content freelancer-bg">
            <h3 className="feature-section-title">For Freelancers</h3>
            <div className="feature-section-subtitle">Grow your business, manage projects, and connect with clients worldwide.</div>
            <div className="split-hero-features">
              <div className="feature-item">Smart booking system for easy project management</div>
              <div className="feature-item">Secure, real-time messaging with clients</div>
              <div className="feature-item">Professional profile and portfolio tools</div>
            </div>
            <Link to="/freelancer-registration" className="split-hero-cta freelancer-cta">Join as Freelancer</Link>
          </div>
        </section>
      </div>
      {/* Companies Info and Container Row (reversed) */}
      <div className="split-row company-row" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', margin: '0 auto', maxWidth: '1600px' }}>
        <section className="feature-section company-feature split-hero-section" ref={companyRef} style={{ flex: 1, marginRight: '2.5rem' }}>
          <div className="split-hero-image">
            <img src="/companies.jpg" alt="Companies" />
          </div>
          <div className="split-hero-content company-bg">
            <h3 className="feature-section-title">For Companies</h3>
            <div className="feature-section-subtitle">Find, hire, and manage top freelance talent with powerful business tools.</div>
            <div className="split-hero-features">
              <div className="feature-item">Instantly search and filter verified freelancers</div>
              <div className="feature-item">Smart booking and project management tools</div>
              <div className="feature-item">Workflow automations to streamline hiring</div>
            </div>
            <Link to="/company-registration" className="split-hero-cta company-cta">Join as Company</Link>
          </div>
        </section>
        <div className="side-info company-info" style={{ marginTop: '48px', flex: '0 0 320px', opacity: companyInfoVisible ? 1 : 0, transform: companyInfoVisible ? 'translateX(0)' : 'translateX(40px)', transition: 'opacity 0.7s, transform 0.7s', fontSize: '1.35rem', color: '#15803d', fontWeight: 600, marginRight: '2.5rem', maxWidth: 320, zIndex: 10, textAlign: 'left' }}>
          Are you a company? <br />Join our community and access top talent and business tools.
        </div>
      </div>
      {/* Featured Category Boxes Below Companies Container */}
      <div className="client-categories" style={{ width: '100%', maxWidth: 1100, margin: '2.5rem auto', padding: '0 1rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#23236a', marginBottom: '1.2rem', letterSpacing: '-1px' }}>Browse jobs by category now</h2>
        <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', width: '100%' }}>
          {[
            { label: 'Development & IT', query: 'development', rating: 4.85, skills: 1853 },
            { label: 'AI Services', query: 'ai', rating: 4.8, skills: 294 },
            { label: 'Design & Creative', query: 'design', rating: 4.91, skills: 968 },
            { label: 'Sales & Marketing', query: 'marketing', rating: 4.77, skills: 392 },
            { label: 'Writing & Translation', query: 'writing', rating: 4.92, skills: 505 },
            { label: 'Admin & Customer Support', query: 'admin', rating: 4.77, skills: 508 },
            { label: 'Finance & Accounting', query: 'finance', rating: 4.79, skills: 214 },
            { label: 'Engineering & Architecture', query: 'engineering', rating: 4.85, skills: 650 },
          ].map(cat => (
            <Link
              key={cat.query}
              to={`/results?query=${encodeURIComponent(cat.query)}`}
              className="category-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                background: '#f8f9fa',
                color: '#23236a',
                fontWeight: 700,
                fontSize: '1.13rem',
                borderRadius: '18px',
                boxShadow: '0 2px 12px #23263a11',
                padding: '1.3rem 1.3rem 1.1rem 1.3rem',
                minWidth: 180,
                minHeight: 110,
                textDecoration: 'none',
                transition: 'background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s',
                letterSpacing: '0.2px',
              }}
            >
              <span style={{ fontSize: '1.18rem', fontWeight: 800, marginBottom: '0.7rem' }}>{cat.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '1.05rem', fontWeight: 600, marginTop: '0.2rem' }}>
                <span style={{ color: '#22c55e', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#22c55e" style={{ marginRight: 4 }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  {cat.rating}/5
                </span>
                <span style={{ color: '#23236a', fontWeight: 500 }}>{cat.skills} skills</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Box>
  );
};

export default HomePage; 