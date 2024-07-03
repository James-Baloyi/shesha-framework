import { IFlatComponentsStructure, IFormSettings, IPersistedFormProps } from '@/providers/form/models';
import React, { FC } from 'react';
import { ConfigurationItemVersionStatusMap } from '@/utils/configurationFramework/models';
import ParentProvider from '@/providers/parentProvider';
import { FormProvider } from '@/providers/form';
import Show from '../show';
import FormInfo from './formInfo';
import ConfigurableFormRenderer from './configurableFormRenderer';
import { useAppConfigurator } from '@/providers/appConfigurator';
import { IConfigurableFormProps } from './models';
import { FormFlatMarkupProvider } from '@/providers/form/providers/formMarkupProvider';

export interface IFormWithFlatMarkupProps extends IConfigurableFormProps {
  formFlatMarkup: IFlatComponentsStructure;
  formSettings: IFormSettings;
  persistedFormProps?: IPersistedFormProps;
  onMarkupUpdated?: () => void;
}

export const FormWithFlatMarkup: FC<IFormWithFlatMarkupProps> = (props) => {
  const {
    needDebug,
    mode,
    formRef,
    isActionsOwner,
    propertyFilter,
  } = props;

  const { 
    actions,
    sections,
    refetchData,

    parentFormValues,
    onValuesChange,
    form,
  } = props;

  const { formInfoBlockVisible } = useAppConfigurator();
  const { formFlatMarkup, formSettings, persistedFormProps, onMarkupUpdated } = props;
  if (!formFlatMarkup) return null;

  const formStatusInfo = persistedFormProps?.versionStatus
    ? ConfigurationItemVersionStatusMap[persistedFormProps.versionStatus]
    : null;

  const showFormInfo = Boolean(persistedFormProps) && formInfoBlockVisible && formStatusInfo;

  return (
    <FormFlatMarkupProvider markup={formFlatMarkup}>
      <ParentProvider model={{}} formMode={mode} formFlatMarkup={formFlatMarkup}>
        <FormProvider
          name={props.formName}
          formSettings={formSettings}
          needDebug={needDebug}
          onValuesChange={onValuesChange}

          mode={mode}
          form={form}
          formRef={formRef}
          actions={actions}
          sections={sections}
          
          refetchData={refetchData}
          isActionsOwner={isActionsOwner}
          propertyFilter={propertyFilter}

          parentFormValues={parentFormValues}
          initialValues={props.initialValues}
        >
          <Show when={Boolean(showFormInfo)}>
            <FormInfo formProps={persistedFormProps} onMarkupUpdated={onMarkupUpdated} />
          </Show>
          <ConfigurableFormRenderer {...props} />
        </FormProvider>
      </ParentProvider>
    </FormFlatMarkupProvider>
  );
};

export const FormWithFlatMarkupMemo = React.memo(FormWithFlatMarkup);