import { ScreenDefinition } from './models';
import { IScreenRegistry } from './interfaces';

export class ScreenRegistry implements IScreenRegistry {
  private _screens: Map<string, ScreenDefinition>;

  constructor() {
    this._screens = new Map<string, ScreenDefinition>();
  }

  registerScreen = (definition: ScreenDefinition): void => {
    this._screens.set(definition.path, definition);
  };

  unregisterScreen = (definition: ScreenDefinition): void => {
    this._screens.delete(definition.path);
  };

  getScreen = (path: string): ScreenDefinition | undefined => {
    return this._screens.get(path);
  };
}
