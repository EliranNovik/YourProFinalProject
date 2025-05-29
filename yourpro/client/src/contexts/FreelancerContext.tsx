import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

interface FreelancerContextType {
  freelancerId: string | null;
  setFreelancerId: (id: string | null) => void;
}

const FreelancerContext = createContext<FreelancerContextType | undefined>(undefined);

export const FreelancerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [freelancerId, setFreelancerId] = useState<string | null>(null);

  useEffect(() => {
    // Get the current user's session
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setFreelancerId(session.user.id);
        console.log('Set freelancerId (user.id) in context:', session.user.id);
      }
    };

    getCurrentUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setFreelancerId(session.user.id);
        console.log('Auth state change, set freelancerId (user.id) in context:', session.user.id);
      } else {
        setFreelancerId(null);
        console.log('Auth state change, set freelancerId to null');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <FreelancerContext.Provider value={{ freelancerId, setFreelancerId }}>
      {children}
    </FreelancerContext.Provider>
  );
};

export const useFreelancer = () => {
  const context = useContext(FreelancerContext);
  if (context === undefined) {
    throw new Error('useFreelancer must be used within a FreelancerProvider');
  }
  return context;
}; 