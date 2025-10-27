import React, { FC, PropsWithChildren, useContext, useMemo, useState } from 'react';
import DataContextBinder from '@/providers/dataContextProvider/dataContextBinder';
import { DataTypes, IObjectMetadata } from '@/index';
import { createNamedContext } from '@/utils/react';

export type StyleMode = 'regular' | 'hover';

export interface ISettingsFormContextWrapperProps extends PropsWithChildren {
  isEnabled: boolean;
}

export interface ISettingsFormContext {
  styleMode: StyleMode;
  setStyleMode: (mode: StyleMode) => void;
}

export const SettingsFormContext = createNamedContext<ISettingsFormContext | undefined>(undefined, "SettingsFormContext");

export const useSettingsFormContext = (): ISettingsFormContext | undefined => {
  return useContext(SettingsFormContext);
};

export const SettingsFormContextWrapper: FC<ISettingsFormContextWrapperProps> = ({ isEnabled, children }) => {
  const [styleMode, setStyleMode] = useState<StyleMode>('regular');

  const contextMetadata = useMemo<Promise<IObjectMetadata>>(() => Promise.resolve({
    properties: [
      { path: 'styleMode', dataType: DataTypes.string },
    ],
    dataType: DataTypes.object,
  } as IObjectMetadata), []);

  const contextValue: ISettingsFormContext = {
    styleMode,
    setStyleMode,
  };

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <SettingsFormContext.Provider value={contextValue}>
      <DataContextBinder
        id="settingsFormContext"
        name="settingsFormContext"
        description="Settings form context"
        type="appLayer"
        data={{ styleMode }}
        api={{ setStyleMode }}
        metadata={contextMetadata}
      >
        {children}
      </DataContextBinder>
    </SettingsFormContext.Provider>
  );
};

export default SettingsFormContextWrapper;
