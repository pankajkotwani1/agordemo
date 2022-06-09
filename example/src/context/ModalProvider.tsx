import React, { createContext, useState } from 'react';
import type { PIPProps } from './types';

export const PIPContext = createContext<PIPProps | null>(null);
export const PIPProvider: React.FC = ({ children }) => {
  const [show, setShowPopup] = useState<boolean>(false);
  const [innerContent, setInnerContent] = useState<string>('');

  console.log('--PIP mode-called-', show);
  return (
    <PIPContext.Provider
      value={{
        show,
        setShowPopup,
        innerContent,
        setInnerContent,
      }}
    >
      {children}
    </PIPContext.Provider>
  );
};
