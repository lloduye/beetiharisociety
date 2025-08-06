import React, { useState } from 'react';

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState('');
  const [isMonthly, setIsMonthly] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    message: ''
  });

  const donationOptions = [
    { amount: '25', description: 'Provides textbooks for 5 students' },
    { amount: '50', description: 'Supports teacher training for 1 month' },
    { amount: '100', description: 'Builds classroom infrastructure' },
    { amount: '250', description: 'Funds educational programs for 1 month' },
    { amount: '500', description: 'Supports entire school operations' },
    { amount: 'custom', description: 'Choose your own amount' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDonationOptionClick = (amount) => {
    setSelectedAmount(amount);
    setFormData(prev => ({
      ...prev,
      amount: amount
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Donation form submitted:', { ...formData, isMonthly });
    alert('Thank you for your donation! This is a demo - in a real application, this would redirect to a payment processor.');
  };

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
    alert('Email copied to clipboard!');
  };

  return (
    <div className="donate-page">
      <section className="page-hero">
        <div className="container">
          <div className="section-header">
            <h1>Make a Donation</h1>
            <p>Your generous contribution directly supports our educational programs and helps transform the lives of children in South Sudan.</p>
          </div>
        </div>
      </section>

      <section className="donate-content">
        <div className="container">
          <div className="donation-options">
            {donationOptions.map((option, index) => (
              <div
                key={index}
                className={`donation-option ${selectedAmount === option.amount ? 'selected' : ''}`}
                onClick={() => handleDonationOptionClick(option.amount)}
              >
                <h4>${option.amount}</h4>
                <p>{option.description}</p>
              </div>
            ))}
          </div>

          <div className="donate-form">
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
                <label htmlFor="amount">Donation Amount *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter donation amount"
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={isMonthly}
                    onChange={(e) => setIsMonthly(e.target.checked)}
                  />
                  Make this a monthly donation
                </label>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Share why you're supporting our mission..."
                  rows="3"
                />
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {isMonthly ? 'Start Monthly Donation' : 'Make Donation'}
              </button>
            </form>
          </div>

          <div className="contact-info">
            <p><strong>For direct donations or questions:</strong></p>
            <div className="contact-methods">
              <div>
                <strong>General Inquiries:</strong>
                <br />
                <a 
                  href="mailto:info@beetiharisociety.org" 
                  onClick={() => copyEmail('info@beetiharisociety.org')}
                >
                  info@beetiharisociety.org
                </a>
              </div>
              <div>
                <strong>Donation Support:</strong>
                <br />
                <a 
                  href="mailto:donations@beetiharisociety.org"
                  onClick={() => copyEmail('donations@beetiharisociety.org')}
                >
                  donations@beetiharisociety.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
