import { supabase } from '../config/supabase';
import { User, Session } from '@supabase/supabase-js';

export interface FreelancerProfile {
  professional_title: string;
  education: string;
  languages: string[];
  hourly_rate: number;
  package_rate: number;
  services: string[];
}

export interface CompanyProfile {
  company_name: string;
  industry: string;
  location: string;
  description: string;
  specialties: string[];
  work_types: string[];
}

export interface ClientProfile {
  full_name: string;
  phone_number: string;
  location: string;
  interests: string[];
}

export const authService = {
  // Sign up a new user
  async signUp(email: string, password: string, name: string, role: 'client' | 'freelancer' | 'company') {
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (signUpError) throw signUpError;

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    return { user, session };
  },

  // Sign in
  async signIn(email: string, password: string) {
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    return { user, session };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Create freelancer profile
  async createFreelancerProfile(userId: string, profile: FreelancerProfile) {
    const { error } = await supabase
      .from('freelancer_profiles')
      .insert([
        {
          user_id: userId,
          ...profile,
        },
      ]);

    if (error) throw error;
  },

  // Create company profile
  async createCompanyProfile(userId: string, profile: CompanyProfile) {
    const { error } = await supabase
      .from('company_profiles')
      .insert([
        {
          user_id: userId,
          ...profile,
        },
      ]);

    if (error) throw error;
  },

  async createClientProfile(userId: string, profile: ClientProfile) {
    const { error } = await supabase
      .from('client_profiles')
      .insert([
        {
          user_id: userId,
          ...profile,
        },
      ]);

    if (error) throw error;
  },
}; 