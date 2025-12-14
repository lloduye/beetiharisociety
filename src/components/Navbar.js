import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const donateButtonRef = useRef(null);
  const mobileDonateButtonRef = useRef(null);

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

  const zeffyFormUrl = 'https://www.zeffy.com/embed/donation-form/donate-to-change-lives-5934?modal=true';
  const [showZeffyModal, setShowZeffyModal] = useState(false);

  // Handle donate button click
  const handleDonateClick = (e) => {
    e.preventDefault();
    setShowZeffyModal(true);
  };

  const closeZeffyModal = () => {
    setShowZeffyModal(false);
  };

  // Set up Zeffy attributes after component mounts
  useEffect(() => {
    // Wait a bit for Zeffy script to load
    const setupZeffy = () => {
      // Set attribute on desktop button
      if (donateButtonRef.current) {
        donateButtonRef.current.setAttribute('zeffy-form-link', zeffyFormUrl);
      }
      
      // Set attribute on mobile button
      if (mobileDonateButtonRef.current) {
        mobileDonateButtonRef.current.setAttribute('zeffy-form-link', zeffyFormUrl);
      }
    };

    // Try immediately
    setupZeffy();
    
    // Also try after a short delay in case script loads later
    const timeout = setTimeout(setupZeffy, 500);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
    {showZeffyModal && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in"
        onClick={closeZeffyModal}
      >
        <div 
          className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden relative shadow-2xl animate-bounce-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 px-5 py-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Make a Donation</h2>
              <p className="text-xs text-primary-100 mt-0.5">Support BETI-HARI SOCIETY</p>
            </div>
            <button
              onClick={closeZeffyModal}
              className="text-white hover:text-primary-100 hover:bg-primary-700 rounded-full p-1.5 transition-colors duration-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Form Container */}
          <div className="relative">
            <iframe
              src={zeffyFormUrl.replace('?modal=true', '')}
              className="w-full h-[75vh] border-0"
              title="Zeffy Donation Form"
              allow="payment"
              style={{ minHeight: '500px' }}
            />
          </div>
        </div>
      </div>
    )}
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">BETI-HARI SOCIETY</h1>
              <p className="text-xs text-gray-600">Education & Economic Development</p>
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
              ref={donateButtonRef}
              onClick={handleDonateClick}
              className="btn-primary"
            >
              Donate Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
                  ref={mobileDonateButtonRef}
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
    </>
  );
};

export default Navbar;
