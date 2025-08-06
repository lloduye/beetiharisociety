import React, { useEffect } from 'react';

const HowToHelp = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
        }
      });
    });

    const helpCards = document.querySelectorAll('.help-card');
    helpCards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="help" className="how-to-help">
      <div className="container">
        <div className="section-header">
          <h2>How You Can Help</h2>
          <p>There are many ways to support our mission and make a difference in the lives of children in South Sudan.</p>
        </div>
        <div className="help-grid">
          <div className="help-card">
            <i className="fas fa-dollar-sign"></i>
            <h3>Make a Donation</h3>
            <p>
              Your financial contribution directly supports our educational programs, infrastructure development, and community initiatives.
            </p>
            <a href="#donate" className="btn btn-primary">Donate Now</a>
          </div>
          <div className="help-card">
            <i className="fas fa-calendar-alt"></i>
            <h3>Monthly Giving</h3>
            <p>
              Become a monthly donor to provide consistent support for our ongoing programs and help us plan for long-term impact.
            </p>
            <a href="#donate" className="btn btn-primary">Start Monthly Giving</a>
          </div>
          <div className="help-card">
            <i className="fas fa-share-alt"></i>
            <h3>Spread the Word</h3>
            <p>
              Share our mission with your friends, family, and social networks to help us reach more potential supporters.
            </p>
            <a href="#contact" className="btn btn-primary">Get Involved</a>
          </div>
          <div className="help-card">
            <i className="fas fa-hands-helping"></i>
            <h3>Volunteer</h3>
            <p>
              Offer your time and skills to support our programs, whether through remote assistance or on-the-ground involvement.
            </p>
            <a href="#contact" className="btn btn-primary">Volunteer</a>
          </div>
          <div className="help-card">
            <i className="fas fa-building"></i>
            <h3>Corporate Partnership</h3>
            <p>
              Partner with us through corporate social responsibility initiatives, employee giving programs, or direct sponsorship.
            </p>
            <a href="#contact" className="btn btn-primary">Partner With Us</a>
          </div>
          <div className="help-card">
            <i className="fas fa-gift"></i>
            <h3>In-Kind Donations</h3>
            <p>
              Donate educational materials, books, technology, or other resources that can support our programs and students.
            </p>
            <a href="#contact" className="btn btn-primary">Learn More</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToHelp; 