import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { Box, Typography, Avatar, CircularProgress, Divider, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import JobInProgress from './JobInProgress';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const ClientJobsInProgress: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { jobId } = useParams();
  const location = useLocation();

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      // Fetch all jobs for this client from the requests table
      const { data: jobsData, error } = await supabase
        .from('requests')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });
      setJobs(jobsData || []);
      setLoading(false);
    }
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    if (!search) return true;
    return (
      (job.job_title || '').toLowerCase().includes(search.toLowerCase()) ||
      (job.location || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  // Find the selected job based on the jobId in the URL
  const selectedJob = jobs.find(job => job.job_id === jobId) || jobs[0];

  // If no jobId in URL, navigate to the first job
  React.useEffect(() => {
    if (!loading && jobs.length > 0 && (!jobId || !selectedJob)) {
      navigate(`/client-jobs-in-progress/${jobs[0].job_id}`, { replace: true });
    }
  }, [loading, jobs, jobId, selectedJob, navigate]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      {/* Sidebar */}
      <Paper elevation={2} sx={{ width: 340, minWidth: 300, maxWidth: 400, height: '100vh', borderRadius: 0, borderRight: '1.5px solid #e5e7eb', p: 0, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3, borderBottom: '1.5px solid #e5e7eb', bgcolor: '#fff' }}>
          <Typography variant="h5" fontWeight={900} mb={2} color="#23263a">My Jobs</Typography>
          <TextField
            fullWidth
            placeholder="Search jobs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { borderRadius: 2, background: '#f8fafc' }
            }}
            sx={{ mb: 2, borderRadius: 2, background: '#f8fafc' }}
          />
        </Box>
        <Divider />
        <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: '#fff' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {filteredJobs.map(job => (
                <ListItem
                  key={job.job_id}
                  button
                  selected={jobId === job.job_id}
                  onClick={() => navigate(`/client-jobs-in-progress/${job.job_id}`)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: jobId === job.job_id ? '#eaf1fb' : '#fff',
                    border: jobId === job.job_id ? '2px solid #2563eb' : '2px solid transparent',
                    boxShadow: jobId === job.job_id ? '0 2px 12px #2563eb11' : '0 1px 6px #e5eaf1',
                    transition: 'all 0.18s',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#2563eb', color: '#fff' }}>{(job.job_title || 'J')[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography fontWeight={700} color="#23263a">{job.job_title || 'Job'}</Typography>}
                    secondary={<>
                      <Typography fontSize={13} color="#2563eb" fontWeight={700}>{job.status || 'pending'}</Typography>
                      <Typography fontSize={12} color="#888">{job.location}</Typography>
                      <Typography fontSize={12} color="#b0b0b0" mt={0.5}>Requested: {job.created_at ? new Date(job.created_at).toLocaleDateString() : ''}</Typography>
                    </>}
                  />
                </ListItem>
              ))}
              {filteredJobs.length === 0 && (
                <Typography color="#888" p={3} textAlign="center">No jobs found.</Typography>
              )}
            </List>
          )}
        </Box>
      </Paper>
      {/* Main Content */}
      <Box sx={{ flex: 1, minHeight: '100vh', bgcolor: '#f8fafc', p: 0 }}>
        {selectedJob ? (
          <JobInProgress key={selectedJob.job_id} />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Typography color="#888">Select a job to view details</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ClientJobsInProgress; 