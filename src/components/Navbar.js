import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useDonation } from '../contexts/DonationContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { openModal } = useDonation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Mission', href: '/mission' },
    { name: 'What We Do', href: '/what-we-do' },
    { name: 'Impact', href: '/impact' },
    { name: 'Get Involved', href: '/get-involved' },
    { name: 'Stories', href: '/stories' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  // Handle donate button click
  const handleDonateClick = (e) => {
    e.preventDefault();
    openModal();
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 relative">
          {/* Logo - left-aligned so it has room on mobile and shows full name + tagline */}
          <Link to="/" className="flex items-center gap-2 min-w-0 flex-1 md:flex-initial">
            <Globe className="h-9 w-9 sm:h-10 sm:w-10 text-primary-600 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">BETI-HARI SOCIETY</h1>
              <p className="text-[10px] sm:text-xs text-gray-600 leading-tight">Education & Economic Development</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <button 
              onClick={handleDonateClick}
              className="btn-primary"
            >
              Donate Now
            </button>
          </div>

          {/* Mobile menu button - on right */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <button
                  onClick={(e) => {
                    setIsOpen(false);
                    handleDonateClick(e);
                  }}
                  className="btn-primary w-full text-center"
                >
                  Donate Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
