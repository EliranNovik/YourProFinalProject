import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import FreelancerRegistration from './pages/FreelancerRegistration';
import CompanyRegistration from './pages/CompanyRegistration';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/freelancer" element={<FreelancerRegistration />} />
          <Route path="/register/company" element={<CompanyRegistration />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 