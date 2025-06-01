import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { aiService } from '../services/aiService';
import { jobDispatchService } from '../services/jobDispatchService';
import './SearchingForPro.css';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

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
  const [aiReport, setAiReport] = useState<{ report: string; timeFrame: string; costEstimate: string } | null>(null);
  const [aiReportError, setAiReportError] = useState<string | null>(null);
  const dispatchesCreatedRef = useRef(false);
  const [acceptedFreelancer, setAcceptedFreelancer] = useState<DBFreelancer | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true);
      console.log('Searching for freelancers with job title:', jobtitle);
      
      const { data, error } = await supabase
        .from('freelancer_profiles')
        .select('*');
      
      if (error) {
        console.error('Error fetching freelancers:', error);
        return;
      }

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

      console.log('Found matching freelancers:', filtered);
      setFreelancers(filtered);
      setLoading(false);
    };

    fetchFreelancers();
  }, [jobtitle]);

  useEffect(() => {
    async function createJobAndDispatches() {
      if (
        freelancers.length > 0 &&
        aiReport &&
        !dispatchesCreatedRef.current
      ) {
        dispatchesCreatedRef.current = true;
        const newJobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setJobId(newJobId);
        // Get current client user id
        const { data: { user } } = await supabase.auth.getUser();
        const clientId = user?.id;
        // Use fallback for location (aiReport does not have location)
        const jobLocation = 'Unknown'; // Or use a value from client input if available
        const jobDescription = aiReport?.report || '';
        // Insert ONE row into requests table (per job)
        await supabase.from('requests').insert([{
          job_id: newJobId,
          client_id: clientId,
          job_title: jobtitle,
          description: jobDescription,
          location: jobLocation,
          status: 'open',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
        // Deduplicate freelancers by user_id
        const uniqueFreelancers = Array.from(
          new Map(freelancers.map(f => [f.user_id, f])).values()
        );
        try {
          const dispatchPromises = uniqueFreelancers.map(freelancer => {
            return jobDispatchService.createJobDispatch({
              jobId: newJobId,
              jobTitle: jobtitle,
              location: freelancer.location || 'Unknown',
              costEstimate: aiReport?.costEstimate || '$150-$300',
              duration: aiReport?.timeFrame || '2-3 hours',
              freelancerId: freelancer.user_id,
              status: 'pending'
            });
          });
          Promise.all(dispatchPromises).then(results => {
            console.log('Successfully created job dispatches:', results);
          });
        } catch (error) {
          console.error('Error creating job dispatches:', error);
        }
      }
    }
    createJobAndDispatches();
  }, [freelancers, aiReport, jobtitle]);

  useEffect(() => {
    if (!jobId) return;
    const interval = setInterval(async () => {
      const { data: request, error } = await supabase
        .from('requests')
        .select('freelancer_id, status')
        .eq('job_id', jobId)
        .single();
      
      if (request && request.freelancer_id && request.status === 'assigned') {
        // Fetch freelancer profile
        const { data: freelancerData } = await supabase
          .from('freelancer_profiles')
          .select('*')
          .eq('user_id', request.freelancer_id)
          .single();
        
        if (freelancerData) {
          setAcceptedFreelancer(freelancerData);
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [jobId]);

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

  const handleConfirmFreelancer = async () => {
    if (!jobId || !acceptedFreelancer) return;
    try {
      // Update request status to 'confirmed'
      const { error } = await supabase
        .from('requests')
        .update({ status: 'confirmed' })
        .eq('job_id', jobId);
      if (error) throw error;

      // Insert into live_jobs for the assigned freelancer
      const { data: { user } } = await supabase.auth.getUser();
      const clientId = user?.id;
      const jobLocation = 'Unknown'; // Or use a value from client input if available
      const defaultStepStatus = [
        { completed: false, time: null, note: null, photo: null },
        { completed: false, time: null, note: null, photo: null },
        { completed: false, time: null, note: null, photo: null },
        { completed: false, time: null, note: null, photo: null },
        { completed: false, time: null, note: null, photo: null },
        { completed: false, time: null, note: null, photo: null }
      ];
      const { error: liveJobError } = await supabase.from('live_jobs').insert([
        {
          job_id: jobId,
          freelancer_id: acceptedFreelancer.user_id,
          client_id: clientId,
          step_status: defaultStepStatus,
          cost_estimate: aiReport?.costEstimate || '$150-$300',
          duration: aiReport?.timeFrame || '2-3 hours',
          job_title: jobtitle,
          location: jobLocation,
          ai_report: aiReport?.report || '',
          created_at: new Date().toISOString()
        }
      ]);
      if (liveJobError) {
        alert('Failed to insert into live_jobs: ' + liveJobError.message);
        return;
      }

      // Navigate to job in progress page with freelancer and AI report data
      navigate(`/job-in-progress/${jobId}`, {
        state: {
          freelancer: acceptedFreelancer,
          aiReport: aiReport,
          jobtitle: jobtitle
        }
      });
    } catch (error) {
      console.error('Error confirming freelancer:', error);
      alert('Failed to confirm freelancer. Please try again.');
    }
  };

  return (
    <div className="searching-for-pro-modern-layout">
      <div className="searching-center-content">
        {/* Loading/Searching State */}
        <div className="modern-centered-card">
          {(!acceptedFreelancer && (loading || freelancers.length > 0)) && (
            <>
              <div className="spinning-icon-wrapper">
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
        </div>

        {/* AI Job Report Section */}
        <div className="ai-job-report-modern">
          <div className="ai-job-report-title">
            <AutoAwesomeIcon />
            AI Job Analysis
          </div>
          {aiReportError && <div className="ai-job-report-error">{aiReportError}</div>}
          {aiReport ? (
            <>
              <div className="ai-job-report-summary">{aiReport.report}</div>
              <div className="ai-job-report-row">
                <span className="ai-job-report-label">Estimated Time:</span>
                <span className="ai-job-report-value time">{aiReport.timeFrame}</span>
              </div>
              <div className="ai-job-report-row">
                <span className="ai-job-report-label">Estimated Cost:</span>
                <span className="ai-job-report-value cost">{aiReport.costEstimate}</span>
              </div>
            </>
          ) : (
            <div className="ai-job-report-loading">Generating report...</div>
          )}
        </div>
      </div>

      {/* Accepted Freelancer Card */}
      {acceptedFreelancer && (
        <div className="accepted-freelancer-card">
          <h2>Freelancer Accepted Your Job!</h2>
          <div className="freelancer-info">
            <img 
              src={acceptedFreelancer.avatar_url || '/default-avatar.png'} 
              alt={acceptedFreelancer.full_name || 'Freelancer'} 
              className="freelancer-avatar"
            />
            <div className="freelancer-details">
              <h3>{acceptedFreelancer.full_name || 'Professional'}</h3>
              <p>{acceptedFreelancer.professional_title}</p>
              <p>Location: {acceptedFreelancer.location}</p>
              <p>Hourly Rate: ${acceptedFreelancer.hourly_rate}/hr</p>
              {acceptedFreelancer.rating && (
                <p>Rating: {acceptedFreelancer.rating} ({acceptedFreelancer.review_count} reviews)</p>
              )}
            </div>
          </div>
          <div className="action-buttons">
            <button 
              className="confirm-button"
              onClick={handleConfirmFreelancer}
            >
              Confirm Freelancer
            </button>
            <button 
              className="decline-button"
              onClick={() => {
                setAcceptedFreelancer(null);
              }}
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchingForPro; 