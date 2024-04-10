import React from 'react';
import { AppEditModeToggler, IToolboxComponent} from '@/index';
import { SwapOutlined } from '@ant-design/icons';
import ParentProvider from '@/providers/parentProvider';

const ConfigurableEditModeToggler: IToolboxComponent = {
    type: 'advanced',
    canBeJsSetting: false,
    name: 'Edit Mode Toggler',
    icon: <SwapOutlined />,
    Factory: ({model, form}) => {
            
        return (
            <ParentProvider model={model}>
                <AppEditModeToggler {...model}/>
            </ParentProvider>
        )
    }
}

export default ConfigurableEditModeToggler;