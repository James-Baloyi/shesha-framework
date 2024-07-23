import { IConfigurableFormComponent } from '@/providers/form/models';
import { IDropdownProps } from '@/components/dropdown/model';
import { IFontControlValues } from '../_settings/font/interface';
import { IBorderValue } from '../_settings/border/interfaces';
import { IBackgroundValue } from '../_settings/background/interfaces';

export type DataSourceType = 'values' | 'referenceList' | 'url';

export interface ILabelValue<TValue = any> {
  id: string;
  label: string;
  value: TValue;
}

export interface IDropdownComponentProps extends Omit<IDropdownProps, 'style'>, IConfigurableFormComponent {
  fontControl?: IFontControlValues;
  border?: IBorderValue;
  background?: IBackgroundValue;
}
