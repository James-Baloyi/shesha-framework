import React, { PropsWithChildren, ReactElement, useContext, useMemo, useState } from 'react';
import { Form } from "antd";
import { DEFAULT_FORM_LAYOUT_SETTINGS, ISettingsFormFactoryArgs } from "@/interfaces";
import { getValuesFromSettings, updateSettingsFromValues } from './utils';
import { createNamedContext } from '@/utils/react';
import { DataTypes, IObjectMetadata, IPropertyMetadata } from '@/index';
import { linkComponentToModelMetadata } from '@/providers/form/utils';
import { ConfigurableFormActionsProvider } from '@/providers/form/actions';
import { deepMergeValues } from '@/utils/object';
import DataContextBinder from '@/providers/dataContextProvider/dataContextBinder';

export type StyleMode = 'regular' | 'hover';

interface SettingsFormState<TModel> {
  model?: TModel;
  values?: TModel;
  styleMode?: StyleMode;
}

interface ISettingsFormActions {
  propertyFilter: (name: string) => boolean;
  onValuesChange?: (changedValues: any) => void;
  setStyleMode?: (mode: StyleMode) => void;
}

/** initial state */
export const DATA_SOURCES_PROVIDER_CONTEXT_INITIAL_STATE: SettingsFormState<any> = {
};

export const SettingsFormStateContext = createNamedContext<SettingsFormState<any>>(DATA_SOURCES_PROVIDER_CONTEXT_INITIAL_STATE, "SettingsFormStateContext");

export const SettingsFormActionsContext = createNamedContext<ISettingsFormActions>(undefined, "SettingsFormActionsContext");

export type SettingsFormProps<TModel> = ISettingsFormFactoryArgs<TModel>;

const SettingsForm = <TModel = unknown>(props: PropsWithChildren<SettingsFormProps<TModel>>): ReactElement => {
  const {
    onSave,
    model,
    onValuesChange,
    propertyFilter,
    formRef,
    layoutSettings = DEFAULT_FORM_LAYOUT_SETTINGS,
  } = props;

  const [form] = Form.useForm();
  const [state, setState] = useState<SettingsFormState<TModel>>({
    model,
    values: getValuesFromSettings(model),
    styleMode: 'regular'
  });

  const contextMetadata = useMemo<Promise<IObjectMetadata>>(() => Promise.resolve({
    properties: [
      { path: 'styleMode', dataType: DataTypes.string },
    ],
    dataType: DataTypes.object,
  } as IObjectMetadata), []);

  if (formRef)
    formRef.current = {
      submit: () => form.submit(),
      reset: () => form.resetFields(),
    };

  const valuesChange = (changedValues): void => {
    const model = form.getFieldValue([]);
    const incomingState = updateSettingsFromValues(model, changedValues);
    setState({ model: incomingState, values: getValuesFromSettings(incomingState) });
    onValuesChange(changedValues, incomingState);
    form.setFieldsValue(incomingState);
  };

  const settingsChange = (changedValues): void => {
    const incomingState = deepMergeValues(state.model, changedValues);
    setState({ model: incomingState, values: getValuesFromSettings(incomingState) });
    onValuesChange(changedValues, incomingState);
    form.setFieldsValue(incomingState);
  };

  const onSaveInternal = (): void => {
    onSave(state.model);
  };

  const setStyleMode = (mode: StyleMode): void => {
    setState(prev => ({ ...prev, styleMode: mode }));
  };

  const SettingsFormActions: ISettingsFormActions = {
    propertyFilter,
    onValuesChange: valuesChange,
    setStyleMode,
  };

  const linkToModelMetadata = (metadata: IPropertyMetadata): void => {
    const currentModel = form.getFieldValue([]) as TModel;

    const wrapper = props.toolboxComponent.linkToModelMetadata
      ? (m) => linkComponentToModelMetadata(props.toolboxComponent, m, metadata)
      : (m) => m;

    const newModel: TModel = wrapper({
      ...currentModel,
      label: metadata.label || metadata.path,
      description: metadata.description,
    });

    valuesChange(newModel);
  };

  return (
    <DataContextBinder
      id="settingsFormContext"
      name="settingsFormContext"
      description="Settings form context"
      type="appLayer"
      data={{ styleMode: state.styleMode }}
      api={{ setStyleMode }}
      metadata={contextMetadata}
    >
      <ConfigurableFormActionsProvider actions={{ linkToModelMetadata }}>
        <SettingsFormStateContext.Provider value={state}>
          <SettingsFormActionsContext.Provider value={SettingsFormActions}>
            <Form
              form={form}
              onFinish={onSaveInternal}
              {...layoutSettings}
              onValuesChange={settingsChange}
              initialValues={model}
              size="small"
            >
              {props.children}
            </Form>
          </SettingsFormActionsContext.Provider>
        </SettingsFormStateContext.Provider>
      </ConfigurableFormActionsProvider>
    </DataContextBinder>
  );
};

export function useSettingsForm<TModel>(require: boolean = true): SettingsFormState<TModel> & ISettingsFormActions {
  const actionsContext = useContext(SettingsFormActionsContext);
  const stateContext = useContext<SettingsFormState<TModel>>(SettingsFormStateContext);

  if ((actionsContext === undefined || stateContext === undefined) && require) {
    throw new Error('useSettingsForm must be used within a SettingsForm');
  }
  return actionsContext !== undefined && stateContext !== undefined
    ? { ...actionsContext, ...stateContext }
    : undefined;
}

export default SettingsForm;
