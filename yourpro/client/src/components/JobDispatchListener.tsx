import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobDispatchService, JobDispatch } from '../services/jobDispatchService';
import JobNotificationToast from './JobNotificationToast';
import { supabase } from '../config/supabase';

interface JobDispatchListenerProps {
  freelancerId: string;
}

interface JobDescriptionMap {
  [jobId: string]: string;
}

const JobDispatchListener: React.FC<JobDispatchListenerProps> = ({ freelancerId }) => {
  console.log('JobDispatchListener rendered with freelancerId:', freelancerId);
  const navigate = useNavigate();
  const [currentDispatch, setCurrentDispatch] = useState<JobDispatch | null>(null);
  const [showToast, setShowToast] = useState(false);
  const declinedJobIdsRef = useRef<Set<string>>(new Set());
  const [jobDescriptions, setJobDescriptions] = useState<JobDescriptionMap>({});

  useEffect(() => {
    let isMounted = true;

    const fetchPendingDispatches = async () => {
      if (!isMounted) return;
      console.log('Polling for jobs at', new Date().toISOString());
      try {
        const pendingDispatches = await jobDispatchService.getPendingJobDispatches(freelancerId);
        console.log('Fetched pending dispatches:', pendingDispatches.map(j => ({id: j.id, jobId: j.jobId, status: j.status})));
        // For each dispatch, check if the job is still open
        for (const job of pendingDispatches) {
          const { data: request } = await supabase
            .from('requests')
            .select('status,freelancer_id,description')
            .eq('job_id', job.jobId)
            .single();
          if (request && (request.status !== 'open' || request.freelancer_id)) {
            continue; // skip jobs that are already assigned
          }
          if (request && request.description) {
            setJobDescriptions(prev => ({ ...prev, [job.jobId]: request.description }));
          }
          if (job.status === 'pending' && job.jobId && !declinedJobIdsRef.current.has(job.jobId)) {
            setCurrentDispatch(job);
            setShowToast(true);
            return;
          }
        }
        setCurrentDispatch(null);
        setShowToast(false);
      } catch (error) {
        console.error('Error fetching pending dispatches:', error);
      }
    };

    fetchPendingDispatches();

    const interval = setInterval(fetchPendingDispatches, 5000);

    const subscription = jobDispatchService.subscribeToJobDispatches(
      freelancerId,
      async (dispatch) => {
        // Check if the job is still open
        const { data: request } = await supabase
          .from('requests')
          .select('status,freelancer_id,description')
          .eq('job_id', dispatch.jobId)
          .single();
        if (request && (request.status !== 'open' || request.freelancer_id)) {
          return;
        }
        if (request && request.description) {
          setJobDescriptions(prev => ({ ...prev, [dispatch.jobId]: request.description }));
        }
        if (dispatch.status === 'pending' && dispatch.jobId && !declinedJobIdsRef.current.has(dispatch.jobId)) {
          setCurrentDispatch(dispatch);
          setShowToast(true);
        }
      }
    );

    console.log('Subscription object:', subscription);

    return () => {
      isMounted = false;
      console.log('Cleaning up subscription and polling...');
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [freelancerId]);

  const handleAcceptJob = async () => {
    if (!currentDispatch) return;
    try {
      const { data, error } = await supabase.rpc('accept_job', {
        in_job_id: currentDispatch.jobId,
        in_freelancer_id: freelancerId
      });
      if (data === 'accepted') {
        setShowToast(false);
        navigate('/live-jobs', {
          state: {
            jobId: currentDispatch.jobId,
            jobTitle: currentDispatch.jobTitle,
            location: currentDispatch.location,
            costEstimate: currentDispatch.costEstimate,
            duration: currentDispatch.duration
          }
        });
      } else if (data === 'already_taken') {
        setShowToast(false);
        alert('Job already taken by another freelancer.');
      } else if (error) {
        console.error('Error accepting job:', error);
        alert('An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error accepting job:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleDeclineJob = async () => {
    if (!currentDispatch) return;

    try {
      await jobDispatchService.updateJobDispatchStatus(currentDispatch.id, 'declined');
      if (currentDispatch.jobId) {
        declinedJobIdsRef.current.add(currentDispatch.jobId);
      }
      setShowToast(false);
    } catch (error) {
      console.error('Error declining job:', error);
    }
  };

  return currentDispatch && currentDispatch.status === 'pending' && currentDispatch.jobId && !declinedJobIdsRef.current.has(currentDispatch.jobId) ? (
    <JobNotificationToast
      open={showToast}
      onClose={() => setShowToast(false)}
      onAccept={handleAcceptJob}
      onDecline={handleDeclineJob}
      aiReport={`${jobDescriptions[currentDispatch.jobId] ? ` ${jobDescriptions[currentDispatch.jobId]}` : ''}`}
      location={currentDispatch.location}
      costEstimate={currentDispatch.costEstimate}
      duration={currentDispatch.duration}
    />
  ) : null;
};

export default JobDispatchListener; 