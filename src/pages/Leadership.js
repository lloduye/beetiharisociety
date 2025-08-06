import React from 'react';

const Leadership = () => {
  return (
    <div className="leadership-page">
      <section className="page-hero">
        <div className="container">
          <div className="section-header">
            <h1>Our Leadership</h1>
            <p>Meet the dedicated team driving our mission to transform education in South Sudan.</p>
          </div>
        </div>
      </section>

      <section className="leadership-content">
        <div className="container">
          <div className="leadership-grid">
            <div className="leader-card">
              <div className="leader-image">
                <i className="fas fa-user"></i>
              </div>
              <h3>Executive Director</h3>
              <div className="title">Founder & CEO</div>
              <p>
                Leading our organization with over 15 years of experience in education and community development, our Executive Director brings deep knowledge of South Sudan's educational challenges and opportunities.
              </p>
            </div>
            <div className="leader-card">
              <div className="leader-image">
                <i className="fas fa-user"></i>
              </div>
              <h3>Program Director</h3>
              <div className="title">Education & Community Development</div>
              <p>
                Our Program Director oversees all educational initiatives, teacher training programs, and community development projects, ensuring they align with our mission and create maximum impact.
              </p>
            </div>
            <div className="leader-card">
              <div className="leader-image">
                <i className="fas fa-user"></i>
              </div>
              <h3>Operations Manager</h3>
              <div className="title">Infrastructure & Logistics</div>
              <p>
                Managing our day-to-day operations, infrastructure development, and logistical support to ensure our programs run smoothly and efficiently across all locations.
              </p>
            </div>
            <div className="leader-card">
              <div className="leader-image">
                <i className="fas fa-user"></i>
              </div>
              <h3>Community Liaison</h3>
              <div className="title">Local Partnerships</div>
              <p>
                Building and maintaining relationships with local communities, government officials, and partner organizations to ensure our programs meet local needs and priorities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Leadership;
