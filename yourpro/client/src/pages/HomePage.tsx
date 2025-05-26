import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

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
    <div className="home-container with-navbar-padding">
      <main className="main-content">
        {/* Header and subtitle moved into clients container */}
      </main>
      <section className="client-hero-fiverr-style">
        <div className="client-hero-bg-fiverr">
          <div className="client-hero-overlay-fiverr">
            <h1 className="client-hero-title">Connect with Professionals</h1>
            <p className="client-hero-subtitle">Join our platform as a freelancer, company or client, start collaborating or find your professional today</p>
            <Link
              to="/register"
              style={{
                display: 'inline-block',
                background: '#fbbf24',
                color: '#23263a',
                fontWeight: 700,
                fontSize: '1.18rem',
                borderRadius: 999,
                padding: '1rem 2.5rem',
                margin: '1.2rem 0 1.5rem 0',
                boxShadow: '0 2px 16px #fbbf2433',
                border: '2px solid #fbbf24',
                textDecoration: 'none',
                transition: 'background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s',
              }}
              className="split-hero-cta client-cta"
            >
              Register
            </Link>
            <div className="client-hero-searchbar-row">
              <button
                type="button"
                className={`speech-btn${listening ? ' listening' : ''}`}
                aria-label="Speak to search"
                onClick={handleSpeech}
                style={{ marginRight: '0.5rem' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="2" width="6" height="12" rx="3" stroke="#232323" strokeWidth="2" fill="none" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="#232323" strokeWidth="2" fill="none" />
                  <line x1="12" y1="22" x2="12" y2="18" stroke="#232323" strokeWidth="2" />
                  <line x1="8" y1="22" x2="16" y2="22" stroke="#232323" strokeWidth="2" />
                </svg>
              </button>
              <button
                type="button"
                className="speech-btn camera-btn"
                aria-label="Upload image or project"
                onClick={() => setShowUpload(v => !v)}
                style={{ marginRight: '0.7rem' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="7" width="18" height="12" rx="3" stroke="#232323" strokeWidth="2" fill="none" />
                  <circle cx="12" cy="13" r="3.5" stroke="#232323" strokeWidth="2" fill="none" />
                  <rect x="8" y="3" width="8" height="4" rx="2" stroke="#232323" strokeWidth="2" fill="none" />
                </svg>
              </button>
              <input
                type="text"
                className="client-hero-searchbar"
                placeholder="Search for any service..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
              <button className="client-hero-search-btn" onClick={handleSearch}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="#232323" strokeWidth="2" />
                  <line x1="20" y1="20" x2="16.65" y2="16.65" stroke="#232323" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="client-hero-features-fiverr-row">
              <div className="feature-item client-feature-yellow">
                <div className="feature-item-title">Search and hire a pro with enhanced AI features</div>
              </div>
              <div className="feature-item client-feature-yellow">
                <div className="feature-item-title">Book a pro with ease with our intuitive booking system</div>
              </div>
              <div className="feature-item client-feature-yellow">
                <div className="feature-item-title">Get advice from an industry expert</div>
                <div className="feature-item-desc">Consultations →</div>
              </div>
            </div>
          </div>
          <img src="/client.jpg" alt="Client" className="client-hero-bg-img-fiverr" />
        </div>
      </section>

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
        <div className="side-info freelancer-info" style={{ flex: '0 0 320px', opacity: freelancerInfoVisible ? 1 : 0, transform: freelancerInfoVisible ? 'translateX(0)' : 'translateX(-40px)', transition: 'opacity 0.7s, transform 0.7s', fontSize: '1.35rem', color: '#23236a', fontWeight: 600, marginLeft: '2.5rem', maxWidth: 320, zIndex: 10, textAlign: 'left' }}>
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
        <div className="side-info company-info" style={{ flex: '0 0 320px', opacity: companyInfoVisible ? 1 : 0, transform: companyInfoVisible ? 'translateX(0)' : 'translateX(40px)', transition: 'opacity 0.7s, transform 0.7s', fontSize: '1.35rem', color: '#15803d', fontWeight: 600, marginRight: '2.5rem', maxWidth: 320, zIndex: 10, textAlign: 'left' }}>
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
    </div>
  );
};

export default HomePage; 