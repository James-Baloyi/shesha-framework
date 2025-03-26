import { IConfigurableFormComponent } from '@/providers/form/models';
import { IButtonGroupItem, IButtonItem } from '@/providers';
import { CSSProperties } from 'styled-components';
import { IFontValue } from '@/designer-components/_settings/utils/font/interfaces';
import { IBackgroundValue } from '@/designer-components/_settings/utils/background/interfaces';
import { IShadowValue } from '@/designer-components/_settings/utils/shadow/interfaces';
import { IBorderValue } from '@/designer-components/_settings/utils/border/interfaces';
import { I } from 'node_modules/@bprogress/next/dist/types-DfwEfSUF';
import { IDimensionsValue } from '@/designer-components/_settings/utils/dimensions/interfaces';

export type RefListGroupItemProps = IRefListItemFormModel | IRefListItemGroup;

export interface IRefListGroupItemBase extends IButtonItem{
  referenceList?: any;
  item?: string;
}

export interface IRefListItemFormModel extends IRefListGroupItemBase {
}

export interface IRefListItemGroup extends IRefListGroupItemBase {
  childItems?: RefListGroupItemProps[];
}

export interface IKanbanButton extends IButtonGroupItem {
  itemValue: number;
  item: string;
}
export interface IKanbanProps extends IConfigurableFormComponent {
  items?: IKanbanButton[];
  referenceList?: any;
  fontColor?: string;
  showIcons?: boolean;
  width?: number;
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  fontSize?: number;
  entityType?: string;
  allowNewRecord?: boolean;
  readonly?: boolean;
  collapsible?: boolean;
  gap?: number;
  headerStyles?: CSSProperties | string;
  columnStyle?: CSSProperties | string;
  groupingProperty?: string;
  modalFormId?: string;
  createFormId?: string;
  headerBackgroundColor: string;
  actionConfiguration: any;
  kanbanReadonly: boolean;
  componentName: string;
  editFormId: string;
  allowEdit: boolean;
  allowDelete: boolean;
  maxResultCount: number;
  maxWidth: number;
  minWidth: number;
  font?: IFontValue;
  background?: IBackgroundValue;
  columnBackground?: IBackgroundValue;
  shadow?: IShadowValue;
  border?: IBorderValue;
  columnShadow?: IShadowValue;
  columnBorder?: {
    border: IBorderValue;
  };
  dimensions?:IDimensionsValue;
}
