import { FC } from 'react';
import { Button, Tag, Tooltip } from 'antd';
import { CloseOutlined, RightOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { IConfigurableActionDescriptor } from '@/interfaces/configurableAction';
import { isNullOrWhiteSpace } from '@/utils/nullables';
import { useStyles } from './styles';

interface IActionSummaryProps {
  action: IConfigurableActionDescriptor | null;
  ownerName: string | undefined;
  hasArguments: boolean;
  hasSuccessHandler: boolean;
  hasFailHandler: boolean;
  readOnly: boolean;
  onOpen: () => void;
  onClear: () => void;
}

/**
 * Compact, information-dense stand-in for the action shown in the narrow settings panel.
 * Opens the tray, where there is room to actually configure the action.
 */
export const ActionSummary: FC<IActionSummaryProps> = ({
  action,
  ownerName,
  hasArguments,
  hasSuccessHandler,
  hasFailHandler,
  readOnly,
  onOpen,
  onClear,
}) => {
  const { styles } = useStyles();

  const isEmpty = !action;
  const className = [styles.trigger, isEmpty ? 'empty' : '', readOnly ? 'disabled' : ''].filter(Boolean).join(' ');

  return (
    <div
      role="button"
      tabIndex={readOnly ? -1 : 0}
      className={className}
      onClick={() => !readOnly && onOpen()}
      onKeyDown={(e) => {
        if (!readOnly && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <ThunderboltOutlined className={styles.triggerIcon} />
      <div className={styles.triggerBody}>
        {isEmpty
          ? <div className={styles.triggerTitle}>Select an action…</div>
          : (
            <>
              <div className={styles.triggerTitle} title={`${ownerName ?? ''} ${action.label ?? action.name}`}>
                {!isNullOrWhiteSpace(ownerName) && <span className="owner">{ownerName} · </span>}
                {action.label ?? action.name}
              </div>
              {!isNullOrWhiteSpace(action.description) && (
                <div className={styles.triggerDescription}>{action.description}</div>
              )}
              {(hasArguments || hasSuccessHandler || hasFailHandler) && (
                <div className={styles.triggerBadges}>
                  {hasArguments && <Tag variant="filled">arguments</Tag>}
                  {hasSuccessHandler && <Tag variant="filled" color="green">on success</Tag>}
                  {hasFailHandler && <Tag variant="filled" color="red">on fail</Tag>}
                </div>
              )}
            </>
          )}
      </div>
      <div className={styles.triggerActions}>
        {!isEmpty && !readOnly && (
          <Tooltip title="Clear action">
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
            />
          </Tooltip>
        )}
        <RightOutlined />
      </div>
    </div>
  );
};
