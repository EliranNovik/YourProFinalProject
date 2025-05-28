import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import './Register.css';

const Register: React.FC = () => {
  const [step, setStep] = useState<'register' | 'profile' | 'done'>('register');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [profile, setProfile] = useState({ phone: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription?.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (user && step === 'register') {
      setStep('profile');
    }
  }, [user, step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const { fullName, email, password } = form;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage('Registration successful! Please check your email to confirm your account.');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Save additional profile info to your DB (optional)
    // Example: await supabase.from('client_profiles').upsert({ user_id: user.id, ...profile });
    setLoading(false);
    setStep('done');
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={step === 'register' ? handleRegister : handleProfileSubmit}>
        {step === 'register' && (
          <>
            <h1>Register as Client</h1>
            <div className="subtitle">Create your account to get started</div>
            <div className="form-group">
              <label>Full Name</label>
              <input name="fullName" type="text" value={form.fullName} onChange={handleChange} required placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email address" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Password" />
            </div>
            <button className="register-button" type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
            {error && <div style={{ color: '#dc2626', marginTop: 12 }}>{error}</div>}
            {message && <div style={{ color: '#15803d', marginTop: 12 }}>{message}</div>}
          </>
        )}
        {step === 'profile' && user && (
          <>
            <h1>Complete Your Profile</h1>
            <div className="subtitle">Tell us a bit more about yourself</div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" type="text" value={profile.phone} onChange={handleProfileChange} placeholder="Phone number" />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input name="location" type="text" value={profile.location} onChange={handleProfileChange} placeholder="Your location" />
            </div>
            <button className="register-button" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Profile'}</button>
            {error && <div style={{ color: '#dc2626', marginTop: 12 }}>{error}</div>}
          </>
        )}
        {step === 'done' && (
          <>
            <h1>Welcome!</h1>
            <div className="subtitle">Your profile is complete. You can now use YourPro as a client.</div>
            <button className="register-button" type="button" onClick={() => navigate('/')}>Go to Home</button>
          </>
        )}
      </form>
    </div>
  );
};

export default Register;
