import React, { useState, useEffect } from 'react';
import { Card, Tag, Button, Space, Row, Col, Typography, Modal, Badge, Tooltip, message, Divider } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  CopyFilled,
  ArrowLeftOutlined,
  StarOutlined,
  StarFilled,
  PushpinOutlined,
  PushpinFilled,
  CalendarOutlined,
  TagOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import ideaService from '../services/ideaService';

const { Title, Paragraph, Text } = Typography;

const IdeaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [idea, setIdea] = useState(null);

  useEffect(() => {
    fetchIdea();
  }, [id]);

  const fetchIdea = async () => {
    setLoading(true);
    try {
      const data = await ideaService.get(id);
      setIdea(data);
    } catch (error) {
      console.error(error);
      message.error('Failed to load idea details.');
      navigate('/ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      const updated = await ideaService.toggleFavorite(id);
      setIdea(updated);
      message.success(updated.favorite ? 'Added to favorites!' : 'Removed from favorites.');
    } catch (e) {
      message.error('Failed to update favorite status.');
    }
  };

  const handlePinToggle = async () => {
    try {
      const updated = await ideaService.togglePin(id);
      setIdea(updated);
      message.success(updated.pinned ? 'Idea pinned to dashboard!' : 'Idea unpinned.');
    } catch (e) {
      message.error('Failed to update pinned status.');
    }
  };

  const handleDuplicate = async () => {
    try {
      const duplicated = await ideaService.duplicate(id);
      message.success('Idea duplicated successfully!');
      navigate(`/ideas/${duplicated.id}`);
    } catch (e) {
      message.error('Failed to duplicate idea.');
    }
  };

  const handleCopyText = () => {
    if (!idea) return;
    const shareText = `Idea: ${idea.title}\n\nDescription:\n${idea.description}\n\nCategory: ${idea.category || 'General'}\nTags: ${idea.tags || 'None'}\nStatus: ${idea.status}\nPriority: ${idea.priority}`;
    navigator.clipboard.writeText(shareText);
    message.success('Copied details to clipboard!');
  };

  const handleDeleteConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this idea?',
      content: 'This idea will be soft-deleted. You can contact support to restore deleted entries.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await ideaService.delete(id);
          message.success('Idea deleted successfully.');
          navigate('/ideas');
        } catch (e) {
          message.error('Failed to delete idea.');
        }
      }
    });
  };

  const getPriorityBadgeStatus = (priority) => {
    if (priority === 'High') return 'error';
    if (priority === 'Medium') return 'warning';
    return 'default';
  };

  const getStatusColor = (status) => {
    if (status === 'In Progress') return 'blue';
    if (status === 'Completed') return 'green';
    if (status === 'Archived') return 'gray';
    return 'orange';
  };

  if (loading) {
    return (
      <Card loading>
        <div style={{ padding: '60px', textAlign: 'center' }}>Loading Details...</div>
      </Card>
    );
  }

  if (!idea) return null;

  return (
    <div className="animate-fade-in-up">
      {/* Action Bar */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Space>
          <Tooltip title={idea.pinned ? 'Unpin Idea' : 'Pin Idea'}>
            <Button
              icon={idea.pinned ? <PushpinFilled style={{ color: '#1890ff' }} /> : <PushpinOutlined />}
              onClick={handlePinToggle}
            />
          </Tooltip>
          <Tooltip title={idea.favorite ? 'Remove Favorite' : 'Mark Favorite'}>
            <Button
              icon={idea.favorite ? <StarFilled style={{ color: '#fadb14' }} /> : <StarOutlined />}
              onClick={handleFavoriteToggle}
            />
          </Tooltip>
          <Button icon={<CopyOutlined />} onClick={handleCopyText}>
            Copy Details
          </Button>
          <Button icon={<CopyFilled style={{ color: '#52c41a' }} />} onClick={handleDuplicate}>
            Duplicate
          </Button>
          <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/ideas/${id}/edit`)}>
            Edit
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Space>
      </div>

      {/* Main Details Card */}
      <Card
        style={{ borderTop: `6px solid ${idea.color || '#4f46e5'}` }}
        title={
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Title level={2} style={{ margin: 0, fontFamily: 'var(--font-display)' }}>
                {idea.title}
              </Title>
            </div>
            <Space style={{ marginTop: '8px', flexWrap: 'wrap' }}>
              <Tag icon={<TagOutlined />} color="purple">
                {idea.category || 'General'}
              </Tag>
              <Tag color={getStatusColor(idea.status)}>{idea.status}</Tag>
              <Badge status={getPriorityBadgeStatus(idea.priority)} text={`${idea.priority} Priority`} />
            </Space>
          </div>
        }
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={18}>
            <div style={{ minHeight: '300px', backgroundColor: 'rgba(0,0,0,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <Title level={4} style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Idea Description</Title>
              <div style={{ lineHeight: '1.8', color: 'var(--text-main)' }}>
                <ReactMarkdown>{idea.description}</ReactMarkdown>
              </div>
            </div>

            {idea.notes && (
              <div style={{ marginTop: '24px', backgroundColor: 'rgba(79, 70, 229, 0.03)', padding: '20px', borderRadius: '8px', border: '1px dotted var(--primary-color)' }}>
                <Title level={5} style={{ marginBottom: '8px', color: 'var(--primary-color)' }}>💡 Rough Notes & References</Title>
                <Paragraph style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
                  {idea.notes}
                </Paragraph>
              </div>
            )}
          </Col>

          <Col xs={24} md={6}>
            <Card type="inner" title="Metadata" style={{ background: 'var(--bg-app)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <Text type="secondary" block style={{ fontSize: '12px' }}>TAGS</Text>
                  {idea.tags ? (
                    <Space size="small" style={{ marginTop: '4px', flexWrap: 'wrap' }}>
                      {idea.tags.split(',').map(tag => (
                        <Tag key={tag.trim()} color="blue">{tag.trim()}</Tag>
                      ))}
                    </Space>
                  ) : (
                    <Text type="muted" style={{ fontStyle: 'italic' }}>No tags assigned</Text>
                  )}
                </div>

                <Divider style={{ margin: '8px 0' }} />

                <div>
                  <Text type="secondary" block style={{ fontSize: '12px' }}>CREATED AT</Text>
                  <Space><CalendarOutlined /><Text>{new Date(idea.createdAt).toLocaleString()}</Text></Space>
                </div>

                <div>
                  <Text type="secondary" block style={{ fontSize: '12px' }}>LAST MODIFIED</Text>
                  <Space><CalendarOutlined /><Text>{new Date(idea.updatedAt).toLocaleString()}</Text></Space>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default IdeaDetails;
