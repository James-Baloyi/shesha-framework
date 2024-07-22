import { IConfigurableFormComponent } from '@/providers/form/models';
import { IFontControlValues } from '../_settings/font/interface';
import { IBorderValue } from '../_settings/border/interfaces';
import { IBackgroundValue } from '../_settings/background/interfaces';

export type TextType = 'text' | 'password';

export interface ITextFieldComponentProps extends IConfigurableFormComponent {
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  suffixIcon?: string;
  prefixIcon?: string;
  hideBorder?: boolean;
  initialValue?: string;
  passEmptyStringByDefault?: boolean;
  textType?: TextType;
  fontControl?: IFontControlValues;
  border?: IBorderValue;
  background?: IBackgroundValue;
}
