import React from 'react';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <h2>About Us</h2>
          <p>Building access to quality education, life skills, and essential community support services in rural South Sudan.</p>
        </div>
        <div className="about-content">
          <div className="about-text">
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
  );
};

export default About; 