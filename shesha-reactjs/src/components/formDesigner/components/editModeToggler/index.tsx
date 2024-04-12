import React from 'react';
import { AppEditModeToggler, IToolboxComponent, PERM_APP_CONFIGURATOR, ProtectedContent} from '@/index';
import ConfigurationItemViewModeToggler from '@/components/appConfigurator/configurationItemViewModeToggler';
import { SwapOutlined } from '@ant-design/icons';
import ParentProvider from '@/providers/parentProvider';
import { Space } from 'antd';

const ConfigurableEditModeToggler: IToolboxComponent = {
    type: 'header-subcomponent',
    canBeJsSetting: false,
    name: 'App Controls',
    icon: <SwapOutlined />,
    Factory: ({model}) => {       
        return (
            <ProtectedContent permissionName={PERM_APP_CONFIGURATOR}>
                <ParentProvider model={model}>
                    <Space>
                        <AppEditModeToggler {...model}/>
                        <ConfigurationItemViewModeToggler/>
                        <span className='separator'/>
                    </Space>
                </ParentProvider>
            </ProtectedContent>
        )
    }
}

export default ConfigurableEditModeToggler;