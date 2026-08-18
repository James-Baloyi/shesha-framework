import { FC, ReactNode } from 'react';
import { Button, Drawer } from 'antd';
import { useStyles } from './styles';

interface IActionTrayProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Nesting depth, so stacked handler trays sit above their parent and stay reachable. */
  level: number;
  catalogue: ReactNode;
  detail: ReactNode;
}

/**
 * Full-height tray that gives the action configuration the room the settings panel cannot:
 * a browsable catalogue on the left, the selected action's configuration on the right.
 */
export const ActionTray: FC<IActionTrayProps> = ({ open, onClose, title, level, catalogue, detail }) => {
  const { styles } = useStyles();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      placement="right"
      size={Math.max(560, 920 - level * 60)}
      resizable
      className={styles.tray}
      destroyOnHidden
      mask={{ closable: true }}
      zIndex={1000 + level * 10}
      footer={(
        <div className={styles.trayFooter}>
          <Button type="primary" onClick={onClose}>Done</Button>
        </div>
      )}
    >
      <div className={styles.trayLayout}>
        {catalogue}
        <div className={styles.detail}>{detail}</div>
      </div>
    </Drawer>
  );
};
