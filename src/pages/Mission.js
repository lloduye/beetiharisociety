import React from 'react';

const Mission = () => {
  return (
    <div className="mission-page">
      <section className="page-hero">
        <div className="container">
          <div className="section-header">
            <h1>Our Mission & Vision</h1>
            <p>Guided by our core values and commitment to sustainable development.</p>
          </div>
        </div>
      </section>

      <section className="mission-content">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
              <i className="fas fa-bullseye"></i>
              <h2>Our Mission</h2>
              <p>
                To provide quality education and community development services that empower young people and strengthen communities in South Sudan, fostering sustainable growth and lasting positive change.
              </p>
            </div>
            <div className="mission-card">
              <i className="fas fa-eye"></i>
              <h2>Our Vision</h2>
              <p>
                A South Sudan where every child has access to quality education, every community is empowered with knowledge and skills, and sustainable development creates lasting prosperity for all.
              </p>
            </div>
            <div className="mission-card">
              <i className="fas fa-heart"></i>
              <h2>Our Values</h2>
              <p>
                Purpose, service, empowerment, dignity, self-reliance, and sustainability guide everything we do. We believe in the power of education to transform lives and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="approach">
        <div className="container">
          <div className="section-header">
            <h2>Our Approach</h2>
            <p>How we work to achieve our mission and vision.</p>
          </div>
          <div className="approach-grid">
            <div className="approach-item">
              <h3>Community-Centered</h3>
              <p>We work with communities to understand their needs and priorities, ensuring our programs are relevant and sustainable.</p>
            </div>
            <div className="approach-item">
              <h3>Holistic Development</h3>
              <p>We address education, health, economic empowerment, and social cohesion as interconnected aspects of community development.</p>
            </div>
            <div className="approach-item">
              <h3>Partnership-Based</h3>
              <p>We collaborate with local organizations, government agencies, and international partners to maximize our impact.</p>
            </div>
            <div className="approach-item">
              <h3>Evidence-Driven</h3>
              <p>We use data and research to inform our programs and measure our impact, ensuring continuous improvement.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mission;
