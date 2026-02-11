import { createContext } from 'react';
import { IAutoLogoutContext } from './models';

export const AutoLogoutContext = createContext<IAutoLogoutContext | undefined>(undefined);
