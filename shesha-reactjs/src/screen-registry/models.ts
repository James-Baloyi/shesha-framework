import { ComponentType } from 'react';

export interface IScreenProps {
  pathSegments: string[];
  searchParams: NodeJS.Dict<string | string[]>;
}

export interface ScreenDefinition {
  path: string;
  component: ComponentType<IScreenProps>;
  title?: string;
  isPublic?: boolean;
}
