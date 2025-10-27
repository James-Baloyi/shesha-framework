import ConfigurableButton from './configurableButton';
import React, { useMemo } from 'react';
import { BorderOutlined } from '@ant-design/icons';
import { getSettings } from './settingsForm';
import { pickStyleFromModel, validateConfigurableComponentSettings } from '@/providers/form/utils';
import { IButtonComponentProps } from './interfaces';
import { IButtonGroupItemBaseV0, migrateV0toV1 } from './migrations/migrate-v1';
import { IToolboxComponent } from '@/interfaces';
import { makeDefaultActionConfiguration } from '@/interfaces/configurableAction';
import { migrateCustomFunctions, migratePropertyName, migrateReadOnly } from '@/designer-components/_common-migrations/migrateSettings';
import { migrateNavigateAction } from '@/designer-components/_common-migrations/migrate-navigate-action';
import { migrateV1toV2 } from './migrations/migrate-v2';
import { migrateVisibility } from '@/designer-components/_common-migrations/migrateVisibility';
import { migrateFormApi } from '../_common-migrations/migrateFormApi1';
import { migratePrevStyles } from '../_common-migrations/migrateStyles';
import { defaultStyles } from './util';
import { getBorderStyle } from '../_settings/utils/border/utils';
import { getFontStyle } from '../_settings/utils/font/utils';
import { getShadowStyle } from '../_settings/utils/shadow/utils';
import { getBackgroundStyle } from '../_settings/utils/background/utils';
import { getDimensionsStyle } from '../_settings/utils/dimensions/utils';

import { jsonSafeParse } from '@/utils/object';
import { StyleBoxValue } from '@/providers/form/models';
import { useCanvas } from '@/providers';

export type IActionParameters = [{ key: string; value: string }];

const ButtonComponent: IToolboxComponent<IButtonComponentProps> = {
  type: 'button',
  isInput: false,
  name: 'Button',
  icon: <BorderOutlined />,
  Factory: ({ model, form }) => {
    const { style, ...restProps } = model;
    const { designerWidth, designerDevice } = useCanvas();

    // Get the current device context (desktop, mobile, or tablet)
    const currentDevice = designerDevice || 'desktop';
    const deviceModel = model[currentDevice] || {};

    // Compute regular styles from device.styles or fallback to allStyles
    const regularStyles = useMemo(() => {
      const stylesProp = deviceModel.styles;

      if (!stylesProp) {
        // Fallback to allStyles if no device.styles exists
        return {
          ...model.allStyles.dimensionsStyles,
          ...(['primary', 'default'].includes(model.buttonType) && !model.readOnly && model.allStyles.borderStyles),
          ...model.allStyles.fontStyles,
          ...(['dashed', 'default'].includes(model.buttonType) && !model.readOnly && model.allStyles.backgroundStyles),
          ...(['primary', 'default'].includes(model.buttonType) && model.allStyles.shadowStyles),
          ...model.allStyles.stylingBoxAsCSS,
          ...model.allStyles.jsStyle,
          justifyContent: model.font?.align,
        };
      }

      // Compute from device.styles
      const styligBox = jsonSafeParse<StyleBoxValue>(stylesProp.stylingBox || '{}');
      const dimensionsStyles = getDimensionsStyle(stylesProp.dimensions, styligBox, designerWidth);
      const borderStyles = getBorderStyle(stylesProp.border, {});
      const fontStyles = getFontStyle(stylesProp.font);
      const shadowStyles = getShadowStyle(stylesProp.shadow);
      const backgroundStyles = getBackgroundStyle(stylesProp.background, {});
      const stylingBoxAsCSS = pickStyleFromModel(styligBox);

      return {
        ...dimensionsStyles,
        ...(['primary', 'default'].includes(model.buttonType) && !model.readOnly && borderStyles),
        ...fontStyles,
        ...(['dashed', 'default'].includes(model.buttonType) && !model.readOnly && backgroundStyles),
        ...(['primary', 'default'].includes(model.buttonType) && shadowStyles),
        ...stylingBoxAsCSS,
        ...model.allStyles.jsStyle,
        justifyContent: stylesProp.font?.align,
      };
    }, [deviceModel.styles, model.allStyles, model.buttonType, model.readOnly, designerWidth]);

    // Compute hover styles from device.hoverStyles (with fallback to root level for backward compatibility)
    const hoverStyle = useMemo(() => {
      // Try device-specific hover styles first, then fall back to root level
      const hoverStyles = deviceModel.hoverStyles || (model as any).hoverStyles;

      if (!hoverStyles) {
        return undefined;
      }

      const hoverDimensions = hoverStyles.dimensions;
      const hoverBorder = hoverStyles.border;
      const hoverFont = hoverStyles.font;
      const hoverShadow = hoverStyles.shadow;
      const hoverBackground = hoverStyles.background;
      const hoverStylingBox = hoverStyles.stylingBox;

      if (!hoverDimensions && !hoverBorder && !hoverFont && !hoverShadow && !hoverBackground && !hoverStylingBox) {
        return undefined;
      }

      const styligBox = jsonSafeParse<StyleBoxValue>(hoverStylingBox || '{}');
      const dimensionsStyles = getDimensionsStyle(hoverDimensions, styligBox, designerWidth);
      const borderStyles = getBorderStyle(hoverBorder, {});
      const fontStyles = getFontStyle(hoverFont);
      const shadowStyles = getShadowStyle(hoverShadow);
      const backgroundStyles = getBackgroundStyle(hoverBackground, {});
      const stylingBoxAsCSS = pickStyleFromModel(styligBox);

      return {
        ...dimensionsStyles,
        ...(['primary', 'default'].includes(model.buttonType) && !model.readOnly && borderStyles),
        ...fontStyles,
        ...(['dashed', 'default'].includes(model.buttonType) && !model.readOnly && backgroundStyles),
        ...(['primary', 'default'].includes(model.buttonType) && shadowStyles),
        ...stylingBoxAsCSS,
        justifyContent: hoverFont?.align,
      };
    }, [deviceModel.hoverStyles, (model as any).hoverStyles, model.buttonType, model.readOnly, designerWidth, currentDevice, deviceModel])

    return model.hidden ? null : (
      <ConfigurableButton
        {...restProps}
        readOnly={model.readOnly}
        block={restProps?.block}
        style={regularStyles}
        hoverStyle={hoverStyle}
        form={form}
      />
    );
  },
  settingsFormMarkup: (data) => getSettings(data),
  validateSettings: (model) => validateConfigurableComponentSettings(getSettings(model), model),
  initModel: (model) => {
    const buttonModel: IButtonComponentProps = {
      ...model,
      label: 'Submit',
      actionConfiguration: makeDefaultActionConfiguration({ actionName: 'Submit', actionOwner: 'Form' }),
      buttonType: 'default',
    };
    return buttonModel;
  },
  migrator: (m) =>
    m
      .add<IButtonGroupItemBaseV0>(0, (prev) => {
        const buttonModel: IButtonGroupItemBaseV0 = {
          ...prev,
          hidden: prev.hidden,
          label: prev.label ?? 'Submit',
          sortOrder: 0,
          itemType: 'item',
          name: prev['name'],
        };
        return buttonModel;
      })
      .add<IButtonComponentProps>(1, migrateV0toV1)
      .add<IButtonComponentProps>(2, migrateV1toV2)
      .add<IButtonComponentProps>(3, (prev) => migratePropertyName(migrateCustomFunctions(prev)))
      .add<IButtonComponentProps>(4, (prev) => migrateVisibility(prev))
      .add<IButtonComponentProps>(5, (prev) => ({ ...prev, actionConfiguration: migrateNavigateAction(prev.actionConfiguration) }))
      .add<IButtonComponentProps>(6, (prev) => migrateReadOnly(prev, 'editable'))
      .add<IButtonComponentProps>(7, (prev) => ({ ...migrateFormApi.eventsAndProperties(prev) }))
      .add<IButtonComponentProps>(8, (prev) => ({
        ...prev,
        desktop: { ...prev.desktop, buttonType: prev.buttonType || 'default' },
        mobile: { ...prev.mobile, buttonType: prev.buttonType || 'default' },
        tablet: { ...prev.tablet, buttonType: prev.buttonType || 'default' },
      }))
      .add<IButtonComponentProps>(9, (prev) => ({ ...migratePrevStyles(prev, defaultStyles(prev)) })),
};

export default ButtonComponent;
