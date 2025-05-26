import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-container">
      <section className="hero-section">
        <h1>Connecting Talent With Opportunity</h1>
        <p className="subtitle">Revolutionizing how work gets done through AI-powered matching and seamless collaboration</p>
      </section>

      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          At YourPro, we're transforming the way people and businesses connect for work. Whether you're a homeowner 
          needing a quick repair, a startup seeking specialized talent, or a professional looking for your next 
          opportunity, our platform makes the process effortless and efficient.
        </p>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <h3>AI-Powered Matching</h3>
          <p>
            Our advanced AI technology understands your needs deeply - from a simple home repair photo to complex 
            project requirements. It instantly connects you with professionals who have the exact skills and 
            experience you need, saving you hours of searching and vetting.
          </p>
        </div>

        <div className="feature-card">
          <h3>Local & Global Talent</h3>
          <p>
            Find skilled professionals in your neighborhood for immediate tasks, or connect with remote talent 
            worldwide for specialized projects. Our platform breaks down geographical barriers while maintaining 
            the personal touch of local service.
          </p>
        </div>

        <div className="feature-card">
          <h3>Smart Booking System</h3>
          <p>
            Schedule work with confidence using our intelligent booking system. Real-time availability, 
            instant confirmation, and automated reminders ensure smooth coordination between clients and 
            professionals.
          </p>
        </div>

        <div className="feature-card">
          <h3>Secure Payments</h3>
          <p>
            Our integrated payment system handles everything from simple transactions to complex project 
            milestones. Funds are held securely in escrow and released only when work is completed to 
            satisfaction.
          </p>
        </div>
      </section>

      <section className="benefits-section">
        <h2>Why Choose YourPro</h2>
        
        <div className="benefits-grid">
          <div className="benefit-item">
            <h4>For Clients</h4>
            <ul>
              <li>Instant matching with qualified professionals</li>
              <li>Visual search - just snap a photo of what needs work</li>
              <li>Verified reviews and quality scores</li>
              <li>Transparent pricing and secure payments</li>
              <li>Real-time messaging and project tracking</li>
              <li>Smart scheduling and calendar integration</li>
            </ul>
          </div>

          <div className="benefit-item">
            <h4>For Professionals</h4>
            <ul>
              <li>AI-powered job matching based on your skills</li>
              <li>Smart availability management</li>
              <li>Automated reporting and analytics</li>
              <li>Integrated project management tools</li>
              <li>Professional profile building</li>
              <li>Secure and timely payments</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="innovation-section">
        <h2>Innovation at Core</h2>
        <p>
          Our platform leverages cutting-edge AI technology not just for matching, but throughout the entire 
          workflow. From automated skill assessment and project scoping to intelligent scheduling and 
          performance analytics, we're constantly innovating to make work easier and more efficient for 
          everyone involved.
        </p>
      </section>

      <section className="future-section">
        <h2>Building the Future of Work</h2>
        <p>
          We're creating an ecosystem where finding and providing professional services is as easy as a few 
          clicks. Whether it's a quick home repair or a long-term project, YourPro is revolutionizing how 
          work gets done in the digital age.
        </p>
      </section>
    </div>
  );
};

export default About; 