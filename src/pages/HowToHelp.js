import React from 'react';
import { Link } from 'react-router-dom';

const HowToHelp = () => {
  return (
    <div className="how-to-help-page">
      <section className="page-hero">
        <div className="container">
          <div className="section-header">
            <h1>How You Can Help</h1>
            <p>There are many ways to support our mission and make a difference in the lives of children in South Sudan.</p>
          </div>
        </div>
      </section>

      <section className="help-content">
        <div className="container">
          <div className="help-grid">
            <div className="help-card">
              <i className="fas fa-dollar-sign"></i>
              <h3>Make a Donation</h3>
              <p>
                Your financial contribution directly supports our educational programs, infrastructure development, and community initiatives.
              </p>
              <Link to="/donate" className="btn btn-primary">Donate Now</Link>
            </div>
            <div className="help-card">
              <i className="fas fa-calendar-alt"></i>
              <h3>Monthly Giving</h3>
              <p>
                Become a monthly donor to provide consistent support for our ongoing programs and help us plan for long-term impact.
              </p>
              <Link to="/donate" className="btn btn-primary">Start Monthly Giving</Link>
            </div>
            <div className="help-card">
              <i className="fas fa-share-alt"></i>
              <h3>Spread the Word</h3>
              <p>
                Share our mission with your friends, family, and social networks to help us reach more potential supporters.
              </p>
              <Link to="/contact" className="btn btn-primary">Get Involved</Link>
            </div>
            <div className="help-card">
              <i className="fas fa-hands-helping"></i>
              <h3>Volunteer</h3>
              <p>
                Offer your time and skills to support our programs, whether through remote assistance or on-the-ground involvement.
              </p>
              <Link to="/contact" className="btn btn-primary">Volunteer</Link>
            </div>
            <div className="help-card">
              <i className="fas fa-building"></i>
              <h3>Corporate Partnership</h3>
              <p>
                Partner with us through corporate social responsibility initiatives, employee giving programs, or direct sponsorship.
              </p>
              <Link to="/contact" className="btn btn-primary">Partner With Us</Link>
            </div>
            <div className="help-card">
              <i className="fas fa-gift"></i>
              <h3>In-Kind Donations</h3>
              <p>
                Donate educational materials, books, technology, or other resources that can support our programs and students.
              </p>
              <Link to="/contact" className="btn btn-primary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowToHelp;
