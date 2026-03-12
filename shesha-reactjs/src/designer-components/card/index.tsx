import ComponentsContainer from '@/components/formDesigner/containers/componentsContainer';
import { IToolboxComponent } from '@/interfaces';
import { useFormData, useGlobalState } from '@/providers';
import { useForm } from '@/providers/form';
import { getLayoutStyle, validateConfigurableComponentSettings } from '@/providers/form/utils';
import ParentProvider from '@/providers/parentProvider/index';
import { nanoid } from '@/utils/uuid';
import { CodeSandboxSquareFilled } from '@ant-design/icons';
import { Card } from 'antd';
import React, { useMemo } from 'react';
import { ICardComponentProps } from './interfaces';
import { getSettings } from './settingsForm';
import { migrateFormApi } from '../_common-migrations/migrateFormApi1';
import classNames from 'classnames';
import { useStyles } from './styles';
import { removeComponents } from '../_common-migrations/removeComponents';
import { removeNullUndefined } from '@/providers/utils';
import { defaultStyles } from './utils';
import { migratePrevStyles } from '../_common-migrations/migrateStyles';


const CardComponent: IToolboxComponent<ICardComponentProps> = {
  type: 'card',
  isInput: false,
  componentCatergory: 'layoutComponents',
  name: 'Card',
  preserveDimensionsInDesigner: true,
  icon: <CodeSandboxSquareFilled />,
  Factory: ({ model }) => {
    const { data } = useFormData();
    const { formMode } = useForm();
    const { globalState } = useGlobalState();
    const { styles } = useStyles();

    const title = model.hideHeading ? null : model.label;

    const newStyles = model.allStyles?.fullStyle ?? {};

    const headerComponents = model?.header?.components ?? [];

    const extra =
      (headerComponents?.length > 0 || formMode === 'designer') && !model.hideHeading ? (
        <ComponentsContainer
          containerId={model.header?.id}
          direction="horizontal"
          dynamicComponents={model?.isDynamic ? headerComponents : []}
        />
      ) : null;

    if (model.hidden) return null;

    return (
      <ParentProvider model={model}>
        <Card
          className={classNames(model.className, { [styles.hideWhenEmpty]: model.hideWhenEmpty })}
          title={title}
          extra={extra}
          styles={{}}
          style={{ ...removeNullUndefined(newStyles), ...getLayoutStyle(model, { data, globalState }) }}
        >
          <ComponentsContainer
            containerId={model?.content?.id}
            dynamicComponents={model?.isDynamic ? model?.content.components : []}
          />
        </Card>
      </ParentProvider>
    );
  },
  initModel: (model) => ({
    ...model,
    header: { id: nanoid(), components: [] },
    content: { id: nanoid(), components: [] },
    stylingBox: "{\"marginBottom\":\"5\"}",
  }),
  settingsFormMarkup: getSettings,
  validateSettings: (model) => validateConfigurableComponentSettings(getSettings, model),
  customContainerNames: ['header', 'content'],
  migrator: (m) => m
    .add<ICardComponentProps>(1, (prev) => ({ ...migrateFormApi.properties(prev) }))
    .add<ICardComponentProps>(2, (prev) => removeComponents(prev))
    .add<ICardComponentProps>(3, (prev) => ({ ...migratePrevStyles(prev, defaultStyles(prev)) })),

};

export default CardComponent;
