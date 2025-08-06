import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Beeti Hari Society</h3>
            <p>
              Empowering young people and strengthening communities in South Sudan through quality education and sustainable development programs.
            </p>
            <p>
              We believe education is the most powerful tool for breaking the cycle of poverty and building a brighter, more sustainable future.
            </p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/mission">Our Mission</Link></li>
              <li><Link to="/impact">Our Impact</Link></li>
              <li><Link to="/how-to-help">How to Help</Link></li>
              <li><Link to="/donate">Donate</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Our Programs</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>Primary Education</li>
              <li>Teacher Training</li>
              <li>Infrastructure Development</li>
              <li>Community Development</li>
              <li>Educational Resources</li>
              <li>Partnership Building</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact Information</h3>
            <p>
              <strong>General Inquiries:</strong><br />
              <a href="mailto:info@beetiharisociety.org">info@beetiharisociety.org</a>
            </p>
            <p>
              <strong>Donation Support:</strong><br />
              <a href="mailto:donations@beetiharisociety.org">donations@beetiharisociety.org</a>
            </p>
            <p>
              <strong>Location:</strong><br />
              South Sudan
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Beeti Hari Society for Education & Economic Development. All rights reserved.
          </p>
          <p>
            Empowering communities through education in South Sudan.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 