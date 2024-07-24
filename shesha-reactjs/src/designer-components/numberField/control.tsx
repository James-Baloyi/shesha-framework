import { InputNumber, InputNumberProps, message } from 'antd';
import moment from 'moment';
import React, { FC, useMemo } from 'react';
import { customInputNumberEventHandler } from '@/components/formDesigner/components/utils';
import { useForm, useGlobalState, useSheshaApplication } from '@/providers';
import { getStyle } from '@/providers/form/utils';
import { axiosHttp } from '@/utils/fetchers';
import { INumberFieldComponentProps } from './interfaces';
import { getFormApi } from '@/providers/form/formApi';
import { convertToCSSProperties } from '../_settings/font/utils';
import { getBorderStyle } from '../_settings/border/utils';
import { getBackgroundStyle } from '../_settings/background/utils';

interface IProps {
  disabled: boolean;
  model: INumberFieldComponentProps;
  onChange?: Function;
  value?: number;
}

const NumberFieldControl: FC<IProps> = ({ disabled, model, onChange, value }) => {
  const form = useForm();
  const { globalState, setState: setGlobalState } = useGlobalState();
  const { backendUrl } = useSheshaApplication();

  const eventProps = {
    model,
    form: getFormApi(form),
    formData: form.formData,
    globalState,
    http: axiosHttp(backendUrl),
    message,
    moment,
    setGlobalState,
  };

  const fontStyles = useMemo(() => convertToCSSProperties(model?.fontControl), [model?.fontControl]);
  const borderStyles = useMemo(() => getBorderStyle(model?.border), [model?.border, form.formData]);
  const backgroundStyles = useMemo(() => getBackgroundStyle(model?.background), [model?.background, form.formData]);

  const inputProps: InputNumberProps = {
    className: 'sha-number-field',
    disabled: disabled,
    variant: model.hideBorder ? 'borderless' : undefined,
    min: model?.min,
    max: model?.max,
    placeholder: model?.placeholder,
    size: model?.size,
    style: {...getStyle(model?.style, form.formData, globalState), ...fontStyles, ...borderStyles, ...backgroundStyles, ...{width: '100%'}},
    step: model?.highPrecision ? model?.stepNumeric : model?.stepNumeric,
    ...customInputNumberEventHandler(eventProps, onChange),
    defaultValue: model?.defaultValue,
    changeOnWheel: false,
  };

  return <InputNumber value={value} {...inputProps} stringMode={model?.highPrecision} />;
};

export default NumberFieldControl;
