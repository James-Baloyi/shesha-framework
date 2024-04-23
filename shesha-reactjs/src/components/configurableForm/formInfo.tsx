import React, { FC, useState } from 'react';
import { useAppConfigurator } from '@/providers';
import { IPersistedFormProps } from '@/providers/form/models';
import { Button, Card } from 'antd';
import { CONFIGURATION_ITEM_STATUS_MAPPING } from '@/utils/configurationFramework/models';
import { getFormFullName } from '@/utils/form';
import StatusTag from '@/components/statusTag';
import HelpTextPopover from '@/components/helpTextPopover';
import { BlockOutlined, CloseOutlined } from '@ant-design/icons';
import { QuickEditDialog } from '../formDesigner/quickEdit/quickEditDialog';
import { useStyles } from './styles/styles';

export interface FormInfoProps {
  /**
   * Persisted form props
   */
  formProps: IPersistedFormProps;
  /**
   * Is used for update of the form markup. If value of this handler is not defined - the form is read-only
   */
  onMarkupUpdated?: () => void;
}

export const FormInfo: FC<FormInfoProps> = ({ formProps, onMarkupUpdated }) => {
  const { id, versionNo, description, versionStatus, name, module } = formProps;
  const { toggleShowInfoBlock } = useAppConfigurator();
  const { styles } = useStyles();

  const [open, setOpen] = useState(false);

  const onModalOpen = () => setOpen(true);
  const onUpdated = () => {
    if (onMarkupUpdated)
      onMarkupUpdated();
    setOpen(false);
  };

  return (
    <Card
      className={styles.shaFormInfoCard}
      style={{position: "absolute", top: '0px', zIndex: 5, border: '0px', borderRadius: '0px', margin: '5px', boxShadow: '0px 2px 2px 0px rgba(0,0,0,.15)'}}
      bordered
      title={
        <>
          {id && (
            <Button style={{ padding: 0 }} type="link" onClick={onModalOpen}>
              <BlockOutlined title="Click to open this form in the designer" />
            </Button>
          )}
          <span className={styles.shaFormInfoCardTitle}>
            Form: {getFormFullName(module, name)} v{versionNo}
          </span>
          {false && <HelpTextPopover content={description}></HelpTextPopover>}
          <StatusTag value={versionStatus} mappings={CONFIGURATION_ITEM_STATUS_MAPPING} color={null}></StatusTag>
        </>
      }
      extra={<CloseOutlined onClick={() => toggleShowInfoBlock(false)} title="Click to hide form info" />}
      size="small"
    >
      {id && open && (
        <QuickEditDialog
          formId={id}
          open={open}
          onCancel={() => setOpen(false)}
          onUpdated={onUpdated}
        />
      )}
    </Card>
  );
};

export default FormInfo;
