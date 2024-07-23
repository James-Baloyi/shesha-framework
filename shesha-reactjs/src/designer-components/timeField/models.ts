import { IConfigurableFormComponent } from '@/providers/form/models';
import { IFontControlValues } from '../_settings/font/interface';
import { IBorderValue } from '../_settings/border/interfaces';
import { IBackgroundValue } from '../_settings/background/interfaces';

export type TimePickerChangeEvent = (value: number | null, timeString: string) => void;
export type RangePickerChangeEvent = (values: number[] | null, timeString: [string, string]) => void;

export interface ITimePickerProps extends IConfigurableFormComponent {
    className?: string;
    defaultValue?: string | [string, string];
    format?: string;
    value?: string | [string, string];
    placeholder?: string;
    popupClassName?: string;
    hourStep?: number;
    minuteStep?: number;
    secondStep?: number;
    disabled?: boolean; // Use
    range?: boolean; // Use
    allowClear?: boolean;
    autoFocus?: boolean;
    inputReadOnly?: boolean;
    showNow?: boolean;
    hideDisabledOptions?: boolean;
    use12Hours?: boolean;
    hideBorder?: boolean;
    onChange?: TimePickerChangeEvent | RangePickerChangeEvent;
    fontControl?: IFontControlValues;
    border?: IBorderValue;
    background?: IBackgroundValue;
  }