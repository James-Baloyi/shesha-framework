import React, { Fragment, useMemo } from 'react';
import { AppEditModeToggler, IToolboxComponent, PERM_APP_CONFIGURATOR, ProtectedContent, ShaLink, useAuth, useSidebarMenu } from '@/index';
import ConfigurationItemViewModeToggler from '@/components/appConfigurator/configurationItemViewModeToggler';
import { DownOutlined, LoginOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';
import ParentProvider from '@/providers/parentProvider';
import { Space, Avatar, MenuProps, Dropdown } from 'antd';
import { useStyles } from './styles/styles';

type MenuItem = MenuProps['items'][number];

const ConfigurableEditModeToggler: IToolboxComponent = {
    type: 'header-subcomponent',
    canBeJsSetting: false,
    name: 'Admin Controls Group',
    icon: <SwapOutlined />,
    Factory: ({model}) => {
        const { loginInfo, logoutUser } = useAuth();
        const sidebar = useSidebarMenu(false);
        const { accountDropdownListItems } = sidebar || {};

        const accountMenuItems = useMemo<MenuItem[]>(() => {
            const result = (accountDropdownListItems ?? []).map<MenuItem>(({ icon, text, url: link, onClick }, index) => (
              {
                key: index,
                onClick: onClick,
                label: link ? (
                  <ShaLink icon={icon} linkTo={link}>
                    {text}
                  </ShaLink>
                ) : (
                  <Fragment>
                    {icon}
                  </Fragment>
                )
              }
            ));
            if (result.length > 0)
              result.push({ key: 'divider', type: 'divider' });
        
            result.push({ 
              key: 'logout', 
              onClick: logoutUser,
              label: (<>{<LoginOutlined />} Logout</>)
            });
        
            return result;
          }, [accountDropdownListItems]);

        //const { styles } = useStyles();        
        return (
            <ProtectedContent permissionName={PERM_APP_CONFIGURATOR}>
                <ParentProvider model={model}>
                    <Space>
                        <AppEditModeToggler {...model}/>
                        <ConfigurationItemViewModeToggler/>
                        <span className='separator'/>
                        <Dropdown
                            menu={{ items: accountMenuItems }}
                            trigger={['hover']}>
                            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                            {loginInfo?.fullName} <DownOutlined />
                            </a>
                        </Dropdown>
                        <Avatar icon={<UserOutlined/>}/>
                    </Space>
                </ParentProvider>
            </ProtectedContent>
        )
    }
}

export default ConfigurableEditModeToggler;