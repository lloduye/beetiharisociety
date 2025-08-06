import React, { useState, useEffect } from 'react';

const Hero = () => {
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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
        }
      });
    });

    const heroSection = document.getElementById('home');
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => observer.disconnect();
  }, []);

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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Beeti Hari Society for Education & Economic Development</h1>
          <p className="hero-subtitle">Empowering Young People. Strengthening Communities. Transforming South Sudan Through Education.</p>
          <p className="hero-description">
            We believe education is the most powerful tool for breaking the cycle of poverty and building a brighter, more sustainable future for children and communities in South Sudan.
          </p>
          <div className="hero-buttons">
            <a href="#donate" className="btn btn-primary" onClick={() => scrollToSection('donate')}>
              Donate Now
            </a>
            <a href="#help" className="btn btn-secondary" onClick={() => scrollToSection('help')}>
              Join Our Mission
            </a>
            <a href="#about" className="btn btn-outline" onClick={() => scrollToSection('about')}>
              Learn More
            </a>
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
  );
};

export default Hero; 