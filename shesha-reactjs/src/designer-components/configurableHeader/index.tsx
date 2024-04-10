import React from 'react';
import { ComponentsContainer, ConfigurableHeader, IToolboxComponent, getLayoutStyle } from '@/index';
import { CheckSquareOutlined } from '@ant-design/icons';
import ParentProvider from '@/providers/parentProvider';
import globalState from '@/providers/globalState';

const HeaderConfig: IToolboxComponent = {
    type: 'layout',
    canBeJsSetting: false,
    name: 'Configurable Header',
    icon: <CheckSquareOutlined />,
    Factory: ({model}) => {
        const {formData} = model;

        return (
        <ParentProvider model={model}>
            <ComponentsContainer
                containerId={model.id}
                className={model.className}
                wrapperStyle={getLayoutStyle({ ...model, style: model?.wrapperStyle }, { data: formData, globalState })}
                dynamicComponents={model?.isDynamic ? model?.components : []}
                itemsLimit={9}
                direction='horizontal'
                display='grid'
                gridColumnsCount={9}
                style={{backgroundColor: '#ffffff', borderBottom: '1px #f2f2f2 solid', padding: '0px 10px 0px 10px', position: 'relative'}}
                
            />
            </ParentProvider>
        )
    }
}

export default HeaderConfig;