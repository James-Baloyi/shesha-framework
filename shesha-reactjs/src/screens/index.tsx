"use client";

import React, { FC } from 'react';
import { ScreenDefinition } from '@/screen-registry/models';
import { ScreenRegistration as ScreenRegistrationBase } from '@/screen-registry/screenRegistration';
import MissionControlDashboard from './demo-fun-dashboard';

const screenDefinitions: ScreenDefinition[] = [
  {
    path: 'demo/fun-dashboard',
    component: MissionControlDashboard,
    title: 'Mission Control',
  },
];

export const AppScreenRegistration: FC = () => {
  return <ScreenRegistrationBase definitions={screenDefinitions} />;
};
