import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobDispatchService, JobDispatch } from '../services/jobDispatchService';
import JobNotificationToast from './JobNotificationToast';

interface JobDispatchListenerProps {
  freelancerId: string;
}

const JobDispatchListener: React.FC<JobDispatchListenerProps> = ({ freelancerId }) => {
  console.log('JobDispatchListener rendered with freelancerId:', freelancerId);
  const navigate = useNavigate();
  const [currentDispatch, setCurrentDispatch] = useState<JobDispatch | null>(null);
  const [showToast, setShowToast] = useState(false);
  const declinedJobIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true;

    const fetchPendingDispatches = async () => {
      if (!isMounted) return;
      console.log('Polling for jobs at', new Date().toISOString());
      try {
        const pendingDispatches = await jobDispatchService.getPendingJobDispatches(freelancerId);
        console.log('Fetched pending dispatches:', pendingDispatches.map(j => ({id: j.id, jobId: j.jobId, status: j.status})));
        const nextJob = (pendingDispatches || []).find(
          (job) => job.status === 'pending' && job.jobId && !declinedJobIdsRef.current.has(job.jobId)
        );
        if (nextJob) {
          setCurrentDispatch(nextJob);
          setShowToast(true);
        }
      } catch (error) {
        console.error('Error fetching pending dispatches:', error);
      }
    };

    fetchPendingDispatches();

    const interval = setInterval(fetchPendingDispatches, 5000);

    const subscription = jobDispatchService.subscribeToJobDispatches(
      freelancerId,
      (dispatch) => {
        console.log('Received new dispatch in subscription:', dispatch.id, dispatch.jobId, dispatch.status);
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
      await jobDispatchService.updateJobDispatchStatus(currentDispatch.id, 'accepted');
      setShowToast(false);
      navigate(`/job-in-progress/${currentDispatch.id}`);
    } catch (error) {
      console.error('Error accepting job:', error);
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
      jobTitle={currentDispatch.jobTitle}
      location={currentDispatch.location}
      costEstimate={currentDispatch.costEstimate}
      duration={currentDispatch.duration}
    />
  ) : null;
};

export default JobDispatchListener; 