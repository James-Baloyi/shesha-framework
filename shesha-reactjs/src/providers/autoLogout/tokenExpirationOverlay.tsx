import React, { FC, CSSProperties } from 'react';
import { Modal, Button, theme } from 'antd';
import { LockOutlined } from '@ant-design/icons';

export interface ITokenExpirationOverlayProps {
  visible: boolean;
  onLogin: () => void;
}

const containerStyle: CSSProperties = {
  textAlign: 'center',
  padding: '20px 0',
};

const iconStyle = (color: string): CSSProperties => ({
  fontSize: 48,
  color,
  marginBottom: 16,
});

const titleStyle: CSSProperties = {
  marginBottom: 16,
};

const messageStyle: CSSProperties = {
  fontSize: 16,
  marginBottom: 24,
};

export const TokenExpirationOverlay: FC<ITokenExpirationOverlayProps> = ({
  visible,
  onLogin,
}) => {
  const { token } = theme.useToken();

  return (
    <Modal
      open={visible}
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={[
        <Button key="login" type="primary" onClick={onLogin}>
          Login Again
        </Button>,
      ]}
      width={480}
    >
      <div style={containerStyle}>
        <LockOutlined style={iconStyle(token.colorError)} />
        <h2 style={titleStyle}>Session Expired</h2>
        <p style={messageStyle}>
          Your session has expired. Please log in again to continue.
        </p>
      </div>
    </Modal>
  );
};
