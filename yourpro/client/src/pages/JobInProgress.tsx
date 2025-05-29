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
import { useLocation } from 'react-router-dom';
import styles from './JobInProgress.module.css';

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
  sender: 'user' | 'freelancer';
  timestamp: Date;
}

const JobInProgress: React.FC = () => {
  const location = useLocation();
  const { freelancer, aiReport, jobtitle } = (location.state || {}) as any;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(2); // Freelancer Arrived (index 2)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help with your job. How can I assist you?",
      sender: 'freelancer',
      timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Fallback mock data if not present
  const fallbackFreelancer = {
    full_name: 'John Martinez',
    professional_title: 'Licensed Electrician',
    rating: 4.9,
    review_count: 127,
    avatar_url: '',
    description: 'Experienced electrician specializing in residential installations. Licensed and insured with over 8 years of experience in electrical work.',
    badges: ['Licensed Electrician', 'Insured', 'Background Checked', '8 years exp.'],
    status: 'Arrived - Working',
    location: 'At your location',
  };
  const fallbackAIReport = {
    requirements: 'Client needs 3 pendant lights installed in kitchen island area with dimmer switch',
    duration: '2–3 hours',
    complexity: 'Medium',
    materials: 'Pendant lights (provided), dimmer switch, electrical wire',
    updated: 'Today, 11:45 AM',
  };

  const f = freelancer || fallbackFreelancer;
  const ai = aiReport || fallbackAIReport;

  // Define timeline steps
  const timelineSteps: TimelineStep[] = [
    { 
      label: 'Freelancer Assigned', 
      desc: `${f.full_name} has been assigned to your job`, 
      time: 'Yesterday, 4:15 PM',
      done: true
    },
    { 
      label: 'Booking Confirmed', 
      desc: 'Service request confirmed and scheduled', 
      time: 'Yesterday, 3:22 PM',
      done: true
    },
    { 
      label: 'Freelancer Arrived', 
      desc: 'Service provider is on-site and ready to begin', 
      time: 'Today, 12:15 PM'
    },
    { 
      label: 'Work in Progress', 
      desc: 'Installation work is currently underway', 
      time: 'Now'
    },
    { 
      label: 'Task Completed', 
      desc: 'Work completion and quality inspection', 
      time: 'Estimated 2:15 PM'
    },
    { 
      label: 'Payment Done', 
      desc: 'Final payment processing and job closure', 
      time: 'Estimated 2:30 PM'
    }
  ];

  // Update timeline steps based on current step
  const getUpdatedTimelineSteps = () => {
    return timelineSteps.map((step, index) => ({
      ...step,
      done: index < currentStep,
      current: index === currentStep
    }));
  };

  const jobTitle = jobtitle ? `Job with ${f.full_name}` : 'Job In Progress';
  const jobId = 'JOB-2025-8471';
  const jobDate = 'Tuesday, May 27';
  const jobTime = '19:12';
  const estCompletion = '2:30 PM';

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
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
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, display: 'flex', gap: 4, alignItems: 'flex-start' }}>
        {/* Left: Service Professional & Timeline */}
        <Box sx={{ flex: 1.5, minWidth: 0 }}>
          {/* Service Professional Card */}
          <Paper elevation={0} sx={{ borderRadius: '18px', p: 4, mb: 4, boxShadow: '0 2px 12px #e5eaf1' }}>
            <Typography fontWeight={700} color="#23263a" fontSize={20} mb={2}>Service Professional</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar src={f.avatar_url} sx={{ width: 80, height: 80, fontSize: 32, bgcolor: '#f3f4f6', color: '#23263a', boxShadow: '0 2px 12px #e5eaf1' }}>{f.full_name?.split(' ').map((n: string) => n[0]).join('')}</Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontWeight={900} fontSize={22} color="#23263a">{f.full_name}</Typography>
                  <Chip icon={<StarIcon sx={{ color: '#fbbf24', fontSize: 20 }} />} label={`${f.rating || 0} (${f.review_count || 0})`} sx={{ bgcolor: '#fef9c3', color: '#23263a', fontWeight: 700, fontSize: 16, borderRadius: '12px', ml: 1 }} />
                </Box>
                <Typography color="#6b7280" fontWeight={700} fontSize={17} mb={1}>{f.professional_title}</Typography>
                <Typography color="#23263a" fontWeight={500} fontSize={15} mb={1}>{f.description}</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {(f.badges || []).map((b: string, i: number) => (
                    <Chip key={i} label={b} sx={{ bgcolor: '#f1f5f9', color: '#2563eb', fontWeight: 700, fontSize: 14, borderRadius: '10px' }} />
                  ))}
                </Box>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ bgcolor: '#e8f6ed', borderRadius: '12px', p: 2, boxShadow: 'none' }}>
                      <Typography fontWeight={700} color="#15803d" fontSize={16}>Status</Typography>
                      <Typography color="#15803d" fontWeight={600} fontSize={15}>{f.status || 'Arrived - Working'}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ bgcolor: '#eaf1fb', borderRadius: '12px', p: 2, boxShadow: 'none' }}>
                      <Typography fontWeight={700} color="#2563eb" fontSize={16}>Location</Typography>
                      <Typography color="#2563eb" fontWeight={600} fontSize={15}>{f.location || 'At your location'}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ alignSelf: 'flex-start' }}>
                <Button variant="text" sx={{ minWidth: 0, p: 1, color: '#6b7280' }}>⋮</Button>
              </Box>
            </Box>
          </Paper>

          {/* Progress Timeline */}
          <Paper elevation={0} sx={{ borderRadius: '18px', p: 4, mb: 4, boxShadow: '0 2px 12px #e5eaf1', position: 'relative' }}>
            <Typography fontWeight={700} color="#23263a" fontSize={20} mb={2}>Progress Timeline</Typography>
            {/* Vertical Timeline Line (background) */}
            <Box sx={{
              position: 'absolute',
              left: 32/2 - 2, // center of dot column
              top: 56, // below the title
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
                    >
                      {step.label}
                    </Typography>
                    <Typography color="#6b7280" fontSize={15}>{step.desc}</Typography>
                    {step.current && (
                      <Typography color="#2563eb" fontSize={14} fontWeight={700}>
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
        </Box>

        {/* Right: AI Job Analysis & Quick Actions */}
        <Box sx={{ flex: 1, minWidth: 320 }}>
          {/* AI Job Analysis */}
          <Paper elevation={0} sx={{ borderRadius: '18px', p: 4, mb: 4, boxShadow: '0 2px 12px #e5eaf1' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <BoltIcon sx={{ color: '#a259f7', fontSize: 32 }} />
              <Typography fontWeight={900} color="#23263a" fontSize={20}>AI Job Analysis</Typography>
              <Typography color="#b0b0b0" fontSize={14} ml="auto">Updated: {ai.updated || 'Just now'}</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography fontWeight={700} color="#23263a" fontSize={16} mb={1}>Job Requirements</Typography>
            <Typography color="#6b7280" fontSize={15} mb={2}>{ai.report || ai.requirements}</Typography>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12}>
                <Paper sx={{ bgcolor: '#f6f8fa', borderRadius: '10px', p: 2, boxShadow: 'none' }}>
                  <Typography fontWeight={700} color="#23263a" fontSize={15}>Estimated Duration</Typography>
                  <Typography color="#23263a" fontWeight={600} fontSize={15}>{ai.timeFrame || ai.duration}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ bgcolor: '#fef9c3', borderRadius: '10px', p: 2, boxShadow: 'none' }}>
                  <Typography fontWeight={700} color="#b45309" fontSize={15}>Estimated Cost</Typography>
                  <Typography color="#b45309" fontWeight={600} fontSize={15}>{ai.costEstimate || 'Not specified'}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ bgcolor: '#f6f8fa', borderRadius: '10px', p: 2, boxShadow: 'none' }}>
                  <Typography fontWeight={700} color="#23263a" fontSize={15}>Job Type</Typography>
                  <Typography color="#23263a" fontWeight={600} fontSize={15}>{ai.jobTitle || 'Not specified'}</Typography>
                </Paper>
              </Grid>
            </Grid>
            {ai.keywords && ai.keywords.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography fontWeight={700} color="#23263a" fontSize={15} mb={1}>Key Details</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {ai.keywords.map((keyword: string, index: number) => (
                    <Chip
                      key={index}
                      label={keyword}
                      sx={{
                        bgcolor: '#f1f5f9',
                        color: '#2563eb',
                        fontWeight: 600,
                        fontSize: 14,
                        borderRadius: '8px'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
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
                onClick={() => setIsChatOpen(true)}
              >
                Message <Typography color="#6b7280" fontWeight={500} fontSize={15} ml={2}>Real-time chat</Typography>
              </Button>
              <Divider />
              <Button fullWidth sx={{ justifyContent: 'flex-start', bgcolor: '#e8f6ed', color: '#15803d', borderRadius: 0, p: 3, fontWeight: 700, fontSize: 17, textTransform: 'none', gap: 2 }} startIcon={<CallIcon sx={{ color: '#15803d', fontSize: 24 }} />} endIcon={<span style={{ marginLeft: 'auto', color: '#15803d', fontSize: 22 }}>→</span>}>Call <Typography color="#6b7280" fontWeight={500} fontSize={15} ml={2}>Direct contact</Typography></Button>
              <Divider />
              <Button fullWidth sx={{ justifyContent: 'flex-start', bgcolor: '#f6e6f4', color: '#a259f7', borderRadius: 0, borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px', p: 3, fontWeight: 700, fontSize: 17, textTransform: 'none', gap: 2 }} startIcon={<PhotoCameraIcon sx={{ color: '#a259f7', fontSize: 24 }} />} endIcon={<span style={{ marginLeft: 'auto', color: '#a259f7', fontSize: 22 }}>→</span>}>Photos <Typography color="#6b7280" fontWeight={500} fontSize={15} ml={2}>Live progress</Typography></Button>
            </Box>
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
            src={f.avatar_url} 
            sx={{ width: 40, height: 40, bgcolor: '#f3f4f6', color: '#23263a' }}
          >
            {f.full_name?.split(' ').map((n: string) => n[0]).join('')}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={700} fontSize={16}>{f.full_name}</Typography>
            <Typography color="#6b7280" fontSize={14}>{f.professional_title}</Typography>
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
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: 1
                }}
              >
                {message.sender === 'freelancer' && (
                  <Avatar 
                    src={f.avatar_url} 
                    sx={{ width: 32, height: 32, bgcolor: '#f3f4f6', color: '#23263a' }}
                  >
                    {f.full_name?.split(' ').map((n: string) => n[0]).join('')}
                  </Avatar>
                )}
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      bgcolor: message.sender === 'user' ? '#2563eb' : '#fff',
                      color: message.sender === 'user' ? '#fff' : '#23263a',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Typography fontSize={15}>{message.text}</Typography>
                  </Paper>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block',
                      mt: 0.5,
                      color: '#6b7280',
                      textAlign: message.sender === 'user' ? 'right' : 'left'
                    }}
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
    </Box>
  );
};

export default JobInProgress; 