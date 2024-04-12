import React, { FC, Fragment, ReactNode, useMemo } from 'react';
import classNames from 'classnames';
import { Avatar, Dropdown, Input, MenuProps, Space } from 'antd';
import { DownOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '@/providers/auth';
import ShaLink from '@/components/shaLink';
import { ProtectedContent, AppEditModeToggler, ConfigurableLogo, ConfigurableForm } from '@/components';
import { PERM_APP_CONFIGURATOR } from '@/shesha-constants';
import { useSidebarMenu } from '@/providers';
import ConfigurationItemViewModeToggler from '../appConfigurator/configurationItemViewModeToggler';
import { useStyles } from './styles/styles';

const { Search } = Input;
type MenuItem = MenuProps['items'][number];

interface ILayoutHeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  collapsed?: boolean;
  customComponent?: ReactNode;
  imgSrc?: string;
}

const LayoutHeader: FC<ILayoutHeaderProps> = ({ collapsed, onSearch, customComponent, imgSrc }) => {
  const { loginInfo, logoutUser } = useAuth();
  const sidebar = useSidebarMenu(false);
  const { accountDropdownListItems, actions } = sidebar || {};
  const { styles } = useStyles();

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

  return (
    <div className={classNames(styles.layoutHeader, { collapsed })}>

        

        <ConfigurableForm mode={'readonly'} formId={"bf048529-72f3-456f-aecf-bbd9bfa81562"}/>
        
       
 
    </div>
  );
};

export default LayoutHeader;
