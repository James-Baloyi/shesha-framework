import { IConfigurableActionConfiguration, IConfigurableActionDescriptor } from '@/interfaces/configurableAction';
import { StandardNodeTypes } from '@/interfaces/formComponent';
import { useConfigurableActionDispatcher, useForm } from '@/providers';
import { IConfigurableActionGroupDictionary } from '@/providers/configurableActionsDispatcher/models';
import { SourceFilesFolderProvider } from '@/providers/sourceFileManager/sourcesFolderProvider';
import { arrayHasAtLeastNDefined } from '@/utils/array';
import { useAvailableStandardConstantsMetadata } from '@/utils/metadata/hooks';
import { isDefined, isNullOrWhiteSpace } from '@/utils/nullables';
import { nanoid } from '@/utils/uuid';
import { Form } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import HelpTextPopover from '@/components/helpTextPopover';
import { FC, ReactNode, useMemo, useState } from 'react';
import { StyledLabel } from '../_settings/utils/utils';
import { SettingInput } from '../settingsInput/settingsInput';
import { ActionArgumentsEditor } from './actionArgumensEditor';
import { ActionCatalogue, buildCatalogue, ICatalogueGroup } from './actionCatalogue';
import { ActionSummary } from './actionSummary';
import { ActionTray } from './actionTray';
import { IConfigurableActionConfiguratorComponentProps } from './interfaces';
import { useStyles } from './styles';

const getActionFullName = (actionOwner: string, actionName: string | undefined): string | null => {
  return actionName
    ? `${actionOwner}:${actionName}`
    : null;
};

interface IActionIdentifier {
  actionName: string;
  actionOwner: string;
}
const parseActionFullName = (fullName: string | null): IActionIdentifier | null => {
  const parts = !isNullOrWhiteSpace(fullName) ? fullName.split(':') : [];
  return arrayHasAtLeastNDefined(parts, 2)
    ? { actionOwner: parts[0], actionName: parts[1] } satisfies IActionIdentifier
    : null;
};

const FORM_ARGUMENTS_FIELD = 'actionArguments';
const ACTION_FULL_NAME_FIELD = 'actionFullName';

interface IActionCatalogueFieldProps {
  groups: ICatalogueGroup[];
  readOnly: boolean;
  value?: string | null | undefined;
  onChange?: ((value: string) => void) | undefined;
}

/** Form-controlled adapter so the catalogue can drive the `actionFullName` field directly. */
const ActionCatalogueField: FC<IActionCatalogueFieldProps> = ({ groups, readOnly, value, onChange }) => (
  <ActionCatalogue
    groups={groups}
    value={value}
    readOnly={readOnly}
    onSelect={(fullName) => onChange?.(fullName)}
  />
);

export const ConfigurableActionConfigurator: FC<IConfigurableActionConfiguratorProps> = (props) => {
  const [form] = Form.useForm();
  const { formSettings } = useForm();
  const { value, onChange, readOnly = false, label = 'Action Name', description } = props;
  const { styles } = useStyles();

  const [trayOpen, setTrayOpen] = useState(false);

  const { getActions, getConfigurableActionOrNull } = useConfigurableActionDispatcher();
  const actions = getActions();

  const availableConstants = useAvailableStandardConstantsMetadata();

  const formValues = useMemo<IActionFormModel | null>(() => {
    if (!value)
      return null;

    const { actionName, actionOwner, ...restProps } = value;
    const result: IActionFormModel = {
      ...restProps,
      actionFullName: getActionFullName(actionOwner, actionName),
    };
    return result;
  }, [value]);

  const hasChangedAction = (changedValues: Partial<IActionFormModel>): boolean => {
    if (isDefined(changedValues) && changedValues.hasOwnProperty(ACTION_FULL_NAME_FIELD)) {
      const { actionFullName } = changedValues;
      const prevActionFullName = formValues?.actionFullName;
      return prevActionFullName !== actionFullName;
    }
    return false;
  };

  const onValuesChange = (changedValues: Partial<IActionFormModel>, values: IActionFormModel): void => {
    const actionChanged = hasChangedAction(changedValues);
    if (actionChanged) {
      form.setFieldValue(FORM_ARGUMENTS_FIELD, undefined);
    }

    if (onChange) {
      const { actionFullName, actionArguments, ...restProps } = values;
      const actionId = parseActionFullName(actionFullName);

      const newFormValues: IConfigurableActionConfiguration = {
        actionName: actionId?.actionName ?? "",
        actionOwner: actionId?.actionOwner ?? "",
        actionArguments: actionChanged ? undefined : actionArguments,
        ...restProps,
        _type: StandardNodeTypes.ConfigurableActionConfig,
      };

      onChange(newFormValues);
    }
  };

  const { actionName, actionOwner } = value ?? {};
  const selectedAction = useMemo<IConfigurableActionDescriptor | null>(() => {
    return actionName && actionOwner
      ? getConfigurableActionOrNull({ owner: actionOwner, name: actionName })
      : null;
  }, [actionName, actionOwner, getConfigurableActionOrNull]);

  const availableActions = useMemo<IConfigurableActionGroupDictionary>(() => {
    if (!props.allowedActions)
      return actions;

    const result: IConfigurableActionGroupDictionary = {};
    for (const action in actions) {
      if (actions.hasOwnProperty(action) && actions[action] && props.allowedActions.includes(action)) {
        result[action] = actions[action];
      }
    }
    return result;
  }, [actions, props.allowedActions]);

  const catalogueGroups = useMemo<ICatalogueGroup[]>(() => buildCatalogue(availableActions), [availableActions]);

  const ownerName = !isNullOrWhiteSpace(actionOwner) ? availableActions[actionOwner]?.ownerName : undefined;

  const onClearAction = (): void => {
    form.setFieldsValue({
      actionFullName: null,
      actionArguments: undefined,
      handleSuccess: false,
      onSuccess: undefined,
      handleFail: false,
      onFail: undefined,
    });

    onChange?.({
      _type: StandardNodeTypes.ConfigurableActionConfig,
      actionOwner: "",
      actionName: "",
      actionArguments: undefined,
      handleSuccess: false,
      handleFail: false,
    });
  };

  const summary = (
    <ActionSummary
      action={selectedAction}
      ownerName={ownerName}
      hasArguments={isDefined(value?.actionArguments)}
      hasSuccessHandler={value?.handleSuccess === true}
      hasFailHandler={value?.handleFail === true}
      readOnly={readOnly}
      onOpen={() => setTrayOpen(true)}
      onClear={onClearAction}
    />
  );

  const detail = (
    <>
      {!selectedAction && (
        <div className={styles.emptyDetail}>
          <ThunderboltOutlined className="icon" />
          <div className="title">No action selected</div>
          <div>Pick an action from the list to configure it.</div>
        </div>
      )}

      {selectedAction && (
        <>
          <div className={styles.detailHeader}>
            {!isNullOrWhiteSpace(ownerName) && <div className="owner">{ownerName}</div>}
            <h3 className="name">{selectedAction.label ?? selectedAction.name}</h3>
            {!isNullOrWhiteSpace(selectedAction.description) && (
              <p className="description">{selectedAction.description}</p>
            )}
          </div>

          {selectedAction.hasArguments && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Arguments</div>
              <SourceFilesFolderProvider folder={`action-${props.level}`}>
                <Form.Item name={FORM_ARGUMENTS_FIELD} label={null} noStyle>
                  <ActionArgumentsEditor
                    action={selectedAction}
                    readOnly={readOnly}
                    availableConstants={availableConstants}
                  />
                </Form.Item>
              </SourceFilesFolderProvider>
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionTitle}>After the action runs</div>
            <p className={styles.sectionHint}>
              Chain another action once this one finishes. Each handler is configured in its own tray.
            </p>

            <div className={styles.handler}>
              <SettingInput propertyName="handleSuccess" label="Handle Success" type="switch" id={nanoid()} />
              {value?.handleSuccess === true && (
                <div className={styles.handlerBody}>
                  <Form.Item name="onSuccess" noStyle>
                    <ConfigurableActionConfigurator
                      editorConfig={props.editorConfig}
                      level={props.level + 1}
                      readOnly={readOnly}
                      label="On success"
                      hideLabel
                    />
                  </Form.Item>
                </div>
              )}
            </div>

            <div className={styles.handler}>
              <SettingInput propertyName="handleFail" label="Handle Fail" type="switch" id={nanoid()} />
              {value?.handleFail === true && (
                <div className={styles.handlerBody}>
                  <Form.Item name="onFail" noStyle>
                    <ConfigurableActionConfigurator
                      editorConfig={props.editorConfig}
                      level={props.level + 1}
                      readOnly={readOnly}
                      label="On fail"
                      hideLabel
                    />
                  </Form.Item>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );

  const trayTitle = props.level > 0 && typeof label === 'string'
    ? `Action configuration · ${label}`
    : 'Action configuration';

  return (
    <div className="sha-action-props">
      <Form<IActionFormModel>
        component={false}
        form={form}
        {...(formSettings ? { layout: formSettings.layout, colon: formSettings.colon } : {})}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onValuesChange={onValuesChange}
        {...(formValues ? { initialValues: formValues } : {})}
      >
        {props.level > 0 && props.hideLabel !== true && typeof label === 'string' && (
          <div className={styles.fieldLabel}>
            <HelpTextPopover content={description}>
              <StyledLabel label={label} />
            </HelpTextPopover>
          </div>
        )}
        {summary}

        <ActionTray
          open={trayOpen}
          onClose={() => setTrayOpen(false)}
          title={trayTitle}
          level={props.level}
          catalogue={(
            <Form.Item name={ACTION_FULL_NAME_FIELD} noStyle>
              <ActionCatalogueField groups={catalogueGroups} readOnly={readOnly} />
            </Form.Item>
          )}
          detail={detail}
        />
      </Form>
    </div>
  );
};

interface IConfigurableActionConfiguratorProps {
  label?: string | ReactNode;
  hideLabel?: boolean | undefined;
  description?: string | undefined;
  editorConfig: IConfigurableActionConfiguratorComponentProps | undefined;
  value?: IConfigurableActionConfiguration | undefined;
  onChange?: ((value: IConfigurableActionConfiguration) => void) | undefined;
  level: number;
  readOnly?: boolean | undefined;
  allowedActions?: string[] | undefined;
}

interface IActionFormModel extends Omit<IConfigurableActionConfiguration, 'actionOwner' | 'actionName'> {
  actionFullName: string | null;
}
