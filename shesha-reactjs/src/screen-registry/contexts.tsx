import React, { FC, PropsWithChildren, useContext } from 'react';
import { IScreenRegistry } from './interfaces';
import { ScreenRegistry } from './screenRegistry';
import { isDefined } from '@/utils/nullables';
import { createNamedContext } from '@/utils/react';

const useScreenRegistrySingleton = (): [IScreenRegistry] => {
  const [screenRegistry] = React.useState<IScreenRegistry>(() => {
    return new ScreenRegistry();
  });

  return [screenRegistry];
};

export const ScreenRegistryContext = createNamedContext<IScreenRegistry | undefined>(undefined, 'ScreenRegistryContext');

export const ScreenRegistryProvider: FC<PropsWithChildren> = ({ children }) => {
  const [screenRegistry] = useScreenRegistrySingleton();

  return (
    <ScreenRegistryContext.Provider value={screenRegistry}>
      {children}
    </ScreenRegistryContext.Provider>
  );
};

export const useScreenRegistryIfAvailable = (): IScreenRegistry | undefined => {
  return useContext(ScreenRegistryContext);
};

export const useScreenRegistry = (): IScreenRegistry => {
  const context = useScreenRegistryIfAvailable();

  if (!isDefined(context))
    throw new Error('useScreenRegistry must be used within a ScreenRegistryProvider');
  return context;
};
