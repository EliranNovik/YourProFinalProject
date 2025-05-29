import { supabase } from './supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface JobDispatch {
  id: string;
  jobId: string;
  jobTitle: string;
  location: string;
  costEstimate: string;
  duration: string;
  freelancerId: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at?: string;
}

interface JobDispatchPayload {
  jobId: string;
  jobTitle: string;
  location: string;
  costEstimate: string;
  duration: string;
  freelancerId: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface RealtimePayload {
  new: JobDispatch;
  old: JobDispatch | null;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}

class JobDispatchService {
  async createJobDispatch(payload: JobDispatchPayload): Promise<JobDispatch> {
    try {
      // Generate a unique jobId if not provided
      const jobId = payload.jobId || `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const dispatchPayload = { ...payload, jobId };

      console.log('Dispatch created for:', dispatchPayload.freelancerId);
      const { data, error } = await supabase
        .from('job_dispatches')
        .insert([
          {
            ...dispatchPayload,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as JobDispatch;
    } catch (error) {
      console.error('Error creating job dispatch:', error);
      throw error;
    }
  }

  async getPendingJobDispatches(freelancerId: string): Promise<JobDispatch[]> {
    try {
      const { data, error } = await supabase
        .from('job_dispatches')
        .select('*')
        .eq('freelancerId', freelancerId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error getting pending job dispatches:', error);
      throw error;
    }
  }

  async updateJobDispatchStatus(
    dispatchId: string,
    status: 'accepted' | 'declined'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('job_dispatches')
        .update({ status })
        .eq('id', dispatchId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating job dispatch status:', error);
      throw error;
    }
  }

  subscribeToJobDispatches(
    freelancerId: string,
    callback: (dispatch: JobDispatch) => void
  ): RealtimeChannel {
    console.log('Subscribing to job_dispatches for freelancerId:', freelancerId);
    const subscription = supabase
      .channel('job-dispatches')
      .on(
        'postgres_changes' as any,
        {
          event: 'INSERT',
          schema: 'public',
          table: 'job_dispatches'
        },
        (payload: any) => {
          const dispatch = payload.new;
          console.log('Supabase real-time payload:', dispatch);
          if (dispatch.freelancerId === freelancerId) {
            console.log('Received new dispatch for this freelancer:', dispatch);
            callback(dispatch);
          }
        }
      )
      .subscribe();

    return subscription;
  }
}

export const jobDispatchService = new JobDispatchService(); 