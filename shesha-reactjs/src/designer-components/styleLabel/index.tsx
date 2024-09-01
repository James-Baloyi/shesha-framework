
import { IToolboxComponent } from '@/interfaces';
import { DataTypes } from '@/interfaces/dataTypes';
import { ColumnWidthOutlined } from '@ant-design/icons';
import React from 'react';
import ConfigurableFormItem from '@/components/formDesigner/components/formItem';
import { getSettings } from './settings';
import LabelConfiguratorComponent from './components/label/labelConfigurator';
import { ILabelComponentProps } from './components/label/interfaces';

const LabelConfigurator: IToolboxComponent<ILabelComponentProps> = {
    type: 'labelConfigurator',
    name: 'Size',
    isInput: false,
    icon: <ColumnWidthOutlined />,
    canBeJsSetting: true,
    dataTypeSupported: ({ dataType }) => dataType === DataTypes.boolean,
    Factory: ({ model }) => {

        return (
            <ConfigurableFormItem model={model}>
                {(value, onChange) => <LabelConfiguratorComponent value={value} onChange={onChange} />}
            </ConfigurableFormItem>
        );
    },
    settingsFormMarkup: getSettings(),
};

export default LabelConfigurator;
