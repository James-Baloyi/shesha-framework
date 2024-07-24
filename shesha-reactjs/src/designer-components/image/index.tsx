import { IFormItem, IToolboxComponent } from '@/interfaces';
import { FormMarkup, IConfigurableFormComponent } from '@/providers/form/models';
import { FileImageOutlined } from '@ant-design/icons';
import ConfigurableFormItem from '@/components/formDesigner/components/formItem';
import settingsFormJson from './settingsForm.json';
import { evaluateValue, getStyle, pickStyleFromModel, validateConfigurableComponentSettings } from '@/providers/form/utils';
import React, { useMemo } from 'react';
import {
  migrateCustomFunctions,
  migratePropertyName,
} from '@/designer-components/_common-migrations/migrateSettings';
import { migrateVisibility } from '@/designer-components/_common-migrations/migrateVisibility';
import { StoredFileProvider, useForm, useFormData, useGlobalState, useSheshaApplication } from '@/providers';
import { isValidGuid } from '@/components/formDesigner/components/utils';
import { ValidationErrors } from '@/components';
import { ImageField, ImageSourceType } from './image';
import ConditionalWrap from '@/components/conditionalWrapper';
import { migrateFormApi } from '../_common-migrations/migrateFormApi1';
import { getBorderStyle } from '../_settings/border/utils';
import { IBorderValue } from '../_settings/border/interfaces';
import { ISizeValue } from '../_settings/size/sizeComponent';
import { getSizeStyle } from '../_settings/size/utils';

export interface IImageProps extends IConfigurableFormComponent, IFormItem {
  url?: string;
  storedFileId?: string;
  base64?: string;
  dataSource?: ImageSourceType;
  ownerType?: string;
  ownerId?: string;
  fileCategory?: string;
  allowPreview?: boolean;
  allowedFileTypes?: string[];
  border?: IBorderValue;
  dimensions?: ISizeValue;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  objectPosition?: string;
  stylingBox?: string;
  alt?: string;
  opacity?: string;
  filter?: string;
}

const settingsForm = settingsFormJson as FormMarkup;

const ImageComponent: IToolboxComponent<IImageProps> = {
  type: 'image',
  name: 'Image',
  icon: <FileImageOutlined />,
  isInput: true,

  Factory: ({ model }) => {
    const { data } = useFormData();
    const { formSettings } = useForm();
    const { globalState } = useGlobalState();
    const { backendUrl } = useSheshaApplication();
    const ownerId = evaluateValue(model.ownerId, { data, globalState });

    const borderStyles = useMemo(() => getBorderStyle(model?.border), [model?.border, data]);
    const sizeStyles = useMemo(() => getSizeStyle(model?.dimensions), [model.dimensions]);
    const stylingBoxJSON = JSON.parse(model?.stylingBox || '{}');

    const imageStyles = {...getStyle(model?.style, data), ...borderStyles, ...sizeStyles, ...{objectFit: model?.objectFit, objectPosition: model?.objectPosition, opacity: model?.opacity, filter: model?.filter}, ...pickStyleFromModel(stylingBoxJSON),};

    if (model.dataSource === 'storedFileId' && model.storedFileId && !isValidGuid(model.storedFileId)) {
      return <ValidationErrors error="The provided StoredFileId is inValid" />;
    }
  
    return (
      <ConfigurableFormItem model={model}>
        {(value, onChange) => {
          const val = model.dataSource === 'storedFileId' 
            ? model.storedFileId || value?.id || value 
            : model.dataSource === 'base64'
              ? model.base64 || value
              : model.url || value;

          const fileProvider = child => {
            return (
              <StoredFileProvider 
                value={val}
                onChange={onChange}
                fileId={val}
                baseUrl={backendUrl}
                ownerId={Boolean(ownerId) ? ownerId : Boolean(data?.id) ? data?.id : ''}
                ownerType={
                  Boolean(model.ownerType) ? model.ownerType : Boolean(formSettings?.modelType) ? formSettings?.modelType : ''
                }
                fileCategory={model.fileCategory}
                propertyName={!model.context ? model.propertyName : null}
                //uploadMode={model.useSync ? 'sync' : 'async'}
              >
                {child}
              </StoredFileProvider>
            );
          };

          return (
            <ConditionalWrap
              condition={model.dataSource === 'storedFileId'}
              wrap={fileProvider}
            >
            <ImageField
              allowedFileTypes={model?.allowedFileTypes}
              imageSource={model.dataSource}
              styles={imageStyles}
              width={sizeStyles.width}
              height={sizeStyles.height}
              value={val}
              readOnly={model?.readOnly}
              onChange={onChange}
              allowPreview={model?.allowPreview}
              alt={model?.alt}
            />
            </ConditionalWrap>
          );
        }}
      </ConfigurableFormItem>
    );
  },
  initModel: (model) => {
    const customModel: IImageProps = {
      ...model,
    };
    return customModel;
  },
  migrator: (m) => m
    .add<IImageProps>(0, (prev) => migratePropertyName(migrateCustomFunctions(prev) as IImageProps))
    .add<IImageProps>(1, (prev) => migrateVisibility(prev))
    .add<IImageProps>(2, (prev) => {
      return {
        ...prev,
        url: Boolean(prev.url) ? {_mode: 'code', _code: prev.url} : null,
        storedFileId: Boolean(prev.storedFileId) ? {_mode: 'code', _code: prev.storedFileId} : null,
      } as any;
    })
    .add<IImageProps>(3, (prev) => ({...migrateFormApi.properties(prev)}))
  ,
  settingsFormMarkup: settingsForm,
  validateSettings: (model) => validateConfigurableComponentSettings(settingsForm, model),
  
};

export default ImageComponent;


