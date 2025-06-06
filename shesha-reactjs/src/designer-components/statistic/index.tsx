import { ConfigurableFormItem } from '@/components';
import { customOnClickEventHandler, getEventHandlers} from '@/components/formDesigner/components/utils';
import ShaIcon, { IconType } from '@/components/shaIcon';
import ShaStatistic from '@/components/statistic';
import { IToolboxComponent } from '@/interfaces';
import { IInputStyles, useForm } from '@/providers';
import { IConfigurableFormComponent } from '@/providers/form/models';
import {
  getStyle,
  useAvailableConstantsData,
  validateConfigurableComponentSettings,
} from '@/providers/form/utils';
import { removeUndefinedProps } from '@/utils/object';
import { BarChartOutlined } from '@ant-design/icons';
import React, {  useMemo } from 'react';
import { migrateFormApi } from '../_common-migrations/migrateFormApi1';
import { migratePrevStyles } from '../_common-migrations/migrateStyles';
import { IFontValue } from '../_settings/utils/font/interfaces';
import { getFontStyle } from '../_settings/utils/font/utils';
import { getSettings } from './settingsForm';
import { defaultStyles } from './utils';
import { IBorderValue } from '../_settings/utils/border/interfaces';

interface IStatisticComponentProps extends Omit<IInputStyles, 'font'>, IConfigurableFormComponent {
  value?: number | string;
  precision?: number;
  title?: string | number;
  placeholder?: string;
  valueStyle?: string;
  titleStyle?: string;
  prefix?: string;
  suffix?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  titleFont?: IFontValue;
  valueFont?: IFontValue;
  onClick?: () => void;
  onDoubleClick?: () => void;
  borderSize?: string | number;
  borderRadius?: string | number;
  borderType?: string;
  borderColor?: string;
}

const StatisticComponent: IToolboxComponent<IStatisticComponentProps> = {
  type: 'statistic',
  name: 'Statistic',
  icon: <BarChartOutlined />,
  isInput: true,
  isOutput: true,
  Factory: ({ model: passedModel }) => {
    const { style, valueStyle, titleStyle, prefix, suffix, prefixIcon, suffixIcon, ...model } = passedModel;
     const allData = useAvailableConstantsData();
    const { formMode } = useForm();
    const { allStyles } = model;
    const valueFont = model?.valueFont;
    const titleFont = model?.titleFont;
    const valueStyles = getStyle(valueStyle);
    const titleStyles = getStyle(titleStyle);
    const valueFontStyles = useMemo(() => getFontStyle(valueFont), [valueFont]);
    const titleFontStyles = useMemo(() => getFontStyle(titleFont), [titleFont]);

    const customEvents = getEventHandlers(model, allData);

    if (formMode === 'designer') {
      return (
        <ConfigurableFormItem
          model={{ ...model, hideLabel: true }}
          valuePropName="checked"
          initialValue={model?.defaultValue}
        >
          {(value, _) => {
            const customEvent = customOnClickEventHandler(model, allData);
            const onClickInternal = (_: any) => {
              customEvent.onClick(value);
            };
            return (
              <ShaStatistic
                value={value || passedModel?.value || passedModel?.placeholder}
                precision={passedModel?.precision}
                title={
                  <div style={removeUndefinedProps({ ...titleFontStyles, ...titleStyles })}>{passedModel?.title}</div>
                }
                prefix={
                  <div>
                    {passedModel.prefixIcon && <ShaIcon iconName={passedModel.prefixIcon as IconType} />}
                    <span style={{ marginLeft: 5 }}>{passedModel.prefix ? passedModel.prefix : null}</span>
                  </div>
                }
                suffix={
                  <div>
                    <span style={{ marginRight: 5 }}>
                      {passedModel.suffix && passedModel.suffix}
                      {passedModel.suffixIcon && <ShaIcon iconName={passedModel.suffixIcon as IconType} />}
                    </span>
                  </div>
                }
                style={removeUndefinedProps({ ...allStyles.fullStyle })}
                valueStyle={removeUndefinedProps({
                  ...valueFontStyles,
                  ...valueStyles,
                  ...(!(value || passedModel?.value) && { opacity: 0.5, color: '#999' }),
                })}
                {...customEvents}
                onClick={onClickInternal}
              />
            );
          }}
        </ConfigurableFormItem>
      );
    }

    return (
      <ConfigurableFormItem
        model={{ ...model, hideLabel: true }}
        valuePropName="checked"
        initialValue={model?.defaultValue}
      >
        {(value) => {
          const customEvent = customOnClickEventHandler(model, allData);
          const onClickInternal = (_: any) => {
            customEvent.onClick(value);
          };
          return (
            <ShaStatistic
              value={value || passedModel?.value || passedModel?.placeholder}
              precision={passedModel?.precision}
              title={
                <div style={removeUndefinedProps({ ...titleFontStyles, ...titleStyles })}>{passedModel?.title}</div>
              }
              prefix={
                <div>
                  {passedModel.prefixIcon && <ShaIcon iconName={passedModel.prefixIcon as IconType} />}
                  <span style={{ marginLeft: 5 }}>{passedModel.prefix ? passedModel.prefix : null}</span>
                </div>
              }
              suffix={
                <div>
                  <span style={{ marginRight: 5 }}>{suffix && suffix}</span>
                  {suffixIcon && <ShaIcon iconName={suffixIcon as IconType} />}
                </div>
              }
              style={removeUndefinedProps({ ...allStyles.fullStyle })}
              valueStyle={removeUndefinedProps({
                ...valueFontStyles,
                ...valueStyles,
                ...(!(value || passedModel?.value) && { opacity: 0.5, color: '#999' }),
              })}
              {...customEvents}
              onClick={onClickInternal}
            />
          );
        }}
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: (data) => getSettings(data),
  validateSettings: (model) => validateConfigurableComponentSettings(getSettings(model), model),
  migrator: (m) =>
    m
      .add<IStatisticComponentProps>(1, (prev) => ({ ...migrateFormApi.properties(prev) }))
      .add<IStatisticComponentProps>(2, (prev) => {
        const styles = {
          style: prev?.style,
          valueFont: defaultStyles().valueFont,
          valueStyle: prev?.valueStyle,
          titleFont: defaultStyles().titleFont,
          titleStyle: prev?.titleStyle,
          hideBorder: prev?.hideBorder,
          shadow: defaultStyles().shadow,
          border: {
            border: defaultStyles().border.border as IBorderValue,
          },
        };

        return {
          ...prev,
          placeholder: 'R 1,234.00',
          desktop: { ...styles },
          tablet: { ...styles },
          mobile: { ...styles },
        };
      })
      .add<IStatisticComponentProps>(3, (prev) => ({ ...migratePrevStyles(prev, defaultStyles()) })),
};

export default StatisticComponent;
