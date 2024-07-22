
import { IToolboxComponent } from '@/interfaces';
import { DataTypes } from '@/interfaces/dataTypes';
import { AntDesignOutlined } from '@ant-design/icons';
import React from 'react';
import ConfigurableFormItem from '@/components/formDesigner/components/formItem';
import FontComponent from '../_settings/font/fontComponent';

import { IFontSizeControlProps } from '../_settings/font/interface';

const FontConfigurator: IToolboxComponent<IFontSizeControlProps> = {
    type: 'fontControl',
    name: 'Font Control',
    icon: <AntDesignOutlined />,
    canBeJsSetting: true,
    dataTypeSupported: ({ dataType }) => dataType === DataTypes.boolean,
    Factory: ({ model: passedModel }) => {
        const { fontControl, ...model } = passedModel;

        return (
            <ConfigurableFormItem model={model}>
                {(value, onChange) => <FontComponent value={value} onChange={onChange} />}
            </ConfigurableFormItem>
        );
    },
    initModel: (model) => {
        return {
            ...model,
            label: 'Font Control',
        };
    }
};

export default FontConfigurator;
