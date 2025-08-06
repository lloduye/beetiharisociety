import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container">
          <div className="section-header">
            <h1>About Us</h1>
            <p>Building access to quality education, life skills, and essential community support services in rural South Sudan.</p>
          </div>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                Beeti Hari Society for Education & Economic Development is a grassroots nonprofit organization dedicated to building access to quality education, life skills, and essential community support services in rural South Sudan. Founded on values of purpose, service, and empowerment, we are working to uplift entire communities by starting where it matters most — in the classroom.
              </p>
              <p>
                Our belief is simple yet powerful: when children are given access to nurturing, high-quality education, they can overcome poverty, realize their potential, and lead others toward a future of hope and prosperity.
              </p>
              <p>
                We are committed to grassroots development that promotes dignity, self-reliance, and long-term sustainability.
              </p>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <i className="fas fa-users"></i>
                <p>Our Community</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values">
        <div className="container">
          <div className="section-header">
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we do.</p>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <i className="fas fa-heart"></i>
              <h3>Purpose</h3>
              <p>We are driven by a clear sense of purpose to serve and uplift communities through education.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-hands-helping"></i>
              <h3>Service</h3>
              <p>We believe in selfless service to others, putting community needs above our own.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-star"></i>
              <h3>Empowerment</h3>
              <p>We empower individuals and communities to take control of their own development.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-crown"></i>
              <h3>Dignity</h3>
              <p>We treat every person with respect and dignity, recognizing their inherent worth.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-leaf"></i>
              <h3>Self-Reliance</h3>
              <p>We promote independence and self-sufficiency in the communities we serve.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-recycle"></i>
              <h3>Sustainability</h3>
              <p>We build programs that create lasting positive change for future generations.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
