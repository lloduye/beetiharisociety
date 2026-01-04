import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, MapPin, BookOpen } from 'lucide-react';
import { useZeffy } from '../contexts/ZeffyContext';

const Footer = () => {
  const { openModal } = useZeffy();

  const handleDonateClick = (e) => {
    e.preventDefault();
    openModal();
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-8 w-8 text-primary-400" />
              <div>
                <h3 className="text-xl font-bold">BETI-HARI SOCIETY</h3>
                <p className="text-sm text-gray-400">Education & Economic Development</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Empowering children and communities through purpose-driven education in South Sudan.
            </p>
            <div className="flex space-x-4">
              <button onClick={handleDonateClick} className="btn-primary">
                Donate Now
              </button>
              <Link to="/get-involved" className="btn-outline text-white border-white hover:bg-white hover:text-gray-900">
                Volunteer
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/mission" className="text-gray-300 hover:text-white transition-colors">
                  Mission & Vision
                </Link>
              </li>
              <li>
                <Link to="/what-we-do" className="text-gray-300 hover:text-white transition-colors">
                  What We Do
                </Link>
              </li>
              <li>
                <Link to="/impact" className="text-gray-300 hover:text-white transition-colors">
                  Our Impact
                </Link>
              </li>
              <li>
                <Link to="/get-involved" className="text-gray-300 hover:text-white transition-colors">
                  Get Involved
                </Link>
              </li>
              <li>
                <Link to="/dashboard/login" className="text-gray-300 hover:text-white transition-colors">
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300">General Inquiries</p>
                  <a 
                    href="mailto:contact@betiharisociety.org" 
                    className="text-white hover:text-primary-400 transition-colors"
                  >
                    contact@betiharisociety.org
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300">Donations</p>
                  <a 
                    href="mailto:donate@betiharisociety.org" 
                    className="text-white hover:text-primary-400 transition-colors"
                  >
                    donate@betiharisociety.org
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300">Serving</p>
                  <p className="text-white">Budi County & Lotukei sub-county</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Beti-Hari Society for Education & Economic Development. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <BookOpen className="h-4 w-4 text-primary-400" />
              <span className="text-sm text-gray-400">Rooted in education. Powered by hope.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
