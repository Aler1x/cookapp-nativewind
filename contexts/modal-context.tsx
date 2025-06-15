import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  showJobsModal: boolean;
  setShowJobsModal: (show: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [showJobsModal, setShowJobsModal] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        showJobsModal,
        setShowJobsModal,
      }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
