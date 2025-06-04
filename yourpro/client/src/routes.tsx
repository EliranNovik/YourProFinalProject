import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import FreelancerRegistration from './pages/FreelancerRegistration';
import CompanyRegistration from './pages/CompanyRegistration';
import FreelancerProfile from './pages/FreelancerProfile';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Freelancers from './pages/Freelancers';
import Companies from './pages/Companies';
import CombinedResults from './pages/CombinedResults';
import CompanyProfile from './pages/CompanyProfile';
import MessagePage from './pages/MessagePage';
import UserProfile from './pages/UserProfile';
import Clients from './pages/Clients';
import Bookings from './pages/Bookings';
import Processes from './pages/Processes';
import Administration from './pages/Administration';
import Notification from './pages/Notification';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import PaymentsInvoice from './pages/PaymentsInvoice';
import Messages from './pages/Messages';
import Professionals from './pages/Professionals';
import Requests from './pages/Requests';
import ClientRegistration from './pages/ClientRegistration';
import LoginProfile from './pages/LoginProfile';
import CompleteFreelancerProfile from './pages/CompleteFreelancerProfile';
import SearchingForPro from './pages/SearchingForPro';
import JobInProgress from './pages/JobInProgress';
import LiveJobs from './pages/LiveJobs';
import ClientJobsInProgress from './pages/ClientJobsInProgress';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c5282',
    },
    secondary: {
      main: '#4a5568',
    },
  },
});

const AppRoutes: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/loginprofile" element={<LoginProfile />} />
        <Route path="/freelancer-registration" element={<FreelancerRegistration />} />
        <Route path="/company-registration" element={<CompanyRegistration />} />
        <Route path="/client-registration" element={<ClientRegistration />} />
        <Route path="/freelancer/:id" element={<FreelancerProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/freelancers" element={<Freelancers />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/results" element={<CombinedResults />} />
        <Route path="/company/:id" element={<CompanyProfile />} />
        <Route path="/message/:type/:id" element={<MessagePage />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/processes" element={<Processes />} />
        <Route path="/administration" element={<Administration />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/PaymentsInvoice" element={<PaymentsInvoice />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/professionals" element={<Professionals />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/complete-freelancer-profile" element={<CompleteFreelancerProfile />} />
        <Route path="/searching-for-pro" element={<SearchingForPro />} />
        <Route path="/client-jobs-in-progress/:jobId" element={<ClientJobsInProgress />} />
        <Route path="/client-jobs-in-progress" element={<ClientJobsInProgress />} />
        <Route path="/job-in-progress/:jobId" element={<JobInProgress />} />
        <Route path="/live-jobs" element={<LiveJobs />} />
      </Routes>
    </ThemeProvider>
  );
};

export default AppRoutes; 