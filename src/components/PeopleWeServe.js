import React from 'react';

const PeopleWeServe = () => {
  return (
    <section id="people" className="people-we-serve">
      <div className="container">
        <div className="section-header">
          <h2>The People We Serve</h2>
          <p>We work with diverse communities across South Sudan, focusing on those most in need of educational support.</p>
        </div>
        <div className="people-grid">
          <div className="people-card">
            <i className="fas fa-child"></i>
            <h3>Primary School Children</h3>
            <p>
              Children aged 6-14 who are eager to learn but face barriers to accessing quality education due to poverty, distance, or lack of educational infrastructure.
            </p>
          </div>
          <div className="people-card">
            <i className="fas fa-chalkboard-teacher"></i>
            <h3>Local Teachers</h3>
            <p>
              Dedicated educators who are passionate about teaching but need additional training, resources, and support to provide the best possible education to their students.
            </p>
          </div>
          <div className="people-card">
            <i className="fas fa-users"></i>
            <h3>Rural Communities</h3>
            <p>
              Communities in remote areas of South Sudan that have been historically underserved and lack access to basic educational facilities and resources.
            </p>
          </div>
          <div className="people-card">
            <i className="fas fa-female"></i>
            <h3>Girls and Young Women</h3>
            <p>
              Girls who face additional barriers to education due to cultural norms, early marriage, or household responsibilities, and who deserve equal educational opportunities.
            </p>
          </div>
          <div className="people-card">
            <i className="fas fa-home"></i>
            <h3>Families</h3>
            <p>
              Parents and guardians who want the best for their children but may lack the resources or knowledge to support their educational journey effectively.
            </p>
          </div>
          <div className="people-card">
            <i className="fas fa-globe-africa"></i>
            <h3>Displaced Populations</h3>
            <p>
              Families and children who have been affected by conflict and displacement, and who need educational support to rebuild their lives and communities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PeopleWeServe; 