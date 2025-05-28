import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { supabase } from '../config/supabase';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  const username = user?.user_metadata?.name || user?.email || 'User';
  const isLoggedIn = !!user;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">YourPro</Link>
      </div>

      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Home</Link>
        <Link to="/about" className="navbar-item">About</Link>
        {isLoggedIn ? (
          <>
            <span className="welcome-message">Welcome, {username}</span>
            <Link to="/profile" className="navbar-item">Profile</Link>
            <button className="sign-out" onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          !loading && <Link to="/login" className="navbar-item">Login</Link>
        )}
        <div className="navbar-item dropdown">
          <button className="dropdown-trigger">Register</button>
          <div className="dropdown-menu">
            <Link to="/client-registration" className="dropdown-item">
              As Client
            </Link>
            <Link to="/freelancer-registration" className="dropdown-item">
              As Freelancer
            </Link>
            <Link to="/company-registration" className="dropdown-item">
              As Company
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 