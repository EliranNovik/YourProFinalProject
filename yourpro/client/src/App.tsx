import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FreelancerProvider } from './contexts/FreelancerContext';
import Navbar from './Navbar';
import AppRoutes from './routes';
import GlobalJobNotifications from './components/GlobalJobNotifications';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <FreelancerProvider>
          <div className="app">
            <Navbar />
            <GlobalJobNotifications />
            <main className="main-content">
              <AppRoutes />
            </main>
          </div>
        </FreelancerProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
