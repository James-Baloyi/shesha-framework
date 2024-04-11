
import React, { FC } from 'react';
import ReadOnlyModeSelector from '@/components/editModeSelector/index';
import SettingsCollapsiblePanel from '@/designer-components/_settings/settingsCollapsiblePanel';
import SettingsForm, { useSettingsForm } from '@/designer-components/_settings/settingsForm';
import SettingsFormItem from '@/designer-components/_settings/settingsFormItem';
import Show from '@/components/show';
import TextArea from 'antd/lib/input/TextArea';
import { Checkbox, Input, Select } from 'antd';
import { ISettingsFormFactoryArgs } from '@/interfaces';
import { Option } from 'antd/lib/mentions';
import { useForm } from '@/providers';
import { useFormDesigner } from '@/providers/formDesigner';


const AddressSettings: FC<ISettingsFormFactoryArgs> = ({ readOnly }) => {

  const designerModelType = useFormDesigner(false)?.formSettings?.modelType;
  const { formSettings } = useForm();

  return (
    <>
      <SettingsCollapsiblePanel header="Styles">

        <SettingsFormItem name="label" label="Label" jsSetting>
          <Select>
            <Option>Justify Content</Option>
            <Option value="flex">Flex</Option>
          </Select>
        </SettingsFormItem>

        <SettingsFormItem name="labelAlign" label="Label align" jsSetting>
          <Select disabled={readOnly}>
            <Option value="left">left</Option>
            <Option value="right">right</Option>
          </Select>
        </SettingsFormItem>

        <SettingsFormItem name="placeholder" label="Placeholder" jsSetting>
          <Input readOnly={readOnly} />
        </SettingsFormItem>

        <SettingsFormItem name="description" label="Description" jsSetting>
          <TextArea readOnly={readOnly} />
        </SettingsFormItem>

        <SettingsFormItem name="hideLabel" label="Hide Label" valuePropName="checked" jsSetting>
          <Checkbox disabled={readOnly} />
        </SettingsFormItem>

        <SettingsFormItem name="hidden" label="Hidden" valuePropName="checked" jsSetting>
          <Checkbox disabled={readOnly} />
        </SettingsFormItem>

        <SettingsFormItem name="readOnly" label="Edit mode" jsSetting>
          <ReadOnlyModeSelector readOnly={readOnly} />
        </SettingsFormItem>
      </SettingsCollapsiblePanel>

      <SettingsCollapsiblePanel header="Configuration">
      </SettingsCollapsiblePanel>




    </>
  );
};

export const AddressSettingsForm: FC<ISettingsFormFactoryArgs> = (props) => {
  return SettingsForm({ ...props, children: <AddressSettings {...props} /> });
};
