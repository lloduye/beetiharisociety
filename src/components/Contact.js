import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! This is a demo - in a real application, this would send your message to our team.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
    alert('Email copied to clipboard!');
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header">
          <h2>Contact Us</h2>
          <p>Get in touch with us to learn more about our work or find out how you can get involved.</p>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p>
              We welcome your questions, feedback, and partnership inquiries. Whether you want to learn more about our programs, make a donation, volunteer, or explore collaboration opportunities, we'd love to hear from you.
            </p>
            <div className="contact-methods">
              <div className="contact-method">
                <i className="fas fa-envelope"></i>
                <a 
                  href="mailto:info@beetiharisociety.org"
                  onClick={() => copyEmail('info@beetiharisociety.org')}
                >
                  info@beetiharisociety.org
                </a>
              </div>
              <div className="contact-method">
                <i className="fas fa-envelope"></i>
                <a 
                  href="mailto:donations@beetiharisociety.org"
                  onClick={() => copyEmail('donations@beetiharisociety.org')}
                >
                  donations@beetiharisociety.org
                </a>
              </div>
              <div className="contact-method">
                <i className="fas fa-map-marker-alt"></i>
                <span>South Sudan</span>
              </div>
              <div className="contact-method">
                <i className="fas fa-clock"></i>
                <span>Monday - Friday: 9:00 AM - 5:00 PM (Local Time)</span>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <h3>Send us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter message subject"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your message..."
                  rows="5"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 