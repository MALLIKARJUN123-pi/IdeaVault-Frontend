import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Button, List, Timeline, Typography, Space, Tooltip, Empty, Skeleton, message } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  CalendarOutlined,
  StarOutlined,
  BulbOutlined,
  HistoryOutlined,
  ArrowRightOutlined,
  StarFilled,
  PushpinFilled
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ideaService from '../services/ideaService';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentIdeas, setRecentIdeas] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, recentData, activitiesData] = await Promise.all([
        ideaService.getStats(),
        ideaService.getRecent(),
        ideaService.getActivities()
      ]);
      setStats(statsData);
      setRecentIdeas(recentData);
      setActivities(activitiesData);
    } catch (error) {
      console.error(error);
      message.error('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    if (action === 'add') navigate('/ideas/new');
    else if (action === 'search') navigate('/ideas');
    else if (action === 'calendar') navigate('/calendar');
    else if (action === 'favorites') navigate('/favorites');
  };

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner */}
      <div style={{
        padding: '24px',
        background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
        borderRadius: '16px',
        color: '#ffffff',
        boxShadow: 'var(--shadow-md)',
      }}>
        <Title level={2} style={{ color: '#ffffff', margin: '0 0 8px 0', fontFamily: 'var(--font-display)' }}>
          Welcome back, {user?.name || 'Explorer'}! 👋
        </Title>
        <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '16px' }}>
          Capture your thoughts, structure plans, and fuel your projects inside your personal IdeaVault.
        </Text>
      </div>

      {/* Statistics Cards */}
      <Skeleton loading={loading} active paragraph={{ rows: 2 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={4}>
            <Card bodyStyle={{ padding: '20px' }}>
              <Statistic
                title="Total Ideas"
                value={stats?.totalIdeas || 0}
                prefix={<BulbOutlined style={{ color: '#4f46e5' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <Card bodyStyle={{ padding: '20px' }}>
              <Statistic
                title="Created Today"
                value={stats?.createdToday || 0}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <Card bodyStyle={{ padding: '20px' }}>
              <Statistic
                title="This Week"
                value={stats?.createdThisWeek || 0}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <Card bodyStyle={{ padding: '20px' }}>
              <Statistic
                title="This Month"
                value={stats?.createdThisMonth || 0}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <Card bodyStyle={{ padding: '20px' }}>
              <Statistic
                title="Favorites"
                value={stats?.favoritesCount || 0}
                prefix={<StarFilled style={{ color: '#fadb14' }} />}
              />
            </Card>
          </Col>
        </Row>
      </Skeleton>

      {/* Quick Actions & Dashboard Main Sections */}
      <Row gutter={[24, 24]}>
        {/* Left Side: Recent Ideas & Actions */}
        <Col xs={24} lg={16} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Actions Card */}
          <Card title={<span style={{ fontFamily: 'var(--font-display)' }}>Quick Actions</span>}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Button block type="primary" icon={<PlusOutlined />} onClick={() => handleQuickAction('add')} style={{ height: '42px', borderRadius: '8px' }}>
                  Add Idea
                </Button>
              </Col>
              <Col xs={12} sm={6}>
                <Button block icon={<SearchOutlined />} onClick={() => handleQuickAction('search')} style={{ height: '42px', borderRadius: '8px' }}>
                  Search Ideas
                </Button>
              </Col>
              <Col xs={12} sm={6}>
                <Button block icon={<CalendarOutlined />} onClick={() => handleQuickAction('calendar')} style={{ height: '42px', borderRadius: '8px' }}>
                  Calendar View
                </Button>
              </Col>
              <Col xs={12} sm={6}>
                <Button block icon={<StarOutlined />} onClick={() => handleQuickAction('favorites')} style={{ height: '42px', borderRadius: '8px' }}>
                  Favorites
                </Button>
              </Col>
            </Row>
          </Card>

          {/* Recent Ideas */}
          <Card
            title={<span style={{ fontFamily: 'var(--font-display)' }}>Recent Ideas</span>}
            extra={<Button type="link" onClick={() => navigate('/ideas')}>View All <ArrowRightOutlined /></Button>}
          >
            <Skeleton loading={loading} active>
              {recentIdeas.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={recentIdeas}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button type="text" onClick={() => navigate(`/ideas/${item.id}`)}>View</Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            backgroundColor: item.color || '#e0e7ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                          }}>
                            💡
                          </div>
                        }
                        title={
                          <Space>
                            <span style={{ fontWeight: 600, fontSize: '15px' }}>{item.title}</span>
                            {item.pinned && <PushpinFilled style={{ color: '#1890ff', fontSize: '12px' }} />}
                            {item.favorite && <StarFilled style={{ color: '#fadb14', fontSize: '12px' }} />}
                          </Space>
                        }
                        description={
                          <Space size="middle">
                            <span style={{ color: 'var(--text-secondary)' }}>Category: {item.category || 'General'}</span>
                            <span style={{ color: 'var(--text-muted)' }}>Status: {item.status}</span>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="No ideas created yet. Spark your first concept!" />
              )}
            </Skeleton>
          </Card>
        </Col>

        {/* Right Side: Activity History */}
        <Col xs={24} lg={8}>
          <Card title={<span><HistoryOutlined /> Recent Activity</span>} style={{ height: '100%' }}>
            <Skeleton loading={loading} active>
              {activities.length > 0 ? (
                <Timeline
                  items={activities.map(log => ({
                    color: log.action === 'CREATED' ? 'green' : log.action === 'DELETED' ? 'red' : 'blue',
                    children: (
                      <div>
                        <Text strong>{log.action}</Text> - {log.details}
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </div>
                    )
                  }))}
                />
              ) : (
                <Empty description="No activities logged yet." />
              )}
            </Skeleton>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
