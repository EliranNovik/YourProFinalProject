import { supabase } from '../config/supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'freelancer' | 'company';
  avatar_url?: string;
}

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

export const authService = {
  // Sign up a new user
  async signUp(email: string, password: string, name: string, role: 'client' | 'freelancer' | 'company') {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            name,
            role,
          },
        ]);

      if (profileError) throw profileError;
    }

    return authData;
  },

  // Sign in
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return profile;
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
}; 