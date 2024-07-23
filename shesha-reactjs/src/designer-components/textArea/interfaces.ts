import { IConfigurableFormComponent } from '@/providers/form/models';
import { IFontControlValues } from '../_settings/font/interface';
import { IBorderValue } from '../_settings/border/interfaces';
import { IBackgroundValue } from '../_settings/background/interfaces';

export interface ITextAreaComponentProps extends IConfigurableFormComponent {
    placeholder?: string;
    showCount?: boolean;
    autoSize?: boolean;
    allowClear?: boolean;
    hideBorder?: boolean;
    initialValue?: string;
    passEmptyStringByDefault?: boolean;
    fontControl?: IFontControlValues;
    border?: IBorderValue;
    background?: IBackgroundValue;
  }