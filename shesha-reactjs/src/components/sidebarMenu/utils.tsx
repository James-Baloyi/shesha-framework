import { QuestionOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { ISidebarMenuItem } from '@/providers/sidebarMenu';
import ShaIcon, { IconType } from '@/components/shaIcon';
import { isSidebarButton, isSidebarGroup, SidebarItemType } from '@/interfaces/sidebar';
import { IConfigurableActionConfiguration } from '@/providers/index';

type MenuItem = Required<MenuProps>['items'][number];

interface IGetItemArgs {
  label: React.ReactNode;
  key: React.Key;
  icon?: React.ReactNode;
  children?: MenuItem[];
  isParent?: boolean;
  itemType: SidebarItemType;
  url?: string;
  navigationType?: string;
  onClick?: () => void;
}

function getItem({ label, key, icon, children, isParent, itemType, onClick, navigationType, url }: IGetItemArgs): MenuItem {
  const clickHandler = (event) => {
    event.stopPropagation();
    onClick();
  };

  const className = classNames('nav-links-renderer', { 'is-parent-menu': isParent });

  return {
    key,
    icon,
    children,
    label: Boolean(onClick)
      ? navigationType === 'url' ? <a className={className} href={url} onClick={clickHandler}>{label}</a> : <a className={className} onClick={clickHandler}>{label}</a>
      : <span className={className}>{label}</span>,
    type: itemType === 'divider' ? 'divider' : undefined,
  } as MenuItem;
}

const getIcon = (icon: ReactNode, isParent?: boolean, isRootItem?: boolean) => {
  if (typeof icon === 'string')
    return <ShaIcon iconName={icon as IconType} className={classNames({ 'is-parent-menu': isParent })} />;

  if (React.isValidElement(icon)) return icon;
  return isRootItem ? <QuestionOutlined /> : null; // Make sure there's always an Icon on the root item menu, even when not specified
};

export interface IProps {
  item: ISidebarMenuItem;
  isItemVisible: (item: ISidebarMenuItem) => boolean;
  isRootItem?: boolean;
  onButtonClick?: (itemId: string, actionConfiguration: IConfigurableActionConfiguration) => void;
  onItemEvaluation?: (item: ISidebarMenuItem) => void;
}

export const sidebarMenuItemToMenuItem = ({ item, isItemVisible, onButtonClick, isRootItem, onItemEvaluation }: IProps): MenuItem => {
  const { id, title, icon, itemType } = item;

  const navigationType = item?.actionConfiguration?.actionArguments?.navigationType;

  const url = item?.actionConfiguration?.actionArguments?.url;

  if (typeof isItemVisible === 'function' && !isItemVisible(item)) return null;

  const children = isSidebarGroup(item)
    ? item.childItems?.map((item) => sidebarMenuItemToMenuItem({ item, onButtonClick, isItemVisible, onItemEvaluation }))
    : null;
  const hasChildren = Array.isArray(children) && children.length > 0;

  const actionConfiguration = isSidebarButton(item) ? item.actionConfiguration : undefined;

  const itemEvaluationArguments: IGetItemArgs = {
    label: title,
    key: id,
    icon: getIcon(icon, hasChildren, isRootItem),
    children: children,
    isParent: hasChildren,
    itemType,
    url,
    navigationType,
    onClick: actionConfiguration ? () => onButtonClick(id, actionConfiguration) : undefined,
  };
  if (onItemEvaluation)
    onItemEvaluation(item);

  return getItem(itemEvaluationArguments);
};