import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Typography, Empty, Skeleton, Space, Tag, message } from 'antd';
import { StarFilled, PushpinFilled, BulbOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ideaService from '../services/ideaService';

const { Title, Paragraph } = Typography;

const Favorites = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await ideaService.getFavorites();
      setIdeas(data);
    } catch (error) {
      console.error(error);
      message.error('Failed to load favorite ideas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0, fontFamily: 'var(--font-display)' }}>
          <StarFilled style={{ color: '#fadb14' }} /> Favorite Ideas
        </Title>
      </div>

      {loading ? (
        <Card loading>
          <div style={{ padding: '60px', textAlign: 'center' }}>Loading Favorites...</div>
        </Card>
      ) : ideas.length > 0 ? (
        <Row gutter={[16, 16]}>
          {ideas.map((idea) => (
            <Col xs={24} sm={12} lg={8} key={idea.id}>
              <Card
                style={{ borderTop: `5px solid ${idea.color || '#4f46e5'}` }}
                actions={[
                  <Button type="link" onClick={() => navigate(`/ideas/${idea.id}`)}>Details</Button>,
                  <Button type="link" onClick={() => navigate(`/ideas/${idea.id}/edit`)}>Edit</Button>
                ]}
              >
                <Card.Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '16px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {idea.title}
                      </span>
                      <Space size="small">
                        {idea.pinned && <PushpinFilled style={{ color: '#1890ff' }} />}
                        <StarFilled style={{ color: '#fadb14' }} />
                      </Space>
                    </div>
                  }
                  description={
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                      <Paragraph ellipsis={{ rows: 2 }} style={{ color: 'var(--text-secondary)', height: '44px', margin: 0 }}>
                        {idea.description}
                      </Paragraph>
                      <Space style={{ flexWrap: 'wrap' }}>
                        <Tag color="purple">{idea.category || 'General'}</Tag>
                        <Tag color={idea.status === 'Completed' ? 'green' : idea.status === 'In Progress' ? 'blue' : 'orange'}>{idea.status}</Tag>
                      </Space>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Created: {new Date(idea.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="You haven't favorited any ideas yet. Click the star icon on any idea detail page." />
      )}
    </div>
  );
};

export default Favorites;
