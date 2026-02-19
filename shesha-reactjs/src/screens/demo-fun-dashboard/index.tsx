"use client";

import React, { FC } from 'react';
import { Card, Col, Row, Statistic, Typography, Tag, Progress, Badge, Avatar, List, Flex } from 'antd';
import {
  RocketOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExperimentOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { IScreenProps } from '@/screen-registry/models';
import { createStyles } from '@/styles';

const { Title, Text } = Typography;

const useStyles = createStyles(({ css, token }) => ({
  wrapper: css`
    padding: 24px;
    min-height: 100vh;
    background: linear-gradient(135deg, ${token.colorBgLayout} 0%, ${token.colorBgContainer} 100%);
  `,
  headerCard: css`
    border-radius: ${token.borderRadiusLG}px;
    background: linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorInfo} 100%);
    border: none;
    .ant-card-body {
      padding: 32px;
    }
  `,
  headerTitle: css`
    color: #fff !important;
    margin-bottom: 4px !important;
  `,
  headerSubtitle: css`
    color: rgba(255, 255, 255, 0.85);
    font-size: 16px;
  `,
  statCard: css`
    border-radius: ${token.borderRadiusLG}px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    height: 100%;
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
  `,
  missionCard: css`
    border-radius: ${token.borderRadiusLG}px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
  `,
  crewAvatar: css`
    background-color: ${token.colorPrimary};
  `,
  statusOnline: css`
    color: ${token.colorSuccess};
    font-weight: 600;
  `,
  fuelSection: css`
    margin-top: 12px;
  `,
}));

const crewMembers = [
  { name: 'Cmdr. Elena Voss', role: 'Mission Commander', status: 'On Station', avatar: 'EV' },
  { name: 'Dr. Kai Nakamura', role: 'Flight Engineer', status: 'On Station', avatar: 'KN' },
  { name: 'Lt. Amara Osei', role: 'Pilot', status: 'EVA', avatar: 'AO' },
  { name: 'Dr. Luca Ferretti', role: 'Science Officer', status: 'On Station', avatar: 'LF' },
  { name: 'Sgt. Yuki Tanaka', role: 'Systems Specialist', status: 'Resting', avatar: 'YT' },
];

const missionTimeline = [
  { event: 'Orbit Insertion Burn', time: 'T+00:42:18', status: 'completed' },
  { event: 'Solar Array Deployment', time: 'T+01:15:03', status: 'completed' },
  { event: 'Docking Sequence Alpha', time: 'T+03:28:41', status: 'completed' },
  { event: 'Crew Module Pressurization', time: 'T+04:02:19', status: 'completed' },
  { event: 'Science Bay Activation', time: 'T+06:00:00', status: 'in-progress' },
  { event: 'Deep Space Comm Link', time: 'T+08:30:00', status: 'pending' },
  { event: 'Gravity Experiment Start', time: 'T+12:00:00', status: 'pending' },
];

const systemReadings = [
  { label: 'Liquid Oxygen', percent: 87, color: '#1890ff' },
  { label: 'Liquid Hydrogen', percent: 72, color: '#13c2c2' },
  { label: 'Hydrazine (RCS)', percent: 95, color: '#52c41a' },
  { label: 'Life Support O2', percent: 64, color: '#faad14' },
];

const MissionControlDashboard: FC<IScreenProps> = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.wrapper}>
      <Row gutter={[16, 16]}>
        {/* Header */}
        <Col span={24}>
          <Card className={styles.headerCard}>
            <Flex align="center" gap={16}>
              <RocketOutlined style={{ fontSize: 48, color: '#fff' }} />
              <div>
                <Title level={2} className={styles.headerTitle}>Mission Control</Title>
                <Text className={styles.headerSubtitle}>
                  Artemis VII — Low Earth Orbit Station Resupply | Mission Day 4
                </Text>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <Tag color="green" style={{ fontSize: 14, padding: '4px 12px' }}>
                  ALL SYSTEMS NOMINAL
                </Tag>
              </div>
            </Flex>
          </Card>
        </Col>

        {/* Stat Cards */}
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Orbital Velocity"
              value={27580}
              suffix="km/h"
              prefix={<DashboardOutlined style={{ color: '#1890ff' }} />}
            />
            <Tag color="blue" style={{ marginTop: 8 }}>Stable</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Altitude"
              value={408}
              suffix="km"
              prefix={<GlobalOutlined style={{ color: '#52c41a' }} />}
            />
            <Tag color="green" style={{ marginTop: 8 }}>Nominal</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Crew Members"
              value={5}
              suffix="/ 5"
              prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
            />
            <Tag color="purple" style={{ marginTop: 8 }}>All Healthy</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Power Output"
              value={98.4}
              suffix="%"
              precision={1}
              prefix={<ThunderboltOutlined style={{ color: '#faad14' }} />}
            />
            <Tag color="gold" style={{ marginTop: 8 }}>Solar Arrays OK</Tag>
          </Card>
        </Col>

        {/* Fuel Levels */}
        <Col xs={24} lg={12}>
          <Card title={<><ExperimentOutlined /> Propellant & Life Support</>} className={styles.missionCard}>
            <div className={styles.fuelSection}>
              {systemReadings.map((fuel) => (
                <div key={fuel.label} style={{ marginBottom: 16 }}>
                  <Flex justify="space-between" style={{ marginBottom: 4 }}>
                    <Text>{fuel.label}</Text>
                    <Text strong>{fuel.percent}%</Text>
                  </Flex>
                  <Progress
                    percent={fuel.percent}
                    strokeColor={fuel.color}
                    showInfo={false}
                    size="small"
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Crew Status */}
        <Col xs={24} lg={12}>
          <Card title={<><TeamOutlined /> Crew Status</>} className={styles.missionCard}>
            <List
              itemLayout="horizontal"
              dataSource={crewMembers}
              renderItem={(member) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar className={styles.crewAvatar}>{member.avatar}</Avatar>}
                    title={member.name}
                    description={member.role}
                  />
                  <Badge
                    status={member.status === 'EVA' ? 'warning' : member.status === 'Resting' ? 'default' : 'success'}
                    text={member.status}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Mission Timeline */}
        <Col span={24}>
          <Card title={<><ClockCircleOutlined /> Mission Timeline</>} className={styles.missionCard}>
            <Row gutter={[12, 12]}>
              {missionTimeline.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={Math.floor(24 / missionTimeline.length) || 3} key={item.event}>
                  <Card
                    size="small"
                    style={{
                      borderLeft: `3px solid ${
                        item.status === 'completed' ? '#52c41a' : item.status === 'in-progress' ? '#1890ff' : '#d9d9d9'
                      }`,
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                    <br />
                    <Text strong style={{ fontSize: 13 }}>{item.event}</Text>
                    <br />
                    <Tag
                      color={item.status === 'completed' ? 'success' : item.status === 'in-progress' ? 'processing' : 'default'}
                      icon={item.status === 'completed' ? <CheckCircleOutlined /> : item.status === 'in-progress' ? <ClockCircleOutlined /> : undefined}
                      style={{ marginTop: 6 }}
                    >
                      {item.status === 'in-progress' ? 'In Progress' : item.status === 'completed' ? 'Done' : 'Pending'}
                    </Tag>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MissionControlDashboard;
