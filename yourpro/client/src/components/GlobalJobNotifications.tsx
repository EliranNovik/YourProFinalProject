import React from 'react';
import { useFreelancer } from '../contexts/FreelancerContext';
import JobDispatchListener from './JobDispatchListener';

const GlobalJobNotifications: React.FC = () => {
  const { freelancerId } = useFreelancer();

  if (!freelancerId) {
    return null;
  }

  return <JobDispatchListener freelancerId={freelancerId} />;
};

export default GlobalJobNotifications; 