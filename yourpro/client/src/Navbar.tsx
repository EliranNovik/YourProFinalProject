import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './styles/Navbar.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: (
    <svg width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>
  ) },
  { name: 'Clients', path: '/clients', icon: (
    <svg width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>
  ) },
  { name: 'Bookings', path: '/bookings', icon: (
    <svg width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M4 11h16"/></svg>
  ) },
  { name: 'Processes', path: '/processes', icon: (
    <svg width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
  ) },
  { name: 'Administration', path: '/administration', icon: (
    <svg width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
  ) },
  { name: 'Notification', path: '/notification', icon: (
    <svg width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
  ) },
  { name: 'Payments', path: '/payments', icon: (
    <svg width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
  ) },
  { name: 'Settings', path: '/settings', icon: (
    <svg width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
  ) },
  {
    name: 'Requests',
    path: '/requests',
    icon: (
      <svg width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M4 11h16"/><circle cx="12" cy="17" r="1.5"/></svg>
    )
  },
];

const topNavItems = [
  { name: 'Home', path: '/' },
  { name: 'My Profile', path: '/profile' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Professionals', path: '/professionals' },
  { name: 'Login', path: '/login' },
  { name: 'Messages', path: '/messages' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const [topNavExpanded, setTopNavExpanded] = useState(false);
  const [sideNavExpanded, setSideNavExpanded] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<{ name: string; path: string }[]>([]);
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const allFeatures: { name: string; path: string }[] = [
    ...navItems.map(i => ({ name: i.name, path: i.path })),
    ...topNavItems.filter(i => i.path !== '/').map(i => ({ name: i.name, path: i.path })),
  ];

  useEffect(() => {
    if (search.trim() === '') {
      setSearchResults([]);
      return;
    }
    setSearchResults(
      allFeatures.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const menu = document.getElementById('mobile-nav-menu');
      if (menu && !menu.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (isMobile) setSidebarVisible(false);
    else setSidebarVisible(true);
  }, [isMobile]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return;
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!isMobile) return;
    if (
      touchStartX.current !== null &&
      touchEndX.current !== null &&
      touchEndX.current - touchStartX.current > 60
    ) {
      setSidebarVisible(false);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleSearchSelect = (path: string) => {
    setSearch('');
    setSearchResults([]);
    navigate(path);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={2}
        color="default"
        sx={{
          zIndex: 1201,
          background: '#fff',
          borderRadius: { xs: 0, sm: 3 },
          boxShadow: '0 2px 12px #e5eaf1',
          px: { xs: 1, sm: 4 },
          py: 0,
          height: isHomePage ? 72 : topNavExpanded ? 72 : 56,
          transition: 'height 0.3s',
          justifyContent: 'center',
        }}
        onMouseEnter={() => !isHomePage && setTopNavExpanded(true)}
        onMouseLeave={() => !isHomePage && setTopNavExpanded(false)}
        onFocus={() => !isHomePage && setTopNavExpanded(true)}
        onBlur={() => !isHomePage && setTopNavExpanded(false)}
        tabIndex={0}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: '0!important',
            height: '100%',
            px: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          {/* Logo - left aligned */}
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 160 }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="primary"
                aria-label="open drawer"
                onClick={() => setMobileMenuOpen(open => !open)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              component={Link}
              to="/"
              sx={{
                fontWeight: 900,
                fontSize: isHomePage ? '2rem' : topNavExpanded ? '2rem' : '1.4rem',
                color: '#2563eb',
                letterSpacing: '-1px',
                textDecoration: 'none',
                transition: 'font-size 0.3s',
                mr: 3,
                ml: { xs: 1, sm: 0 },
                whiteSpace: 'nowrap',
              }}
            >
              YourPro
            </Typography>
          </Box>

          {/* Nav links - centered */}
          <Box
            className="nav-links"
            sx={{
              display: isMobile ? 'none' : 'flex',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 6,
              opacity: isHomePage ? 1 : topNavExpanded ? 1 : 0,
              transition: 'opacity 0.2s',
              pointerEvents: isHomePage || topNavExpanded ? 'auto' : 'none',
            }}
          >
            {topNavItems.filter(i => i.path !== '/').map(item => (
              <Button
                key={item.name}
                component={Link}
                to={item.path}
                color="primary"
                sx={{ 
                  fontWeight: 500, 
                  fontSize: '1.05rem', 
                  px: 2, 
                  py: 1,
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    background: 'rgba(37,99,235,0.08)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.15)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: '0%',
                    height: '2px',
                    background: '#2563eb',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)',
                  },
                  '&:hover::after': {
                    width: '80%',
                  }
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>

          {/* Search bar - right aligned */}
          <Box
            sx={{
              display: isMobile ? 'none' : 'flex',
              alignItems: 'center',
              minWidth: 260,
              maxWidth: 340,
              ml: 3,
              opacity: isHomePage ? 1 : topNavExpanded ? 1 : 0,
              transition: 'opacity 0.2s',
              pointerEvents: isHomePage || topNavExpanded ? 'auto' : 'none',
            }}
          >
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search features..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => !isHomePage && setTopNavExpanded(true)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#2563eb' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 999,
                  background: '#f7f9fb',
                  fontSize: '1rem',
                  minWidth: 180,
                },
              }}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 999,
                  background: '#f7f9fb',
                  fontSize: '1rem',
                },
              }}
            />
            {search && searchResults.length > 0 && (
              <Box className="nav-search-dropdown" sx={{ position: 'absolute', top: 48, right: 0, width: '100%', zIndex: 2000 }}>
                {searchResults.map(result => (
                  <Box
                    key={result.path}
                    className="nav-search-result"
                    onMouseDown={() => handleSearchSelect(result.path)}
                    sx={{ px: 2, py: 1, cursor: 'pointer', '&:hover': { background: '#f1f5f9' } }}
                  >
                    {result.name}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(30,41,59,0.96)',
            zIndex: 5000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 70,
          }}
        >
          {topNavItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: '#fff',
                fontSize: 22,
                fontWeight: 600,
                margin: '18px 0',
                textDecoration: 'none',
                borderBottom: location.pathname === item.path ? '2px solid #2563eb' : 'none',
                padding: '4px 0',
                width: '80%',
                textAlign: 'center',
                borderRadius: 6,
                background: location.pathname === item.path ? 'rgba(37,99,235,0.12)' : 'none',
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}

      {/* Right sidebar */}
      {(!isMobile || sidebarVisible) && (
        <Box sx={{ position: 'fixed', top: 0, right: 0, height: '100vh', zIndex: 2000, pointerEvents: 'auto' }}>
          <aside
            className={`right-fixed-sidebar${sideNavExpanded ? ' expanded' : ''}`}
            onMouseEnter={() => setSideNavExpanded(true)}
            onMouseLeave={() => setSideNavExpanded(false)}
            tabIndex={0}
            onFocus={() => setSideNavExpanded(true)}
            onBlur={() => setSideNavExpanded(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              ...(isMobile ? { 
                transition: 'transform 0.25s', 
                transform: sidebarVisible ? 'translateX(0)' : 'translateX(100%)', 
                zIndex: 3000 
              } : {}),
              marginTop: isHomePage ? '72px' : 0,
            }}
          >
            {/* Arrow button to close sidebar on mobile */}
            {isMobile && sidebarVisible && (
              <button
                className="sidebar-arrow-btn close"
                aria-label="Close sidebar"
                onClick={() => setSidebarVisible(false)}
                style={{
                  position: 'absolute',
                  top: 16,
                  left: -36,
                  zIndex: 4100,
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0 12px 12px 0',
                  width: 36,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px #2563eb22',
                  cursor: 'pointer',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            )}
            <ul className="sidebar-list">
              {navItems.map(item => (
                <li key={item.name} className={location.pathname === item.path ? 'active' : ''}>
                  <Link to={item.path} className="sidebar-link" onClick={() => { if (isMobile) setSidebarVisible(false); }}>
                    <span className="sidebar-icon">{item.icon}</span>
                    {sideNavExpanded && <span className="sidebar-label">{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </Box>
      )}
    </>
  );
};

export default Navbar; 