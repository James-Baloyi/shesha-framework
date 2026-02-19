import { useEffect } from 'react';
import { ScreenDefinition } from './models';
import { useScreenRegistry } from './contexts';

export const useScreenRegistrations = (definitions: ScreenDefinition[]): void => {
  const screenRegistry = useScreenRegistry();

  useEffect(() => {
    definitions.forEach((definition) => {
      screenRegistry.registerScreen(definition);
    });

    return (): void => {
      definitions.forEach((definition) => {
        screenRegistry.unregisterScreen(definition);
      });
    };
  }, [screenRegistry, definitions]);
};
