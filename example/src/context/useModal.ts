import * as React from 'react';
import { PIPContext } from './ModalProvider';

export const usePIPMode = () => {
  return React.useContext(PIPContext)!;
};
