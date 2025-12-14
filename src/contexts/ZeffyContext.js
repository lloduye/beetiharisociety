import React, { createContext, useContext, useState } from 'react';
import ZeffyModal from '../components/ZeffyModal';

const ZeffyContext = createContext();

export const useZeffy = () => {
  const context = useContext(ZeffyContext);
  if (!context) {
    throw new Error('useZeffy must be used within a ZeffyProvider');
  }
  return context;
};

export const ZeffyProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ZeffyContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ZeffyModal isOpen={isOpen} onClose={closeModal} />
    </ZeffyContext.Provider>
  );
};

