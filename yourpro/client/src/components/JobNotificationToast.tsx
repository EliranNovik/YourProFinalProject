import React from 'react';
import { JobDispatch } from '../services/jobDispatchService';
import './JobNotificationToast.css';

interface JobNotificationToastProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  aiReport: string;
  location: string;
  costEstimate: string;
  duration: string;
}

const JobNotificationToast: React.FC<JobNotificationToastProps> = ({
  open,
  onClose,
  onAccept,
  onDecline,
  aiReport,
  location,
  costEstimate,
  duration,
}) => {
  if (!open) return null;

  return (
    <div className="job-notification-toast">
      <div className="toast-content">
        <h3>New Job Opportunity!</h3>
        <p>Job: {aiReport}</p>
        <p>Location: {location}</p>
        <p>Estimated Cost: {costEstimate}</p>
        <p>Duration: {duration}</p>
        <div className="toast-actions">
          <button className="accept-btn" onClick={onAccept}>
            Accept
          </button>
          <button className="decline-btn" onClick={onDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobNotificationToast; 