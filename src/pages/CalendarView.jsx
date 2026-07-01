import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Modal, List, Button, Card, Typography, message } from 'antd';
import { CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ideaService from '../services/ideaService';

const { Title, Text } = Typography;

const CalendarView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState([]);
  
  // Modal states
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIdeas, setSelectedIdeas] = useState([]);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const data = await ideaService.getCalendar();
      setIdeas(data);
    } catch (e) {
      console.error(e);
      message.error('Failed to load ideas calendar database.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get formatted date string: YYYY-MM-DD
  const formatDateStr = (dateObj) => {
    return dateObj.format('YYYY-MM-DD');
  };

  const getIdeasForDate = (date) => {
    const dateStr = formatDateStr(date);
    return ideas.filter(idea => {
      const ideaDateStr = idea.createdAt.split('T')[0];
      return ideaDateStr === dateStr;
    });
  };

  // Render list of items inside day cell
  const dateCellRender = (value) => {
    const listData = getIdeasForDate(value);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, overflow: 'hidden' }}>
        {listData.slice(0, 3).map((item) => (
          <li key={item.id} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', fontSize: '11px', margin: '2px 0' }}>
            <Badge color={item.color || '#4f46e5'} text={item.title} />
          </li>
        ))}
        {listData.length > 3 && (
          <li style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
            + {listData.length - 3} more
          </li>
        )}
      </ul>
    );
  };

  // Handle cell selection
  const handleSelectDate = (value) => {
    const dayIdeas = getIdeasForDate(value);
    if (dayIdeas.length > 0) {
      setSelectedDate(value.format('LL'));
      setSelectedIdeas(dayIdeas);
      setModalVisible(true);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <Card
        title={
          <span>
            <CalendarOutlined style={{ color: 'var(--primary-color)', marginRight: '8px' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>Ideas Calendar</span>
          </span>
        }
      >
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>Loading Calendar...</div>
        ) : (
          <Calendar
            cellRender={dateCellRender}
            onSelect={handleSelectDate}
          />
        )}
      </Card>

      {/* Pop-up Modal for selected day's ideas */}
      <Modal
        title={<Title level={4} style={{ margin: 0 }}>Ideas Created on {selectedDate}</Title>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        <List
          itemLayout="horizontal"
          dataSource={selectedIdeas}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => {
                    setModalVisible(false);
                    navigate(`/ideas/${item.id}`);
                  }}
                >
                  View details
                </Button>
              ]}
            >
              <List.Item.Meta
                title={<strong style={{ fontSize: '15px' }}>{item.title}</strong>}
                description={
                  <div>
                    <Text type="secondary">{item.description.slice(0, 100)}...</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Badge color={item.color || '#4f46e5'} text={item.category || 'General'} />
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default CalendarView;
