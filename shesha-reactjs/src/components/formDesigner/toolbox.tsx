import React, { FC } from 'react';
import { ToolboxComponents } from './toolboxComponents';
import { ToolboxDataSources } from './toolboxDataSources';
import { useStyles } from './styles/styles';

export interface IProps {
  formId?: string;
}

const Toolbox: FC<IProps> = ({formId}) => {
  const { styles }  = useStyles();
  return (
    <div className={styles.shaDesignerToolbox}>
      <ToolboxComponents formId={formId}/>
      <ToolboxDataSources />
    </div>
  );
};

export default Toolbox;
