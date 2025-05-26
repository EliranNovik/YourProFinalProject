import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="with-navbar-padding">
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
              <div className="benefit-points">
                <div className="benefit-point">
                  <div className="benefit-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 11.5C21 16.75 12 21.25 12 21.25C12 21.25 3 16.75 3 11.5C3 7.02 7.02 3 12 3C16.98 3 21 7.02 21 11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 14C13.6569 14 15 12.6569 15 11C15 9.34315 13.6569 8 12 8C10.3431 8 9 9.34315 9 11C9 12.6569 10.3431 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="benefit-content">
                    <h5>Instant Local Matching</h5>
                    <p>Find qualified professionals in your area instantly through our AI-powered matching system</p>
                  </div>
                </div>

                <div className="benefit-point">
                  <div className="benefit-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="benefit-content">
                    <h5>Visual Search</h5>
                    <p>Simply snap a photo of what needs work and let our AI find the right professional</p>
                  </div>
                </div>

                <div className="benefit-point">
                  <div className="benefit-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="benefit-content">
                    <h5>Verified Quality</h5>
                    <p>Every professional is verified and rated based on real client feedback</p>
                  </div>
                </div>

                <div className="benefit-point">
                  <div className="benefit-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="benefit-content">
                    <h5>Easy Communication</h5>
                    <p>Real-time messaging and project tracking all in one place</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="benefit-item">
              <h4>For Professionals</h4>
              <div className="benefit-points">
                <div className="benefit-point">
                  <div className="benefit-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="benefit-content">
                    <h5>Smart Job Matching</h5>
                    <p>Get matched with projects that perfectly fit your skills and expertise</p>
                  </div>
                </div>

                <div className="benefit-point">
                  <div className="benefit-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="benefit-content">
                    <h5>Flexible Scheduling</h5>
                    <p>Manage your availability and work hours with our smart calendar system</p>
                  </div>
                </div>

                <div className="benefit-point">
                  <div className="benefit-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 8H19C20.0609 8 21.0783 8.42143 21.8284 9.17157C22.5786 9.92172 23 10.9391 23 12C23 13.0609 22.5786 14.0783 21.8284 14.8284C21.0783 15.5786 20.0609 16 19 16H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 8H18V17C18 18.0609 17.5786 19.0783 16.8284 19.8284C16.0783 20.5786 15.0609 21 14 21H6C4.93913 21 3.92172 20.5786 3.17157 19.8284C2.42143 19.0783 2 18.0609 2 17V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 1V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 1V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 1V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="benefit-content">
                    <h5>Business Tools</h5>
                    <p>Access professional tools for project management and reporting</p>
                  </div>
                </div>

                <div className="benefit-point">
                  <div className="benefit-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="benefit-content">
                    <h5>Secure Payments</h5>
                    <p>Get paid on time, every time with our secure payment system</p>
                  </div>
                </div>
              </div>
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
    </div>
  );
};

export default About; 