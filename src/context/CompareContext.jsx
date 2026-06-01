import React, { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';

const CompareContext = createContext();

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);
  const { showToast } = useToast();

  const addToCompare = (painting) => {
    if (compareItems.length >= 3) {
      showToast('You can compare up to 3 artworks at a time.', 'warning');
      return;
    }
    if (compareItems.some(item => item.id === painting.id)) {
      showToast('Artwork is already in comparison.', 'info');
      return;
    }
    setCompareItems(prev => [...prev, painting]);
    showToast('Added to comparison.', 'success');
  };

  const removeFromCompare = (id) => {
    setCompareItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (id) => {
    return compareItems.some(item => item.id === id);
  };

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
};
