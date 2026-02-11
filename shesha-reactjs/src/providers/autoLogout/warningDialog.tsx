import React, { FC, useEffect, useState } from 'react';
import { Modal, Button, Progress } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface IWarningDialogProps {
  visible: boolean;
  timeRemaining: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const AutoLogoutWarningDialog: FC<IWarningDialogProps> = ({
  visible,
  timeRemaining,
  onStayLoggedIn,
  onLogout,
}) => {
  const [countdown, setCountdown] = useState(timeRemaining);
  const [srCountdown, setSrCountdown] = useState(timeRemaining);

  useEffect(() => {
    setCountdown(timeRemaining);
    setSrCountdown(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        const next = prev > 0 ? prev - 1 : 0;
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    if (countdown === 0 && visible) {
      onLogout();
    }
  }, [countdown, visible, onLogout]);

  useEffect(() => {
    if (!visible) return;

    const srInterval = setInterval(() => {
      setSrCountdown((prev) => Math.max(0, prev - 10));
    }, 10000);

    return () => clearInterval(srInterval);
  }, [visible]);

  const progressPercent = timeRemaining > 0 ? (countdown / timeRemaining) * 100 : 0;

  return (
    <Modal
      open={visible}
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={[
        <Button key="logout" onClick={onLogout}>
          Logout Now
        </Button>,
        <Button key="stay" type="primary" onClick={onStayLoggedIn}>
          Stay Logged In
        </Button>,
      ]}
      width={480}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <ExclamationCircleOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
        <h2 style={{ marginBottom: 16 }}>Session Timeout Warning</h2>
        <p style={{ fontSize: 16, marginBottom: 24 }}>
          Your session is about to expire due to inactivity. You will be automatically logged out in:
        </p>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 16 }} aria-live="off">
            {formatTime(countdown)}
          </div>
          <div style={{ position: 'absolute', left: '-10000px' }} aria-live="polite" aria-atomic="true">
            {srCountdown > 0 ? `${formatTime(srCountdown)} remaining` : 'Session expiring'}
          </div>
          <Progress
            percent={progressPercent}
            showInfo={false}
            strokeColor={progressPercent < 30 ? '#ff4d4f' : '#faad14'}
            trailColor="#f0f0f0"
          />
        </div>
        <p style={{ color: '#8c8c8c' }}>
          Click "Stay Logged In" to continue your session.
        </p>
      </div>
    </Modal>
  );
};
