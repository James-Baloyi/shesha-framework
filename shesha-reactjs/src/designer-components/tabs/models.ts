import { TabPaneProps } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { EditMode, IConfigurableFormComponent, IInputStyles, IStyleType } from '@/interfaces';

export interface ITabPaneProps
  extends Omit<TabPaneProps, 'children' | 'tab' | 'style' | 'tabKey' | 'disabled'> {
  id: string;
  type?: string;
  icon?: string;
  key: string;
  title: string;
  hidden?: boolean;
  permissions?: string[];
  components?: IConfigurableFormComponent[];
  childItems?: ITabPaneProps[];
  editMode?: EditMode;
  selectMode?: EditMode;
  readOnly?: boolean;

  label?: string;
  name?: string;
  tooltip?: string;

  desktop?: IInputStyles;
  mobile?: IInputStyles;
  tablet?: IInputStyles;
}

interface ICardProps {
  card: IInputStyles;
}
export interface ITabsComponentProps extends IConfigurableFormComponent, IStyleType {
  tabs: ITabPaneProps[];
  size?: SizeType;
  defaultActiveKey?: string;
  tabType?: 'line' | 'card';
  hidden?: boolean;
  ghost?: boolean;
  customVisibility?: string;
  tabPosition?: 'left' | 'right' | 'top' | 'bottom';
  card?: IInputStyles;
  desktop?: IInputStyles & ICardProps;
  mobile?: IInputStyles & ICardProps;
  tablet?: IInputStyles & ICardProps;
}
