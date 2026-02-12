import { FC } from 'react';
import { useScreenRegistrations } from './hooks';
import { ScreenDefinition } from './models';

export interface IScreenRegistrationProps {
  definitions: ScreenDefinition[];
}

export const ScreenRegistration: FC<IScreenRegistrationProps> = (props: IScreenRegistrationProps) => {
  useScreenRegistrations(props.definitions);
  return null;
};
