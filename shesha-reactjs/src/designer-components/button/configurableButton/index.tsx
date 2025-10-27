import React, { FC, useState, CSSProperties, useMemo } from 'react';
import { Button, FormInstance } from 'antd';
import { ShaIcon, IconType } from '@/components';
import classNames from 'classnames';
import { IButtonItem } from '@/providers/buttonGroupConfigurator/models';
import { useConfigurableActionDispatcher } from '@/providers/configurableActionsDispatcher';
import { useAvailableConstantsData } from '@/providers/form/utils';
import { DataContextTopLevels, isNavigationActionConfiguration, useShaRouting, useTheme } from '@/index';
import { useAsyncMemo } from '@/hooks/useAsyncMemo';
import { useStyles } from './style';
import { createStyles } from '@/styles';
export interface IConfigurableButtonProps extends Omit<IButtonItem, 'style' | 'itemSubType'> {
  style?: CSSProperties;
  hoverStyle?: CSSProperties;
  form: FormInstance<any>;
  dynamicItem?: any;
}

const useDynamicHoverStyles = createStyles(({ css }, hoverStyle?: CSSProperties) => {
  if (!hoverStyle || Object.keys(hoverStyle).length === 0) {
    return { buttonWithHover: '' };
  }

  // Filter out undefined and null values
  const cleanedHoverStyle = Object.entries(hoverStyle)
    .filter(([_, value]) => value !== undefined && value !== null && value !== 'undefined')
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, any>);

  if (Object.keys(cleanedHoverStyle).length === 0) {
    return { buttonWithHover: '' };
  }

  const hoverStylesStr = Object.entries(cleanedHoverStyle)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${value} !important`;
    })
    .join('; ');

  const buttonWithHover = css`
    &.ant-btn:hover {
      ${hoverStylesStr};
    }
  `;

  return {
    buttonWithHover,
  };
});

export const ConfigurableButton: FC<IConfigurableButtonProps> = (props) => {
  const { actionConfiguration, dynamicItem, hoverStyle } = props;
  const { getUrlFromNavigationRequest } = useShaRouting();
  const { executeAction, useActionDynamicContext, prepareArguments } = useConfigurableActionDispatcher();
  const dynamicContext = useActionDynamicContext(actionConfiguration);
  const evaluationContext = useAvailableConstantsData({ topContextId: DataContextTopLevels.Full }, { ...dynamicContext, dynamicItem });

  const { theme } = useTheme();
  const { styles } = useStyles();
  const { styles: hoverStyles } = useDynamicHoverStyles(hoverStyle);
  const [loading, setLoading] = useState(false);
  const [isModal, setModal] = useState(false);

  const { buttonLoading, buttonDisabled } = {
    buttonLoading: loading && !isModal,
    buttonDisabled: props?.readOnly || (loading && isModal),
  };

  const onButtonClick = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    event.preventDefault();

    // Prevent action if button is disabled
    if (buttonDisabled) {
      return;
    }

    try {
      if (actionConfiguration) {
        if (['Show Dialog', 'Show Confirmation Dialog'].includes(actionConfiguration?.actionName)) {
          setModal(true);
        }
        setLoading(true);
        executeAction({
          actionConfiguration: { ...actionConfiguration },
          argumentsEvaluationContext: evaluationContext,
        })
          .finally(() => {
            setLoading(false);
          });
      } else console.error('Action is not configured');
    } catch (error) {
      setLoading(false);
      console.error('Validation failed:', error);
    }
  };


  const navigationUrl = useAsyncMemo(async () => {
    if (!isNavigationActionConfiguration(actionConfiguration) || !actionConfiguration.actionArguments)
      return undefined;
    const preparedArguments = await prepareArguments({ actionConfiguration, argumentsEvaluationContext: evaluationContext });
    return getUrlFromNavigationRequest(preparedArguments);
  }, [actionConfiguration], "");

  const isSameUrl = navigationUrl === window.location.href;

  const buttonClassName = classNames(
    'sha-toolbar-btn sha-toolbar-btn-configurable',
    styles.configurableButton,
    hoverStyles.buttonWithHover,
    buttonDisabled && styles.disabled
  );

  return (
    <Button
      href={navigationUrl}
      title={props.tooltip}
      block={props.block}
      loading={buttonLoading}
      onClick={onButtonClick}
      type={props.buttonType}
      danger={props.danger}
      icon={props.icon ? <ShaIcon iconName={props.icon as IconType} /> : undefined}
      iconPosition={props.iconPosition}
      className={buttonClassName}
      size={props?.size}
      style={{
        ...props?.style,
        ...(isSameUrl && { background: theme.application.primaryColor, color: theme.text.default }),
      }}
    >
      {props.label}
    </Button>
  );
};

export default ConfigurableButton;
