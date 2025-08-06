import React from 'react';

const Impact = () => {
  return (
    <div className="impact-page">
      <section className="page-hero">
        <div className="container">
          <div className="section-header">
            <h1>Our Impact</h1>
            <p>Measurable results that demonstrate our commitment to transforming lives through education.</p>
          </div>
        </div>
      </section>

      <section className="impact-content">
        <div className="container">
          <div className="impact-grid">
            <div className="impact-card">
              <i className="fas fa-graduation-cap"></i>
              <h3>1,200+</h3>
              <p>Students enrolled in our educational programs, receiving quality instruction and support.</p>
            </div>
            <div className="impact-card">
              <i className="fas fa-school"></i>
              <h3>5</h3>
              <p>Classrooms built and equipped with modern learning materials and technology.</p>
            </div>
            <div className="impact-card">
              <i className="fas fa-chalkboard-teacher"></i>
              <h3>20+</h3>
              <p>Teachers trained in modern educational methodologies and best practices.</p>
            </div>
            <div className="impact-card">
              <i className="fas fa-users"></i>
              <h3>2</h3>
              <p>Communities directly served, with programs expanding to reach more areas.</p>
            </div>
            <div className="impact-card">
              <i className="fas fa-book-open"></i>
              <h3>500+</h3>
              <p>Textbooks and learning materials distributed to support student learning.</p>
            </div>
            <div className="impact-card">
              <i className="fas fa-hands-helping"></i>
              <h3>100%</h3>
              <p>Community involvement in our programs, ensuring local ownership and sustainability.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impact;
