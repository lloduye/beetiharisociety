import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [stats, setStats] = useState({
    students: 0,
    classrooms: 0,
    teachers: 0,
    communities: 0
  });

  const targetStats = {
    students: 1200,
    classrooms: 5,
    teachers: 20,
    communities: 2
  };

  useEffect(() => {
    const animateCounters = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setStats({
          students: Math.floor(targetStats.students * progress),
          classrooms: Math.floor(targetStats.classrooms * progress),
          teachers: Math.floor(targetStats.teachers * progress),
          communities: Math.floor(targetStats.communities * progress)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setStats(targetStats);
        }
      }, stepDuration);
    };

    // Start animation after a short delay
    const timer = setTimeout(animateCounters, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Beeti Hari Society for Education & Economic Development</h1>
            <p className="hero-subtitle">Empowering Young People. Strengthening Communities. Transforming South Sudan Through Education.</p>
            <p className="hero-description">
              We believe education is the most powerful tool for breaking the cycle of poverty and building a brighter, more sustainable future for children and communities in South Sudan.
            </p>
            <div className="hero-buttons">
              <Link to="/donate" className="btn btn-primary">
                Donate Now
              </Link>
              <Link to="/how-to-help" className="btn btn-secondary">
                Join Our Mission
              </Link>
              <Link to="/about" className="btn btn-outline">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <i className="fas fa-graduation-cap"></i>
              <p>Students in South Sudan</p>
            </div>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <h3>{stats.students}+</h3>
            <p>Students Enrolled</p>
          </div>
          <div className="stat-item">
            <h3>{stats.classrooms}</h3>
            <p>Classrooms Built</p>
          </div>
          <div className="stat-item">
            <h3>{stats.teachers}+</h3>
            <p>Dedicated Teachers</p>
          </div>
          <div className="stat-item">
            <h3>{stats.communities}</h3>
            <p>Communities Served</p>
          </div>
        </div>
      </section>

      {/* Quick Overview Section */}
      <section className="overview">
        <div className="container">
          <div className="section-header">
            <h2>Welcome to Beeti Hari Society</h2>
            <p>Building access to quality education, life skills, and essential community support services in rural South Sudan.</p>
          </div>
          <div className="overview-grid">
            <div className="overview-card">
              <i className="fas fa-bullseye"></i>
              <h3>Our Mission</h3>
              <p>To provide quality education and community development services that empower young people and strengthen communities in South Sudan.</p>
              <Link to="/mission" className="btn btn-outline">Learn More</Link>
            </div>
            <div className="overview-card">
              <i className="fas fa-chart-line"></i>
              <h3>Our Impact</h3>
              <p>Over 1,200 students enrolled, 5 classrooms built, and 20+ teachers trained in modern educational methodologies.</p>
              <Link to="/impact" className="btn btn-outline">See Our Impact</Link>
            </div>
            <div className="overview-card">
              <i className="fas fa-hands-helping"></i>
              <h3>Get Involved</h3>
              <p>There are many ways to support our mission and make a difference in the lives of children in South Sudan.</p>
              <Link to="/how-to-help" className="btn btn-outline">How to Help</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Make a Difference Today</h2>
            <p>Your support directly impacts the lives of children and communities in South Sudan. Every donation, no matter the size, makes a real difference.</p>
            <div className="cta-buttons">
              <Link to="/donate" className="btn btn-primary">Donate Now</Link>
              <Link to="/contact" className="btn btn-outline">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
