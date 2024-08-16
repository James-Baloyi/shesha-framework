import _ from 'lodash';
import classNames from 'classnames';
import ComponentsContainer from '../formDesigner/containers/componentsContainer';
import React, {
  FC,
  PropsWithChildren,
} from 'react';
import { ComponentsContainerForm } from '../formDesigner/containers/componentsContainerForm';
import { ComponentsContainerProvider } from '@/providers/form/nesting/containerContext';
import { Button, Form, Result, Spin } from 'antd';
import { ValidateErrorEntity } from '@/interfaces';
import { IConfigurableFormRendererProps } from './models';
import { ROOT_COMPONENT_KEY } from '@/providers/form/models';
import { ShaForm, useForm } from '@/providers/form';
import { useFormDesignerState } from '@/providers/formDesigner';
import { useSheshaApplication } from '@/providers';
import { useStyles } from './styles/styles';
import Link from 'next/link';
import ParentProvider from '@/providers/parentProvider';
import { LoadingOutlined } from '@ant-design/icons';
import { useDelayedUpdate } from '@/providers/delayedUpdateProvider';
import { useShaFormInstance } from '@/providers/form/newProvider/shaFormProvider';

export const ConfigurableFormRenderer: FC<PropsWithChildren<IConfigurableFormRendererProps>> = ({
  children,
  form,
  parentFormValues,
  initialValues,
  beforeSubmit,
  //shaForm,
  onFinish,
  onFinishFailed,
  onSubmittedFailed,
  ...props
}) => {
  const formInstance = useForm();
  const shaForm = useShaFormInstance();
  const { formMode, settings: formSettings, setValidationErrors } = shaForm;

  const { styles } = useStyles();
  const formFlatMarkup = ShaForm.useMarkup();
  const { anyOfPermissionsGranted } = useSheshaApplication();
  const { getPayload: getDelayedUpdates } = useDelayedUpdate(false) ?? {};

  const { isDragging = false } = useFormDesignerState(false) ?? {};

  const onValuesChangeInternal = (changedValues: any, values: any) => {
    props.onValuesChange?.(changedValues, values);

    shaForm.setFormData({ values: values, mergeValues: true });
  };

  const onFinishInternal = async (): Promise<void> => {
    setValidationErrors(null);

    if (!shaForm)
      return;

    try {
      await shaForm.submitData({
        data: formInstance.formData,
        antdForm: formInstance.form,
        getDelayedUpdates: getDelayedUpdates,
      });
    } catch (error) {
      onSubmittedFailed?.();
      setValidationErrors(error?.data?.error || error);
      console.error('Submit failed: ', error);
    }
  };

  const onFinishFailedInternal = (errorInfo: ValidateErrorEntity) => {
    setValidationErrors(null);
    onFinishFailed?.(errorInfo);
  };

  const mergedProps = {
    layout: props.layout ?? formSettings.layout,
    labelCol: props.labelCol ?? formSettings.labelCol,
    wrapperCol: props.wrapperCol ?? formSettings.wrapperCol,
    colon: formSettings.colon,
  };

  if (formSettings?.access === 4 && !anyOfPermissionsGranted(formSettings?.permissions || [])) {
    return (
      <Result
        status="403"
        style={{ height: '100vh - 55px' }}
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary">
            <Link href={'/'}>
              Back Home
            </Link>
          </Button>
        }
      />
    );
  }

  const { /*dataLoadingState,*/ dataSubmitState } = shaForm ?? {};

  return (
    <ParentProvider model={{}} formMode={formMode} formFlatMarkup={formFlatMarkup} isScope >
      <ComponentsContainerProvider ContainerComponent={ComponentsContainerForm}>
        <Spin
          spinning={dataSubmitState?.status === 'loading'}
          tip="Saving data..."
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
        >
          <Form
            form={form}
            labelWrap
            size={props.size}
            onFinish={onFinishInternal}
            onFinishFailed={onFinishFailedInternal}
            onValuesChange={onValuesChangeInternal}
            initialValues={initialValues}
            className={classNames(styles.shaForm, { 'sha-dragging': isDragging }, props.className)}
            {...mergedProps}
          >
            <ComponentsContainer containerId={ROOT_COMPONENT_KEY} />
            {children}
          </Form>
        </Spin>
      </ComponentsContainerProvider>
    </ParentProvider>
  );
};