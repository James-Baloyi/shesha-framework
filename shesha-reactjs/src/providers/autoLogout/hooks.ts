import { useContext } from 'react';
import { AutoLogoutContext } from './contexts';
import { IAutoLogoutContext } from './models';

export const useAutoLogout = (): IAutoLogoutContext => {
  const context = useContext(AutoLogoutContext);
  if (context === undefined) {
    throw new Error('useAutoLogout must be used within an AutoLogoutProvider');
  }
  return context;
};

export const useAutoLogoutOrUndefined = (): IAutoLogoutContext | undefined => {
  return useContext(AutoLogoutContext);
};
