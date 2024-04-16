import React, { FC } from 'react';
import classNames from 'classnames';
import { ConfigurableForm } from '@/components';
import { useStyles } from './styles/styles';
import { Divider } from 'antd';
import { useAppConfigurator } from '@/index';


interface ILayoutHeaderProps {
  collapsed?: boolean;
}

const LayoutHeader: FC<ILayoutHeaderProps> = ({ collapsed }) => {
  const { styles } = useStyles();

  const { formInfoBlockVisible  } = useAppConfigurator();


  return (
    <>
    <div className={classNames(styles.layoutHeader, { collapsed })}>
      <div className={styles.headerWrapper}>
      <ConfigurableForm mode={'readonly'} formId={'d9f81f76-1e67-4f51-b019-a3aaa02fa84c'} formProps={{ module: "TestModule", name: "header-test" }} />
      </div>
    </div>
    <Divider className={formInfoBlockVisible  ? styles.layoutDividerSpaced : styles.layoutDivider}/>
    </>
  );
};

export default LayoutHeader;
