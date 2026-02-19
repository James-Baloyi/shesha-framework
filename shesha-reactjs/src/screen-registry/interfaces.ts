import { ScreenDefinition } from './models';

export interface IScreenRegistry {
  registerScreen: (definition: ScreenDefinition) => void;
  unregisterScreen: (definition: ScreenDefinition) => void;
  getScreen: (path: string) => ScreenDefinition | undefined;
}
