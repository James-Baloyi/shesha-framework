import React, { FC } from 'react';
import { Radio } from 'antd';
import { useSettingsFormContext } from '@/components/configurableForm/settingsFormContextWrapper';

export interface IStyleModeToggleProps {
  className?: string;
}

export const StyleModeToggle: FC<IStyleModeToggleProps> = ({ className }) => {
  const settingsFormContext = useSettingsFormContext();

  if (!settingsFormContext) return null;

  const { styleMode, setStyleMode } = settingsFormContext;

  const handleChange = (e: any) => {
    setStyleMode(e.target.value);
  };

  return (
    <Radio.Group
      value={styleMode}
      onChange={handleChange}
      size="small"
      className={className}
      buttonStyle="outline"
    >
      <Radio.Button value="regular">Default</Radio.Button>
      <Radio.Button value="hover">Hover</Radio.Button>
    </Radio.Group>
  );
};

export default StyleModeToggle;
