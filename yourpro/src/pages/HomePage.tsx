import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <header className="hero">
        <h1>Welcome to YourPro</h1>
        <p>Connect with top freelancers and companies worldwide</p>
      </header>

      <section className="features">
        <div className="feature-card">
          <h2>For Freelancers</h2>
          <p>Find exciting projects and showcase your skills</p>
          <Link to="/freelancer/register" className="cta-button">Join as Freelancer</Link>
        </div>

        <div className="feature-card">
          <h2>For Companies</h2>
          <p>Hire talented professionals for your projects</p>
          <Link to="/company/register" className="cta-button">Join as Company</Link>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Your Profile</h3>
            <p>Sign up and showcase your skills or company details</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Connect</h3>
            <p>Find the perfect match for your project or skills</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Collaborate</h3>
            <p>Work together to achieve great results</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <div className="cta-buttons">
          <Link to="/freelancer/register" className="cta-button primary">Join as Freelancer</Link>
          <Link to="/company/register" className="cta-button secondary">Join as Company</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 