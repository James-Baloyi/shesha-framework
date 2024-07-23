import React, { FC, useMemo } from 'react';
import { TimeRangePicker, TimePicker } from '@/components/antd';
import moment, { Moment, isMoment } from 'moment';
import ReadOnlyDisplayFormItem from '@/components/readOnlyDisplayFormItem';
import { useFormData } from '@/providers';
import { getStyle } from '@/providers/form/utils';
import { getNumericValue } from '@/utils/string';
import { TimeSteps } from '@/components/antd/timepicker';
import { useStyles } from './styles/styles';
import { ITimePickerProps, RangePickerChangeEvent, TimePickerChangeEvent } from './models';
import { convertToCSSProperties } from '../_settings/font/utils';
import { getBorderStyle } from '../_settings/border/utils';
import { getBackgroundStyle } from '../_settings/background/utils';

type RangeValue = [moment.Moment, moment.Moment];

const DATE_TIME_FORMAT = 'HH:mm';

const getMoment = (value: any, dateFormat: string): Moment => {
  if (value === null || value === undefined) return undefined;
  const values = [
    isMoment(value) ? value : null,
    typeof(value) === 'number' ? moment.utc(value * 1000) : null, // time in millis
    typeof(value) === 'string' ? moment(value as string, dateFormat) : null, 
    typeof(value) === 'string' ? moment(value as string) : null
  ];

  const parsed = values.find((i) => isMoment(i) && i.isValid());

  return parsed;
};

const getTotalSeconds = (value: Moment): number => {
  if (!isMoment(value) || !value.isValid())
    return undefined;

  const timeOnly = moment.duration({
    hours: value.hours(),
    minutes: value.minutes(),
    seconds: value.seconds()
  });
  return timeOnly.asSeconds();
};

export const TimePickerWrapper: FC<ITimePickerProps> = ({
  onChange,
  range,
  value,
  defaultValue,
  placeholder,
  format = DATE_TIME_FORMAT,
  readOnly,
  style,
  hourStep,
  minuteStep,
  secondStep,
  disabled,
  hideBorder,
  fontControl,
  border,
  background,
  ...rest
}) => {
  const { data: formData } = useFormData();
  const { styles } = useStyles();

  const fontStyles = useMemo(() => convertToCSSProperties(fontControl), [fontControl])
  const borderStyles = useMemo(() => getBorderStyle(border), [border, formData]);
  const backgroundStyles = useMemo(() => getBackgroundStyle(background), [background, formData]);
  const evaluatedValue = getMoment(value, format);

  const hourStepLocal = getNumericValue(hourStep);
  const minuteStepLocal = getNumericValue(minuteStep);
  const secondStepLocal = getNumericValue(secondStep);


  //Should be a factors? if not shouldn't we delete the toolTips
  const steps: TimeSteps = {
    hourStep: 1 <= hourStepLocal && hourStepLocal <= 23 ? hourStepLocal as TimeSteps['hourStep'] : 1, // value should be in range 1..23
    minuteStep: 1 <= minuteStepLocal && minuteStepLocal <= 59 ? minuteStepLocal as TimeSteps['minuteStep'] : 1, // value should be in range 1..59
    secondStep: 1 <= secondStepLocal && secondStepLocal <= 59 ? secondStepLocal as TimeSteps['secondStep'] : 1, // value should be in range 1..59
  };

   
  const getRangePickerValues = (value: string | [string, string]) =>
      Array.isArray(value) && value?.length === 2 ? value?.map((v) => getMoment(v, format)) : [null, null];

  const handleTimePickerChange = (newValue: Moment, timeString: string) => {
    if (onChange){
      const seconds = getTotalSeconds(newValue);
      (onChange as TimePickerChangeEvent)(seconds, timeString);
    }
  };
  
  const handleRangePicker = (values: Moment[], timeString: [string, string]) => {
    if (onChange){
      const seconds = values?.map(value => getTotalSeconds(value));

      (onChange as RangePickerChangeEvent)(seconds, timeString);
    }
  };

  if (readOnly) {
    return <ReadOnlyDisplayFormItem value={evaluatedValue} disabled={disabled} type="time" timeFormat={format} />;
  }

  if (range) {
    return (
      <TimeRangePicker
        variant={hideBorder ? 'borderless' : undefined }
        onChange={handleRangePicker}
        format={format}
        value={getRangePickerValues(value || defaultValue) as RangeValue}
        {...steps}
        style={{...getStyle(style, formData), ...fontStyles, ...borderStyles, ...backgroundStyles}}
        className={styles.shaTimepicker}
        {...rest}
        placeholder={[placeholder, placeholder]}
     
      />
    );
  }

  return (
    <TimePicker
      variant={hideBorder ? 'borderless' : undefined }
      onChange={handleTimePickerChange}
      format={format}
      value={evaluatedValue|| (defaultValue && moment(defaultValue))}
      {...steps}
      style={{...getStyle(style, formData), ...fontStyles, ...borderStyles, ...backgroundStyles, ...{height: "auto", width: "auto", fontSize: fontStyles?.fontSize}}}
      className={styles.shaTimepicker}
      placeholder={placeholder}
      {...rest}
    />
  );
};