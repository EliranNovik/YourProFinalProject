import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { aiService } from '../services/aiService';
import './SearchingForPro.css';

function extractJobTitle(aiResponse: string): string {
  // Match 'You might need a (jobtitle)' or 'You need a (jobtitle)'
  const match = aiResponse.match(/need (?:a|an)\s+([a-zA-Z ]+)/i);
  if (match && match[1]) {
    // Remove trailing punctuation and whitespace
    return match[1].replace(/[.?!,]+$/, '').trim();
  }
  // Fallback: return the whole response
  return aiResponse;
}

interface DBFreelancer {
  user_id: string;
  professional_title: string;
  skills: string[];
  hourly_rate: number;
  location: string;
  rating?: number;
  review_count?: number;
  avatar_url?: string;
  full_name?: string;
  // Add more fields as needed
}

function hasWordOverlap(a: string, b: string) {
  const aWords = a.split(' ');
  const bWords = b.split(' ');
  return aWords.some(word => bWords.includes(word));
}

const SearchingForPro: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const aiJobtitle = (location.state && (location.state as any).jobtitle) ||
    new URLSearchParams(window.location.search).get('jobtitle') || 'professional';
  const jobtitle = extractJobTitle(aiJobtitle);

  const [freelancers, setFreelancers] = useState<DBFreelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');
  const [current, setCurrent] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [aiReport, setAiReport] = useState<{ report: string; timeFrame: string; costEstimate: string } | null>(null);
  const [aiReportError, setAiReportError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true);
      // Fetch all freelancers and filter in JS
      const { data, error } = await supabase
        .from('freelancer_profiles')
        .select('*');
      function normalize(str: string) {
        return str.toLowerCase().replace(/ services?$/, '').trim();
      }
      const searchTerm = normalize(jobtitle);
      const filtered = (data || []).filter(f => {
        const title = normalize(f.professional_title || '');
        if (
          title.includes(searchTerm) ||
          searchTerm.includes(title) ||
          hasWordOverlap(title, searchTerm)
        ) return true;
        return (f.skills || []).some((skill: string) => {
          const s = normalize(skill);
          return (
            s.includes(searchTerm) ||
            searchTerm.includes(s) ||
            hasWordOverlap(s, searchTerm)
          );
        });
      });
      setFreelancers(filtered);
      setLoading(false);
    };
    fetchFreelancers();
  }, [jobtitle]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowCard(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    async function fetchAIReport() {
      try {
        setAiReportError(null);
        const report = await aiService.getJobReport(jobtitle);
        setAiReport(report);
      } catch (e: any) {
        setAiReportError(e.message || 'Failed to get AI report');
      }
    }
    fetchAIReport();
  }, [jobtitle]);

  const handleAccept = () => {
    setStatus('accepted');
    setTimeout(() => {
      // Generate a unique job ID using timestamp and random string
      const jobId = `JOB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      navigate(`/job-in-progress/${jobId}`, {
        state: {
          freelancer: freelancers[current],
          aiReport,
          jobtitle
        }
      });
    }, 800); // short delay for feedback
  };
  const handleDecline = () => {
    setStatus('declined');
  };

  const freelancer = freelancers[current];

  return (
    <div className="searching-for-pro-container" style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', alignItems: 'flex-start' }}>
      {/* AI Report Card */}
      <div style={{ maxWidth: 340, background: '#f8fafc', borderRadius: 24, boxShadow: '0 4px 18px #2563eb11', padding: '2rem 1.5rem', minWidth: 260, marginTop: 0 }}>
        <h3 style={{ color: '#2563eb', fontWeight: 800, marginBottom: 12 }}>AI Job Report</h3>
        {aiReportError && <div style={{ color: '#dc2626', fontWeight: 700, marginBottom: 12 }}>{aiReportError}</div>}
        {aiReport ? (
          <>
            <div style={{ marginBottom: 16, color: '#23263a', fontWeight: 500 }}>{aiReport.report}</div>
            <div style={{ marginBottom: 8, color: '#15803d', fontWeight: 700 }}>Estimated Time: {aiReport.timeFrame}</div>
            <div style={{ color: '#f59e42', fontWeight: 700 }}>Estimated Cost: {aiReport.costEstimate}</div>
          </>
        ) : (
          <div style={{ color: '#6b7280', fontWeight: 500 }}>Generating report...</div>
        )}
      </div>
      {/* Freelancer Card */}
      <div>
        {(loading || !showCard) && (
          <>
            <div className="spinning-icon-wrapper" style={{ margin: '4rem 0' }}>
              <svg className="spinning-icon" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="34" stroke="#2563eb" strokeWidth="8" opacity="0.18" />
                <path d="M40 6a34 34 0 0 1 34 34" stroke="#2563eb" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="searching-title big-modern">
              We are searching for a <span className="jobtitle">{jobtitle}</span> near your location...
            </div>
          </>
        )}
        {showCard && !loading && (
          <>
            {freelancers.length === 0 && (
              <div className="no-match-message">No matching freelancer found for "{jobtitle}".</div>
            )}
            {freelancers.length > 0 && status === 'pending' && freelancer && (
              <div className="freelancer-card-mock big-modern" style={{ boxShadow: '0 8px 32px #2563eb22', borderRadius: 32, background: '#fff', padding: '2.5rem 2rem', maxWidth: 420, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 140,
                  height: 140,
                  background: '#e5e7eb',
                  borderRadius: '50%',
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 48,
                  color: '#2563eb',
                  overflow: 'hidden',
                  border: '5px solid #fff',
                  boxShadow: '0 4px 24px #2563eb22',
                }}>
                  {freelancer.avatar_url
                    ? <img src={freelancer.avatar_url} alt={freelancer.full_name || 'Freelancer'} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
                    : <span role="img" aria-label="User">👤</span>
                  }
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#23263a', margin: '0 0 0.3rem 0', textAlign: 'center' }}>{freelancer.full_name || freelancer.professional_title}</h2>
                <div className="freelancer-title-mock" style={{ color: '#2563eb', fontWeight: 700, fontSize: '1.18rem', marginBottom: 4, textAlign: 'center', textDecoration: 'underline', cursor: 'pointer' }}>{freelancer.professional_title}</div>
                <div className="freelancer-location-mock" style={{ color: '#6b7280', fontSize: '1.08rem', marginBottom: 12, textAlign: 'center' }}>{freelancer.location}</div>
                <div className="freelancer-skills-mock" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', margin: '0.7rem 0 1.2rem 0' }}>
                  {freelancer.skills?.map((skill, idx) => (
                    <span key={idx} style={{
                      background: '#22c55e',
                      color: '#fff',
                      borderRadius: 999,
                      padding: '0.35rem 1.1rem',
                      fontWeight: 700,
                      fontSize: '0.98rem',
                      letterSpacing: '0.2px',
                      boxShadow: '0 2px 8px #22c55e22',
                      display: 'inline-block',
                    }}>{skill}</span>
                  ))}
                </div>
                <div className="freelancer-rate-mock" style={{ color: '#15803d', fontWeight: 800, fontSize: '1.18rem', marginBottom: 10 }}>Hourly Rate: ${freelancer.hourly_rate}</div>
                <div className="freelancer-reviews-mock" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0.7rem 0 0.2rem 0', fontSize: '1.18rem' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < Math.round(freelancer.rating || 0) ? 'star filled' : 'star'} style={{ color: i < Math.round(freelancer.rating || 0) ? '#fbbf24' : '#e5e7eb', fontSize: '1.35em', marginRight: 2, transition: 'color 0.18s' }}>★</span>
                  ))}
                  <span className="review-count" style={{ fontSize: '1.08rem', color: '#6b7280', fontWeight: 700, marginLeft: 10 }}>{freelancer.review_count || 0} reviews</span>
                </div>
                <div className="freelancer-actions-mock big-modern" style={{ display: 'flex', gap: '1.2rem', marginTop: '2.2rem', width: '100%', justifyContent: 'center' }}>
                  <button className="accept-btn-mock big-modern" style={{ background: 'linear-gradient(90deg, #2563eb 60%, #1d4ed8 100%)', color: '#fff', border: 'none', padding: '1.2rem 3.2rem', borderRadius: 14, fontWeight: 900, fontSize: '1.25rem', cursor: 'pointer', boxShadow: '0 4px 16px #2563eb33', letterSpacing: '0.5px', transition: 'background 0.18s, box-shadow 0.18s, transform 0.18s' }} onClick={handleAccept}>Accept</button>
                  <button className="decline-btn-mock big-modern" style={{ background: '#fff', color: '#23263a', border: '3px solid #e5e7eb', padding: '1.2rem 3.2rem', borderRadius: 14, fontWeight: 900, fontSize: '1.25rem', cursor: 'pointer', letterSpacing: '0.5px', transition: 'background 0.18s, color 0.18s, border 0.18s, transform 0.18s' }} onClick={handleDecline}>Decline</button>
                </div>
              </div>
            )}
            {status === 'accepted' && (
              <div className="request-status-message accepted big-modern">Request accepted! {freelancer?.professional_title} will contact you soon.</div>
            )}
            {status === 'declined' && (
              <div className="request-status-message declined big-modern">Request declined. Please try another search.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchingForPro; 