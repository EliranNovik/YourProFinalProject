import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Chip, Paper, Divider, Grid, Button, Dialog, DialogTitle, DialogContent, IconButton, TextField } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import BoltIcon from '@mui/icons-material/Bolt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CallIcon from '@mui/icons-material/Call';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import styles from './JobInProgress.module.css';
import MessageModal from '../components/MessageModal';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

interface TimelineStep {
  label: string;
  desc: string;
  time: string;
  done?: boolean;
  current?: boolean;
}

interface Message {
  id: number;
  text: string;
  sender: 'client' | 'freelancer';
  timestamp: Date;
}

const JobInProgress: React.FC = () => {
  const location = useLocation();
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help with your job. How can I assist you?",
      sender: 'freelancer',
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    full_name: string;
    professional_title?: string;
    avatar_url?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [freelancer, setFreelancer] = useState<any>(null);
  const [aiReport, setAiReport] = useState<any>(null);
  const [jobtitle, setJobtitle] = useState<string>('');
  const [stepStatus, setStepStatus] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      if (!jobId) return;
      
      try {
        // Fetch job details from live_jobs table
        const { data: jobData, error: jobError } = await supabase
          .from('live_jobs')
          .select('*')
          .eq('job_id', jobId)
          .single();
        
        if (jobError) throw jobError;
        
        setJobDetails(jobData);
        setJobtitle(jobData.job_title || '');
        setAiReport({
          report: jobData.ai_report || '',
          timeFrame: jobData.duration || '2-3 hours',
          costEstimate: jobData.cost_estimate || '$150-$300'
        });

        // Fetch freelancer details
        if (jobData.freelancer_id) {
          const { data: freelancerData, error: freelancerError } = await supabase
            .from('users')
            .select('*')
            .eq('id', jobData.freelancer_id)
            .single();
          
          if (freelancerError) throw freelancerError;
          
          setFreelancer(freelancerData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching job data:', error);
        setLoading(false);
      }
    };

    fetchJobData();
  }, [jobId]);

  // Polling: fetch stepStatus from Supabase every 10 seconds
  useEffect(() => {
    if (!jobDetails?.job_id) return;
    let interval: NodeJS.Timeout;
    const fetchStepStatus = async () => {
      const { data, error } = await supabase
        .from('live_jobs')
        .select('step_status')
        .eq('job_id', jobDetails.job_id)
        .single();
      if (data?.step_status) {
        setStepStatus(data.step_status);
      } else {
        setStepStatus(Array.from({ length: 6 }, () => ({ completed: false, time: null })));
      }
    };
    fetchStepStatus(); // initial fetch
    interval = setInterval(fetchStepStatus, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [jobDetails?.job_id]);

  useEffect(() => {
    if (stepStatus[5]?.completed && !paymentComplete) {
      setShowPaymentModal(true);
    }
  }, [stepStatus, paymentComplete]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading job details...</Typography>
      </Box>
    );
  }

  if (!jobDetails || !freelancer) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Job not found or you don't have permission to view it.</Typography>
      </Box>
    );
  }

  // Map freelancer stepStatus to client timeline
  const timelineSteps: TimelineStep[] = [
    { 
      label: 'Freelancer Assigned', 
      desc: `${freelancer?.full_name} has been assigned to your job`, 
      time: 'Just now',
      done: true
    },
    { 
      label: 'Booking Confirmed', 
      desc: 'Service request confirmed and scheduled', 
      time: 'Just now',
      done: true
    },
    { 
      label: 'Freelancer Arrived', 
      desc: 'Service provider is on-site and ready to begin', 
      time: stepStatus[0]?.completed ? stepStatus[0]?.time : 'Now',
      done: !!stepStatus[0]?.completed
    },
    { 
      label: 'Work in Progress', 
      desc: 'Installation work is currently underway', 
      time: stepStatus[1]?.completed ? stepStatus[1]?.time : 'Now',
      done: !!stepStatus[1]?.completed
    },
    { 
      label: 'Task Completed', 
      desc: 'Work completion and quality inspection', 
      time: stepStatus[5]?.completed ? stepStatus[5]?.time : 'Estimated soon',
      done: !!stepStatus[5]?.completed
    },
    { 
      label: 'Payment Done', 
      desc: 'Final payment processing and job closure', 
      time: paymentComplete ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'After completion',
      done: paymentComplete
    }
  ];

  // Update timeline steps based on freelancer's progress
  const getUpdatedTimelineSteps = () => {
    // Find the last completed step in stepStatus
    const lastCompletedIdx = stepStatus.findIndex(s => !s.completed);
    const completedIdx = lastCompletedIdx === -1 ? timelineSteps.length - 1 : lastCompletedIdx + 1;
    return timelineSteps.map((step, index) => ({
      ...step,
      done: index < completedIdx,
      current: index === completedIdx
    }));
  };

  const jobTitle = jobtitle ? `Job with ${freelancer?.full_name}` : 'Job In Progress';
  const jobDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const jobTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const estCompletion = aiReport?.timeFrame || '2-3 hours';

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'client',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simulate freelancer response after 1 second
    setTimeout(() => {
      const freelancerMessage: Message = {
        id: messages.length + 2,
        text: "I'll help you with that right away!",
        sender: 'freelancer',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, freelancerMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMessage = async (userId: string, userName: string, userTitle?: string, userAvatar?: string) => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      alert('You must be logged in to send a message.');
      return;
    }

    setSelectedUser({
      id: userId,
      full_name: userName,
      professional_title: userTitle,
      avatar_url: userAvatar
    });
    setShowMessageModal(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 6 }}>
      {/* Header */}
      <Box sx={{ background: '#fff', borderBottom: '1.5px solid #ececec', px: 5, py: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="#23263a" mb={0.5}>{jobTitle}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
            <Typography color="#6b7280" fontWeight={600} fontSize={15}>Job ID: {jobId}</Typography>
            <CalendarTodayIcon sx={{ fontSize: 18, color: '#6b7280', ml: 2, mr: 0.5 }} />
            <Typography color="#6b7280" fontWeight={600} fontSize={15}>{jobDate}</Typography>
            <AccessTimeIcon sx={{ fontSize: 18, color: '#6b7280', ml: 2, mr: 0.5 }} />
            <Typography color="#6b7280" fontWeight={600} fontSize={15}>{jobTime}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Chip label="In Progress" color="primary" sx={{ fontWeight: 700, fontSize: '1.1rem', borderRadius: '18px', px: 2, py: 1, mb: 1 }} />
          <Box sx={{ textAlign: 'right' }}>
            <Typography color="#6b7280" fontWeight={500} fontSize={15}>Estimated Completion</Typography>
            <Typography color="#23263a" fontWeight={900} fontSize={32} lineHeight={1}>{estCompletion}</Typography>
            <Typography color="#6b7280" fontWeight={500} fontSize={15}>Today</Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', mt: 4, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
        {/* Left: Service Professional & Timeline */}
        <Box sx={{ flex: 1.5, minWidth: 0 }}>
          {/* Service Professional Card */}
          <Paper elevation={0} sx={{ borderRadius: '18px', p: 4, mb: 4, boxShadow: '0 2px 12px #e5eaf1' }}>
            <Typography fontWeight={700} color="#23263a" fontSize={20} mb={2}>Service Professional</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar src={freelancer.avatar_url} sx={{ width: 80, height: 80, fontSize: 32, bgcolor: '#f3f4f6', color: '#23263a', boxShadow: '0 2px 12px #e5eaf1' }}>{freelancer.full_name?.split(' ').map((n: string) => n[0]).join('')}</Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontWeight={900} fontSize={22} color="#23263a">{freelancer.full_name}</Typography>
                  <Chip icon={<StarIcon sx={{ color: '#fbbf24', fontSize: 20 }} />} label={`${freelancer.rating || 0} (${freelancer.review_count || 0})`} sx={{ bgcolor: '#fef9c3', color: '#23263a', fontWeight: 700, fontSize: 16, borderRadius: '12px', ml: 1 }} />
                </Box>
                <Typography color="#6b7280" fontWeight={700} fontSize={17} mb={1}>{freelancer.professional_title}</Typography>
                <Typography color="#23263a" fontWeight={500} fontSize={15} mb={1}>{freelancer.description}</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {(freelancer.skills || []).map((skill: string, i: number) => (
                    <Chip key={i} label={skill} sx={{ bgcolor: '#f1f5f9', color: '#2563eb', fontWeight: 700, fontSize: 14, borderRadius: '10px' }} />
                  ))}
                </Box>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ bgcolor: '#e8f6ed', borderRadius: '12px', p: 2, boxShadow: 'none' }}>
                      <Typography fontWeight={700} color="#15803d" fontSize={16}>Status</Typography>
                      <Typography color="#15803d" fontWeight={600} fontSize={15}>Arrived - Working</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ bgcolor: '#eaf1fb', borderRadius: '12px', p: 2, boxShadow: 'none' }}>
                      <Typography fontWeight={700} color="#2563eb" fontSize={16}>Location</Typography>
                      <Typography color="#2563eb" fontWeight={600} fontSize={15}>{freelancer.location || 'At your location'}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>

          {/* Progress Timeline */}
          <Paper elevation={0} sx={{ borderRadius: '18px', p: 4, mb: 4, boxShadow: '0 2px 12px #e5eaf1', position: 'relative' }}>
            <Typography fontWeight={700} color="#23263a" fontSize={20} mb={2}>Progress Timeline</Typography>
            {/* Vertical Timeline Line (background) */}
            <Box sx={{
              position: 'absolute',
              left: 32/2 - 2,
              top: 56,
              bottom: 32,
              width: 4,
              bgcolor: '#e5eaf1',
              zIndex: 0,
              borderRadius: 2
            }} />
            <Box>
              {getUpdatedTimelineSteps().map((step, idx) => (
                <Box key={step.label} sx={{ display: 'flex', alignItems: 'flex-start', mb: idx < timelineSteps.length - 1 ? 6 : 0, position: 'relative', zIndex: 1 }}>
                  {/* Timeline Dot and Line */}
                  <Box sx={{ width: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <Box sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: step.done ? '#22c55e' : step.current ? '#2563eb' : '#e5eaf1',
                      border: `4px solid ${step.done ? '#22c55e' : step.current ? '#2563eb' : '#b0b0b0'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                      marginTop: 0,
                      marginBottom: 0
                    }}>
                      {step.done ? (
                        <CheckCircleIcon sx={{ color: '#fff', fontSize: 16 }} />
                      ) : step.current ? (
                        <RadioButtonCheckedIcon sx={{ color: '#fff', fontSize: 16 }} />
                      ) : null}
                    </Box>
                  </Box>
                  {/* Step Content */}
                  <Box sx={{ flex: 1, pl: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography 
                      fontWeight={step.current ? 900 : 700} 
                      color={step.current ? '#2563eb' : step.done ? '#15803d' : '#6b7280'} 
                      fontSize={17}
                      component="span"
                    >
                      {step.label}
                    </Typography>
                    <Typography color="#6b7280" fontSize={15} component="span">{step.desc}</Typography>
                    {step.current && (
                      <Typography color="#2563eb" fontSize={14} fontWeight={700} component="span">
                        Currently in progress
                      </Typography>
                    )}
                  </Box>
                  {/* Timestamp */}
                  <Box sx={{ minWidth: 110, textAlign: 'right', pl: 2 }}>
                    <Typography color="#b0b0b0" fontSize={14}>{step.time}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Payment Button */}
          {((getUpdatedTimelineSteps()[5]?.current || getUpdatedTimelineSteps()[5]?.done) && !paymentComplete) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Button
                variant="contained"
                onClick={() => setShowPaymentModal(true)}
                sx={{
                  bgcolor: '#22c55e',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 16,
                  py: 2,
                  px: 4,
                  borderRadius: '12px',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#16a34a'
                  },
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
                }}
                startIcon={<CheckCircleIcon />}
              >
                Complete Payment
              </Button>
            </Box>
          )}
        </Box>

        {/* Right: AI Job Analysis & Quick Actions */}
        <Box sx={{ flex: 1, minWidth: 320 }}>
          {/* AI Job Analysis */}
          <Paper elevation={0} sx={{ borderRadius: '18px', p: 4, mb: 4, boxShadow: '0 2px 12px #e5eaf1' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <BoltIcon sx={{ color: '#a259f7', fontSize: 32 }} />
              <Typography fontWeight={900} color="#23263a" fontSize={20}>AI Job Analysis</Typography>
              <Typography color="#b0b0b0" fontSize={14} ml="auto">Updated: Just now</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography fontWeight={700} color="#23263a" fontSize={16} mb={1}>Job Requirements</Typography>
            <Typography color="#6b7280" fontSize={15} mb={2}>{aiReport.report}</Typography>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12}>
                <Paper sx={{ bgcolor: '#f6f8fa', borderRadius: '10px', p: 2, boxShadow: 'none' }}>
                  <Typography fontWeight={700} color="#23263a" fontSize={15}>Estimated Duration</Typography>
                  <Typography color="#23263a" fontWeight={600} fontSize={15}>{aiReport.timeFrame}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ bgcolor: '#fef9c3', borderRadius: '10px', p: 2, boxShadow: 'none' }}>
                  <Typography fontWeight={700} color="#b45309" fontSize={15}>Estimated Cost</Typography>
                  <Typography color="#b45309" fontWeight={600} fontSize={15}>{aiReport.costEstimate}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ bgcolor: '#f6f8fa', borderRadius: '10px', p: 2, boxShadow: 'none' }}>
                  <Typography fontWeight={700} color="#23263a" fontSize={15}>Job Type</Typography>
                  <Typography color="#23263a" fontWeight={600} fontSize={15}>{jobtitle}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Quick Actions */}
          <Paper elevation={0} sx={{ borderRadius: '18px', p: 0, mb: 4, boxShadow: '0 2px 12px #e5eaf1' }}>
            <Typography fontWeight={900} color="#23263a" fontSize={20} px={4} pt={4} pb={2}>Quick Actions</Typography>
            <Divider />
            <Box>
              <Button 
                fullWidth 
                sx={{ justifyContent: 'flex-start', bgcolor: '#eaf1fb', color: '#2563eb', borderRadius: 0, borderTopLeftRadius: '18px', borderTopRightRadius: '18px', p: 3, fontWeight: 700, fontSize: 17, textTransform: 'none', gap: 2 }} 
                startIcon={<ChatBubbleOutlineIcon sx={{ color: '#2563eb', fontSize: 24 }} />} 
                endIcon={<span style={{ marginLeft: 'auto', color: '#2563eb', fontSize: 22 }}>→</span>}
                onClick={() => handleMessage(freelancer.id, freelancer.full_name, freelancer.professional_title, freelancer.avatar_url)}
              >
                Message <Typography component="span" color="#6b7280" fontWeight={500} fontSize={15} ml={2}>Real-time chat</Typography>
              </Button>
              <Divider />
              <Button fullWidth sx={{ justifyContent: 'flex-start', bgcolor: '#e8f6ed', color: '#15803d', borderRadius: 0, p: 3, fontWeight: 700, fontSize: 17, textTransform: 'none', gap: 2 }} startIcon={<CallIcon sx={{ color: '#15803d', fontSize: 24 }} />} endIcon={<span style={{ marginLeft: 'auto', color: '#15803d', fontSize: 22 }}>→</span>}>
                Call <Typography component="span" color="#6b7280" fontWeight={500} fontSize={15} ml={2}>Direct contact</Typography>
              </Button>
              <Divider />
              <Button fullWidth sx={{ justifyContent: 'flex-start', bgcolor: '#f6e6f4', color: '#a259f7', borderRadius: 0, borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px', p: 3, fontWeight: 700, fontSize: 17, textTransform: 'none', gap: 2 }} startIcon={<PhotoCameraIcon sx={{ color: '#a259f7', fontSize: 24 }} />} endIcon={<span style={{ marginLeft: 'auto', color: '#a259f7', fontSize: 22 }}>→</span>}>
                Photos <Typography component="span" color="#6b7280" fontWeight={500} fontSize={15} ml={2}>Live progress</Typography>
              </Button>
            </Box>
          </Paper>

          {/* Photos Section */}
          <Paper elevation={0} sx={{ borderRadius: '18px', p: 4, mb: 4, boxShadow: '0 2px 12px #e5eaf1' }}>
            <Typography fontWeight={900} color="#23263a" fontSize={20} mb={2}>Photos</Typography>
            {stepStatus.filter(s => s.photo).length === 0 ? (
              <div style={{ color: '#888', textAlign: 'center', padding: 16 }}>No photos uploaded yet.</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {stepStatus.map((s, i) =>
                  s.photo ? (
                    <img
                      key={i}
                      src={s.photo}
                      alt={`Step ${i + 1} photo`}
                      style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1.5px solid #e5eaf1' }}
                    />
                  ) : null
                )}
              </div>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Messenger Dialog */}
      <Dialog 
        open={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '18px',
            height: '80vh',
            maxHeight: '800px'
          }
        }}
      >
        <DialogTitle sx={{ 
          p: 2, 
          borderBottom: '1px solid #e5eaf1',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Avatar 
            src={freelancer.avatar_url} 
            sx={{ width: 40, height: 40, bgcolor: '#f3f4f6', color: '#23263a' }}
          >
            {freelancer.full_name?.split(' ').map((n: string) => n[0]).join('')}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={700} fontSize={16}>{freelancer.full_name}</Typography>
            <Typography color="#6b7280" fontSize={14}>{freelancer.professional_title}</Typography>
          </Box>
          <IconButton onClick={() => setIsChatOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ 
          p: 0, 
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: '#f8fafc'
        }}>
          {/* Messages Container */}
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'client' ? 'flex-end' : 'flex-start',
                  gap: 1
                }}
              >
                {message.sender === 'freelancer' && (
                  <Avatar 
                    src={freelancer.avatar_url} 
                    sx={{ width: 32, height: 32, bgcolor: '#f3f4f6', color: '#23263a' }}
                  >
                    {freelancer.full_name?.split(' ').map((n: string) => n[0]).join('')}
                  </Avatar>
                )}
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      bgcolor: message.sender === 'client' ? '#2563eb' : '#fff',
                      color: message.sender === 'client' ? '#fff' : '#23263a',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Typography fontSize={15} component="span">{message.text}</Typography>
                  </Paper>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block',
                      mt: 0.5,
                      color: '#6b7280',
                      textAlign: message.sender === 'client' ? 'right' : 'left'
                    }}
                    component="span"
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          
          {/* Message Input */}
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid #e5eaf1',
            bgcolor: '#fff',
            display: 'flex',
            gap: 1
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={4}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: '#f8fafc'
                }
              }}
            />
            <IconButton 
              onClick={handleSendMessage}
              sx={{ 
                bgcolor: '#2563eb',
                color: '#fff',
                '&:hover': { bgcolor: '#1d4ed8' }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Add MessageModal */}
      {selectedUser && (
        <MessageModal
          open={showMessageModal}
          onClose={() => {
            setShowMessageModal(false);
            setSelectedUser(null);
          }}
          recipient={selectedUser}
        />
      )}

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onClose={() => {}} maxWidth="xs" fullWidth>
        {!paymentComplete ? (
          <>
            <DialogTitle>Pay for Your Job</DialogTitle>
            <DialogContent>
              <div style={{ marginBottom: 18 }}>
                <b>Job:</b> {jobtitle}<br />
                <b>Amount:</b> {aiReport?.costEstimate || '$150-$300'}<br />
                <b>Duration:</b> {aiReport?.timeFrame || '2-3 hours'}
              </div>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="payment-method-label">Payment Method</InputLabel>
                <Select
                  labelId="payment-method-label"
                  value={paymentMethod}
                  label="Payment Method"
                  onChange={e => setPaymentMethod(e.target.value)}
                >
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="PayPal">PayPal</MenuItem>
                  <MenuItem value="Google Pay">Google Pay</MenuItem>
                  <MenuItem value="Apple Pay">Apple Pay</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <button
                style={{
                  background: '#2563eb', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 28px', border: 'none', cursor: 'pointer'
                }}
                onClick={() => {
                  setPaymentComplete(true);
                  // Mark all steps up to and including Payment Done as completed
                  setStepStatus(prev => {
                    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const updated = prev.map((step, idx) =>
                      idx <= 5
                        ? { ...step, completed: true, time: step.time || now }
                        : step
                    );
                    if (jobDetails?.job_id) {
                      localStorage.setItem(`livejob_steps_${jobDetails.job_id}`, JSON.stringify(updated));
                    }
                    return updated;
                  });
                  setTimeout(() => {
                    setShowPaymentModal(false);
                  }, 2000);
                }}
              >
                Confirm & Pay
              </button>
            </DialogActions>
          </>
        ) : (
          <DialogContent sx={{ textAlign: 'center', py: 6 }}>
            <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 60, mb: 2 }} />
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Thank you for your payment!</div>
            <div style={{ color: '#6b7280', fontSize: 16 }}>Your job is now complete.</div>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
};

export default JobInProgress; 