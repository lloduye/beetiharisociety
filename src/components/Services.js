import React, { useEffect } from 'react';

const Services = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
        }
      });
    });

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-header">
          <h2>What We Do</h2>
          <p>Comprehensive educational and community development programs that create lasting impact.</p>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <i className="fas fa-school"></i>
            <h3>Primary Education</h3>
            <p>
              We provide quality primary education to children in rural South Sudan, ensuring they have access to fundamental learning opportunities that form the foundation for their future success.
            </p>
          </div>
          <div className="service-card">
            <i className="fas fa-chalkboard-teacher"></i>
            <h3>Teacher Training</h3>
            <p>
              Our comprehensive teacher training programs equip educators with modern teaching methodologies, ensuring high-quality instruction that meets international standards.
            </p>
          </div>
          <div className="service-card">
            <i className="fas fa-hammer"></i>
            <h3>Infrastructure Development</h3>
            <p>
              We build and maintain educational facilities, including classrooms, libraries, and community centers, creating safe and conducive learning environments.
            </p>
          </div>
          <div className="service-card">
            <i className="fas fa-book"></i>
            <h3>Educational Resources</h3>
            <p>
              We provide textbooks, learning materials, and educational technology to support effective teaching and learning in our partner schools.
            </p>
          </div>
          <div className="service-card">
            <i className="fas fa-users-cog"></i>
            <h3>Community Development</h3>
            <p>
              Beyond education, we support community development initiatives including health awareness, economic empowerment, and social cohesion programs.
            </p>
          </div>
          <div className="service-card">
            <i className="fas fa-hands-helping"></i>
            <h3>Partnership Building</h3>
            <p>
              We collaborate with local communities, government agencies, and international organizations to maximize our impact and ensure sustainable development.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services; 