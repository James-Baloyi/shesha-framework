import React from 'react';
import { ComponentsContainer, IToolboxComponent, getLayoutStyle } from '@/index';
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
                containerId={model.id+'_1'}
                wrapperStyle={getLayoutStyle({ ...model, style: model?.wrapperStyle }, { data: formData, globalState })}
                dynamicComponents={model?.isDynamic ? model?.components : []}
                direction='horizontal'
                display='flex'
                flexDirection='row'
                alignSelf='center'
                justifyContent={model?.components?.length > 2 ? 'space-evenly' : 'space-between'}
                style={{backgroundColor: '#ffffff', padding: '10px', position: 'relative', borderBottom: '1px #666 solid'}}
            /> 
            </ParentProvider>
        )
    }
}

export default HeaderConfig;