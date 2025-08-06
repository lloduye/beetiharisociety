import React, { useEffect } from 'react';

const Education = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
        }
      });
    });

    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="education" className="education">
      <div className="container">
        <div className="section-header">
          <h2>Why Education Matters</h2>
          <p>Education is the cornerstone of sustainable development and community transformation.</p>
        </div>
        <div className="education-grid">
          <div className="education-item">
            <h3>Breaking the Cycle of Poverty</h3>
            <p>
              Education provides children with the knowledge, skills, and confidence they need to secure better employment opportunities and break free from the cycle of poverty that has affected their families for generations.
            </p>
          </div>
          <div className="education-item">
            <h3>Empowering Communities</h3>
            <p>
              When children receive quality education, they become agents of change within their communities, sharing knowledge and inspiring others to pursue learning and personal development.
            </p>
          </div>
          <div className="education-item">
            <h3>Building a Sustainable Future</h3>
            <p>
              Education equips young people with critical thinking skills, environmental awareness, and the ability to make informed decisions that contribute to the long-term sustainability of their communities.
            </p>
          </div>
          <div className="education-item">
            <h3>Promoting Peace and Stability</h3>
            <p>
              Education fosters understanding, tolerance, and peaceful conflict resolution, helping to build more stable and harmonious communities in post-conflict South Sudan.
            </p>
          </div>
          <div className="education-item">
            <h3>Improving Health Outcomes</h3>
            <p>
              Educated individuals are more likely to make informed health decisions, access healthcare services, and adopt healthy behaviors that benefit themselves and their families.
            </p>
          </div>
          <div className="education-item">
            <h3>Economic Development</h3>
            <p>
              A well-educated workforce is essential for economic growth and development, creating opportunities for entrepreneurship and attracting investment to the region.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education; 