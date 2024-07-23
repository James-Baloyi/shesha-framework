import { IConfigurableFormComponent } from '@/providers/form/models';
import { IFontControlValues } from '../_settings/font/interface';
import { IBorderValue } from '../_settings/border/interfaces';
import { IBackgroundValue } from '../_settings/background/interfaces';

export interface INumberFieldComponentProps extends IConfigurableFormComponent {
  hideBorder?: boolean;
  min?: number;
  max?: number;
  highPrecision?: boolean;
  stepNumeric?: number;
  stepString?: string;
  placeholder?: string;
  fontControl?: IFontControlValues;
  border?: IBorderValue;
  background?: IBackgroundValue;
}
