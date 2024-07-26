import { InputNumber, InputNumberProps, message } from 'antd';
import moment from 'moment';
import React, { CSSProperties, FC } from 'react';
import { customInputNumberEventHandler } from '@/components/formDesigner/components/utils';
import { useForm, useGlobalState, useSheshaApplication } from '@/providers';
import { getStyle, pickStyleFromModel } from '@/providers/form/utils';
import { axiosHttp } from '@/utils/fetchers';
import { INumberFieldComponentProps } from './interfaces';
import { getFormApi } from '@/providers/form/formApi';

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

  const style = model.style;

  const styling = JSON.parse(model.stylingBox || '{}');
  const stylingBoxAsCSS = pickStyleFromModel(styling);

  const additionalStyles: CSSProperties = {
    height: `${Number(model?.height) ? model?.height + 'px' : model?.height}`,
    width: `${Number(model?.width) ? model?.width + 'px' : model?.width}`,
    borderWidth: model?.hideBorder ? 0 : model?.borderSize,
    borderRadius: model?.borderRadius,
    borderStyle: model?.borderType,
    borderColor: model?.borderColor,
    backgroundColor: model?.backgroundColor,
    fontSize: model?.fontSize,
    ...stylingBoxAsCSS,
  };


  const inputProps: InputNumberProps = {
    className: 'sha-number-field',
    disabled: disabled,
    variant: model.hideBorder ? 'borderless' : undefined,
    min: model?.min,
    max: model?.max,
    placeholder: model?.placeholder,
    size: model?.size,
    style: style ? {...getStyle(style, form.formData, globalState), ...additionalStyles} : { ...additionalStyles, ...{ width: additionalStyles.width ?  additionalStyles?.width : '100%'}},
    step: model?.highPrecision ? model?.stepNumeric : model?.stepNumeric,
    ...customInputNumberEventHandler(eventProps, onChange),
    defaultValue: model?.defaultValue,
    changeOnWheel: false,
  };

  return <InputNumber value={value} {...inputProps} stringMode={model?.highPrecision} />;
};

export default NumberFieldControl;
