// Route: /live-jobs
// LiveJobs.tsx - Modern Live Jobs page for freelancers
// TODO: Fetch real job data for the freelancer and map steps dynamically
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../config/supabase';
import './LiveJobs.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import jobInProgressStyles from './JobInProgress.module.css';
import LiveJobsRightPanelStyles from './LiveJobsRightPanel.module.css';

const stepLabels = [
  'Arrive & Confirm',
  'Initial Inspection',
  'Equipment Check',
  'Maintenance Work',
  'Final Testing',
  'Complete & Report',
];

const defaultStepStatus = stepLabels.map(() => ({ completed: false, time: null, note: null, photo: null }));

// Utility functions for localStorage step status
function getStepStatusFromStorage(jobId: any, defaultStepStatus: any) {
  const key = `livejob_steps_${jobId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultStepStatus;
}
function setStepStatusToStorage(jobId: any, stepStatus: any) {
  const key = `livejob_steps_${jobId}`;
  localStorage.setItem(key, JSON.stringify(stepStatus));
}

const LiveJobs: React.FC = () => {
  const location = useLocation();
  const navState = location.state as any;
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState<any>(null);
  const [stepStatus, setStepStatus] = useState<any[]>(defaultStepStatus);
  const [showPhotoInput, setShowPhotoInput] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });
  const [showNoteInput, setShowNoteInput] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });
  const [noteInput, setNoteInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [freelancerId, setFreelancerId] = useState<string | null>(null);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [freelancerProfile, setFreelancerProfile] = useState<any>(null);
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // Fetch current user (freelancer) and all jobs
  useEffect(() => {
    async function fetchUserAndJobs() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setFreelancerId(user.id);
      // Fetch all jobs for this freelancer
      const { data: jobs, error } = await supabase
        .from('live_jobs')
        .select('*')
        .eq('freelancer_id', user.id)
        .order('created_at', { ascending: false });
      setAllJobs(jobs || []);
      // If coming from navigation, select the jobId from state
      let initialJobId = navState?.jobId;
      if (!initialJobId && jobs && jobs.length > 0) initialJobId = jobs[0].id;
      setSelectedJobId(initialJobId);
      setLoading(false);
    }
    fetchUserAndJobs();
    // eslint-disable-next-line
  }, []);

  // Fetch selected job details and related profiles
  useEffect(() => {
    async function fetchSelectedJob() {
      if (!selectedJobId) return;
      setLoading(true);
      const { data: job, error } = await supabase
        .from('live_jobs')
        .select('*')
        .eq('id', selectedJobId)
        .single();
      setJobData(job);
      // Use localStorage for step status
      const localSteps = getStepStatusFromStorage(job?.job_id, defaultStepStatus);
      setStepStatus(localSteps);
      // Set current step to first incomplete
      const firstIncomplete = localSteps.findIndex((s: any) => !s.completed);
      setCurrentStep(firstIncomplete === -1 ? stepLabels.length - 1 : firstIncomplete);
      // Fetch freelancer profile
      if (job?.freelancer_id) {
        const { data: freelancer, error: fErr } = await supabase
          .from('users')
          .select('id, full_name, email')
          .eq('id', job.freelancer_id)
          .single();
        setFreelancerProfile(freelancer);
      }
      // Fetch client profile (try users, then client_profiles)
      let client = null;
      if (job?.client_id) {
        const { data: userClient, error: cErr } = await supabase
          .from('users')
          .select('id, full_name, email')
          .eq('id', job.client_id)
          .single();
        if (userClient && userClient.full_name) {
          client = userClient;
        } else {
          const { data: profileClient, error: pErr } = await supabase
            .from('client_profiles')
            .select('id, full_name, display_name')
            .eq('user_id', job.client_id)
            .single();
          if (profileClient) {
            client = { ...profileClient, full_name: profileClient.full_name || profileClient.display_name };
          }
        }
      }
      setClientProfile(client);
      setLoading(false);
    }
    fetchSelectedJob();
    // eslint-disable-next-line
  }, [selectedJobId]);

  const handleStepClick = (idx: number) => {
    if (idx !== currentStep) return;
    // Arrive & Confirm step
    if (idx === 0) {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newTimes = [...stepStatus.map(s => ({ ...s, time: time }))];
      setStepStatus(newTimes);
      setCurrentStep(1);
    }
  };

  // Remove DB step status update, use localStorage only
  const handleAddPhoto = async (idx: any, photoValue: any) => {
    const newStatus = stepStatus.map((s, i) => i === idx ? { ...s, photo: photoValue } : s);
    setStepStatus(newStatus);
    setStepStatusToStorage(jobData.job_id, newStatus);
  };

  const handleAddNote = async (idx: any, noteValue: any) => {
    const newStatus = stepStatus.map((s, i) => i === idx ? { ...s, note: noteValue } : s);
    setStepStatus(newStatus);
    setStepStatusToStorage(jobData.job_id, newStatus);
  };

  const handleCompleteStep = async (idx: any) => {
    if (idx !== currentStep) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newStatus = stepStatus.map((s, i) => i === idx ? { ...s, completed: true, time } : s);
    setStepStatus(newStatus);
    setStepStatusToStorage(jobData.job_id, newStatus);
    const next = idx + 1;
    if (next < stepLabels.length) setCurrentStep(next);
  };

  // Progress bar width
  const progress = ((stepStatus.filter(s => s.completed).length) / stepLabels.length) * 100;

  // Filter and search jobs
  const filteredJobs = allJobs.filter(job => {
    // Date filter
    if (dateFilter !== 'all') {
      const jobDate = new Date(job.created_at);
      const now = new Date();
      if (dateFilter === 'today') {
        if (jobDate.toDateString() !== now.toDateString()) return false;
      } else if (dateFilter === 'last7') {
        const diff = (now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diff > 7) return false;
      }
    }
    // Search by client name or job id
    const clientName = job.client_name || job.client_full_name || '';
    const jobId = job.job_id || '';
    return (
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', height: '100vh' }}>
      {/* Sidebar flush to the left edge, scrollable */}
      <div className="live-jobs-sidebar" style={{ paddingTop: 0, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Sticky/fixed top controls */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', padding: '24px 18px 0 18px', boxShadow: '0 2px 8px #e5eaf111' }}>
          <div style={{ fontWeight: 900, fontSize: 22, color: '#2563eb', textAlign: 'center', marginBottom: 18, marginTop: 0 }}>My Live Jobs</div>
          <input
            type="text"
            placeholder="Search by client or job ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1.5px solid #e5eaf1',
              fontSize: 15,
              marginBottom: 10,
              background: '#f8fafd',
              outline: 'none',
              boxSizing: 'border-box',
              fontWeight: 500
            }}
          />
          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1.5px solid #e5eaf1',
              fontSize: 15,
              background: '#f8fafd',
              fontWeight: 500,
              marginBottom: 10
            }}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="last7">Last 7 Days</option>
          </select>
        </div>
        {/* Scrollable job list */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: '0 12px', marginTop: 8 }}>
          {filteredJobs.map(job => {
            // Use client name for the title
            const clientName = job.client_name || job.client_full_name || 'Client';
            // Format date
            const dateStr = job.created_at ? new Date(job.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
            return (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                style={{
                  background: selectedJobId === job.id ? '#eaf1fb' : '#f8fafd',
                  border: selectedJobId === job.id ? '2px solid #2563eb' : '2px solid transparent',
                  borderRadius: 12,
                  padding: '14px 16px',
                  cursor: 'pointer',
                  boxShadow: selectedJobId === job.id ? '0 2px 12px #2563eb11' : '0 1px 6px #e5eaf1',
                  fontWeight: 600,
                  color: '#23263a',
                  marginBottom: 4,
                  transition: 'all 0.18s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <span style={{ fontSize: 16 }}>{clientName}</span>
                <span style={{ fontSize: 13, color: '#2563eb', fontWeight: 700 }}>{job.step_status?.filter((s: any) => s.completed).length || 0}/{stepLabels.length} steps</span>
                <span style={{ fontSize: 12, color: '#888' }}>{job.location}</span>
                <span style={{ fontSize: 12, color: '#b0b0b0', marginTop: 2 }}>Received: {dateStr}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Main job details area, attached to sidebar, full height */}
      <div style={{ flex: 2.2, minHeight: '100vh', height: '100vh', display: 'flex', alignItems: 'flex-start', background: 'transparent', justifyContent: 'center' }}>
        <div className="live-jobs-container" style={{ height: '100vh', margin: 0, borderRadius: 0, boxShadow: 'none', background: 'transparent', padding: '40px 40px 40px 0', maxWidth: 900 }}>
          <div className="job-card">
            <div className="job-header">
              <div className="job-title">{clientProfile?.full_name || clientProfile?.display_name || 'Client Name'}</div>
              <div className="job-id">{jobData?.job_id || '#SJ-2025-001'}</div>
            </div>
            <div className="job-meta-row">
              <div className="job-user">
                <div className="user-avatar">
                  <span className="user-avatar-initial">{freelancerProfile?.full_name ? freelancerProfile.full_name[0] : 'F'}</span>
                </div>
                <div>
                  <div className="user-name">{freelancerProfile?.full_name || 'Freelancer'}</div>
                  <div className="user-id">ID: {freelancerProfile?.id || '-'}</div>
                </div>
              </div>
              <div className="job-pay">
                <div className="job-amount">{jobData?.cost_estimate || '$285'}</div>
                <div className="job-hours">{jobData?.duration || '3.5h paid'}</div>
              </div>
            </div>
            <div className="job-location-row">
              <span className="job-location-label">{jobData?.location || 'John Smith - 123 Main St, City'}</span>
            </div>
            <div className="job-progress-row">
              <div className="progress-label">Progress</div>
              <div className="progress-count">{stepStatus.filter(s => s.completed).length}/{stepLabels.length}</div>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="steps-list">
            {stepLabels.map((label, idx) => {
              const isCompleted = !!stepStatus[idx].completed;
              const isActive = currentStep === idx && !isCompleted;
              return (
                <div
                  key={label}
                  className={`step-card${isCompleted ? ' completed' : ''}${isActive ? ' active' : ''}`}
                  style={{ cursor: isActive ? 'pointer' : 'default' }}
                  onClick={() => idx === 0 ? handleStepClick(0) : undefined}
                >
                  <div className="step-header">
                    {isCompleted ? (
                      <CheckCircleIcon className="step-icon completed" />
                    ) : idx === 0 && !isCompleted ? (
                      <AccessTimeIcon className="step-icon active" />
                    ) : (
                      <span className="step-circle" />
                    )}
                    <span className="step-label">{label}</span>
                    {isCompleted && <span className="step-time">{stepStatus[idx].time}</span>}
                    {isActive && !isCompleted && idx === 0 && <span className="step-time">Click to confirm</span>}
                  </div>
                  {/* Add Photo/Note buttons for every step */}
                  {isActive && !isCompleted && (
                    <>
                      <div className="step-actions">
                        <button className="step-action-btn" onClick={() => setShowPhotoInput({ open: true, idx })}>
                          <AddPhotoAlternateIcon /> Add Photo
                        </button>
                        <button className="step-action-btn" onClick={() => setShowNoteInput({ open: true, idx })}>
                          <NoteAddIcon /> Add Note
                        </button>
                      </div>
                      <button className="step-complete-btn neutral" onClick={() => handleCompleteStep(idx)}>
                        <CheckCircleIcon /> Complete {label}
                      </button>
                    </>
                  )}
                  {/* Show indicators if photo/note exists for this step */}
                  {(stepStatus[idx].photo || stepStatus[idx].note) && (
                    <div className="step-note">
                      {stepStatus[idx].photo && <>📷 Photo added &nbsp;</>}
                      {stepStatus[idx].note && <>📝 {stepStatus[idx].note}</>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Simulated Add Photo Dialog */}
          {showPhotoInput.open && showPhotoInput.idx !== null && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Add Photo</h3>
                <input type="file" accept="image/*" onChange={async e => {
                  await handleAddPhoto(showPhotoInput.idx!, 'photo');
                  setShowPhotoInput({ open: false, idx: null });
                }} />
                <button className="close-btn" onClick={() => setShowPhotoInput({ open: false, idx: null })}>Close</button>
              </div>
            </div>
          )}
          {/* Simulated Add Note Dialog */}
          {showNoteInput.open && showNoteInput.idx !== null && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Add Note</h3>
                <textarea value={noteInput} onChange={e => setNoteInput(e.target.value)} placeholder="Type your note here..." />
                <div style={{ display: 'flex', gap: 8, width: '100%', justifyContent: 'center' }}>
                  <button onClick={async () => {
                    await handleAddNote(showNoteInput.idx!, noteInput);
                    setShowNoteInput({ open: false, idx: null });
                    setNoteInput('');
                  }}>Save Note</button>
                  <button className="close-btn" onClick={() => setShowNoteInput({ open: false, idx: null })}>Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Right panel: AI Job Analysis, Messages, Photos */}
      <div className={LiveJobsRightPanelStyles.rightPanel}>
        {/* AI Job Analysis Card */}
        <div className={LiveJobsRightPanelStyles.card + ' ' + LiveJobsRightPanelStyles.aiCard}>
          <div className={LiveJobsRightPanelStyles.cardHeader}>
            <span className={LiveJobsRightPanelStyles.cardIcon}>⚡️</span>
            <span className={LiveJobsRightPanelStyles.cardTitle}>AI Job Analysis</span>
          </div>
          <div className={LiveJobsRightPanelStyles.cardBody}>
            <div className={LiveJobsRightPanelStyles.aiDescription}>{jobData?.ai_report || 'No AI report available.'}</div>
            <div className={LiveJobsRightPanelStyles.aiGrid}>
              <div>
                <div className={LiveJobsRightPanelStyles.gridLabel}>Est. Time</div>
                <div className={LiveJobsRightPanelStyles.gridValue}>{jobData?.duration || '-'}</div>
              </div>
              <div>
                <div className={LiveJobsRightPanelStyles.gridLabel}>Est. Cost</div>
                <div className={LiveJobsRightPanelStyles.gridValue}>{jobData?.cost_estimate || '-'}</div>
              </div>
              <div>
                <div className={LiveJobsRightPanelStyles.gridLabel}>Job Type</div>
                <div className={LiveJobsRightPanelStyles.gridValue}>{jobData?.job_type || 'electrician'}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Messages Card */}
        <div className={LiveJobsRightPanelStyles.card + ' ' + LiveJobsRightPanelStyles.messagesCard}>
          <div className={LiveJobsRightPanelStyles.cardHeader}>
            <span className={LiveJobsRightPanelStyles.cardIcon}>💬</span>
            <span className={LiveJobsRightPanelStyles.cardTitle}>Messages</span>
          </div>
          <div className={LiveJobsRightPanelStyles.cardBody}>
            <div className={LiveJobsRightPanelStyles.messagesPlaceholder}>Chat coming soon...</div>
          </div>
        </div>
        {/* Photos Card */}
        <div className={LiveJobsRightPanelStyles.card + ' ' + LiveJobsRightPanelStyles.photosCard}>
          <div className={LiveJobsRightPanelStyles.cardHeader}>
            <span className={LiveJobsRightPanelStyles.cardIcon}>📷</span>
            <span className={LiveJobsRightPanelStyles.cardTitle}>Photos</span>
          </div>
          <div className={LiveJobsRightPanelStyles.cardBody}>
            <div className={LiveJobsRightPanelStyles.photosPlaceholder}>Photos coming soon...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveJobs; 