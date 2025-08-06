import React from 'react';

const Mission = () => {
  return (
    <section id="mission" className="mission">
      <div className="container">
        <div className="section-header">
          <h2>Our Mission & Vision</h2>
          <p>Guided by our core values and commitment to sustainable development.</p>
        </div>
        <div className="mission-grid">
          <div className="mission-card">
            <i className="fas fa-bullseye"></i>
            <h3>Our Mission</h3>
            <p>
              To provide quality education and community development services that empower young people and strengthen communities in South Sudan, fostering sustainable growth and lasting positive change.
            </p>
          </div>
          <div className="mission-card">
            <i className="fas fa-eye"></i>
            <h3>Our Vision</h3>
            <p>
              A South Sudan where every child has access to quality education, every community is empowered with knowledge and skills, and sustainable development creates lasting prosperity for all.
            </p>
          </div>
          <div className="mission-card">
            <i className="fas fa-heart"></i>
            <h3>Our Values</h3>
            <p>
              Purpose, service, empowerment, dignity, self-reliance, and sustainability guide everything we do. We believe in the power of education to transform lives and communities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission; 