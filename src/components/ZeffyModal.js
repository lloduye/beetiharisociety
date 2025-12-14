import React from 'react';
import { X } from 'lucide-react';

const ZeffyModal = ({ isOpen, onClose }) => {
  const zeffyFormUrl = 'https://www.zeffy.com/embed/donation-form/donate-to-change-lives-5934?modal=true';

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in"
      onClick={onClose}
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
            onClick={onClose}
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
  );
};

export default ZeffyModal;

