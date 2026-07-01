import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Input, Select, DatePicker, Button, Table, Space, Tag, Badge, Segmented, Pagination, Empty, Tooltip, message, Typography } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  AppstoreOutlined,
  TableOutlined,
  DownloadOutlined,
  StarFilled,
  PushpinFilled,
  FilePdfOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ideaService from '../services/ideaService';
import { useAuth } from '../context/AuthContext';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Paragraph } = Typography;

const AllIdeas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [favorite, setFavorite] = useState(null);
  const [dateRange, setDateRange] = useState('');
  const [customDates, setCustomDates] = useState([null, null]);

  // View state
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Pagination & Data state
  const [ideas, setIdeas] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(9);
  const [loading, setLoading] = useState(true);

  // Search debouncer
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    fetchIdeas();
  }, [currentPage, pageSize, sortBy, sortDirection, status, priority, category, favorite, dateRange, customDates]);

  // Trigger search with a debounce delay
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(0);
      fetchIdeas(value);
    }, 400);
  };

  const fetchIdeas = async (currentQuery = searchQuery) => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: pageSize,
      sortBy: sortBy,
      direction: sortDirection
    };

    try {
      let data;
      // If there's an active query, prioritize search API
      if (currentQuery.trim() !== '') {
        data = await ideaService.search(currentQuery, params);
      } else {
        // Otherwise, use structured filtering API
        const filters = {
          status,
          priority,
          category,
          favorite: favorite === 'true' ? true : favorite === 'false' ? false : undefined,
          dateRange
        };
        if (dateRange === 'Custom' && customDates[0] && customDates[1]) {
          filters.dateFrom = customDates[0].format('YYYY-MM-DD');
          filters.dateTo = customDates[1].format('YYYY-MM-DD');
        }
        data = await ideaService.filter(filters, params);
      }
      setIdeas(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error(error);
      message.error('Failed to load ideas.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatus('');
    setPriority('');
    setCategory('');
    setFavorite(null);
    setDateRange('');
    setCustomDates([null, null]);
    setCurrentPage(0);
    message.info('Filters cleared.');
  };

  const handleExport = (type) => {
    if (!user?.email) return;
    if (type === 'pdf') ideaService.exportPdf(user.email);
    else if (type === 'excel') ideaService.exportExcel(user.email);
    else if (type === 'csv') ideaService.exportCsv(user.email);
    message.success(`Starting ${type.toUpperCase()} download...`);
  };

  // Table Column Definitions
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          <span style={{ fontWeight: 600 }}>{text}</span>
          {record.pinned && <PushpinFilled style={{ color: '#1890ff' }} />}
          {record.favorite && <StarFilled style={{ color: '#fadb14' }} />}
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat) => <Tag color="purple">{cat || 'General'}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (stat) => {
        let color = 'orange';
        if (stat === 'In Progress') color = 'blue';
        if (stat === 'Completed') color = 'green';
        if (stat === 'Archived') color = 'gray';
        return <Tag color={color}>{stat}</Tag>;
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (pri) => {
        let badge = 'default';
        if (pri === 'High') badge = 'error';
        if (pri === 'Medium') badge = 'warning';
        return <Badge status={badge} text={pri} />;
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button size="small" type="link" onClick={() => navigate(`/ideas/${record.id}`)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Filter and Search Bar */}
      <Card bodyStyle={{ padding: '20px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search by title, description, tags, notes..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={handleSearchChange}
              size="large"
              allowClear
            />
          </Col>
          <Col xs={24} md={16} style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <Space wrap>
              <Select placeholder="Status" value={status || undefined} onChange={setStatus} style={{ width: 130 }} allowClear>
                <Option value="New">New</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Archived">Archived</Option>
              </Select>
              <Select placeholder="Priority" value={priority || undefined} onChange={setPriority} style={{ width: 130 }} allowClear>
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
              </Select>
              <Select placeholder="Favorite" value={favorite} onChange={setFavorite} style={{ width: 130 }} allowClear>
                <Option value="true">Favorite</Option>
                <Option value="false">Non-Favorite</Option>
              </Select>
              <Select placeholder="Date Created" value={dateRange || undefined} onChange={setDateRange} style={{ width: 130 }} allowClear>
                <Option value="Today">Today</Option>
                <Option value="Yesterday">Yesterday</Option>
                <Option value="This Week">This Week</Option>
                <Option value="This Month">This Month</Option>
                <Option value="Custom">Custom Range</Option>
              </Select>
              {dateRange === 'Custom' && (
                <RangePicker
                  value={customDates}
                  onChange={(val) => setCustomDates(val || [null, null])}
                  style={{ width: 230 }}
                />
              )}
              <Tooltip title="Reset Filters">
                <Button icon={<ReloadOutlined />} onClick={handleResetFilters} />
              </Tooltip>
            </Space>

            <Space>
              <Segmented
                options={[
                  { value: 'cards', icon: <AppstoreOutlined /> },
                  { value: 'table', icon: <TableOutlined /> },
                ]}
                value={viewMode}
                onChange={setViewMode}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Sorting & Export Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <Space wrap>
          <span style={{ color: 'var(--text-secondary)' }}>Sort by:</span>
          <Select value={sortBy} onChange={setSortBy} style={{ width: 130 }}>
            <Option value="createdAt">Created Date</Option>
            <Option value="title">Title</Option>
            <Option value="priority">Priority</Option>
            <Option value="status">Status</Option>
          </Select>
          <Select value={sortDirection} onChange={setSortDirection} style={{ width: 130 }}>
            <Option value="desc">Newest First / Z-A</Option>
            <Option value="asc">Oldest First / A-Z</Option>
          </Select>
        </Space>

        <Space wrap>
          <span style={{ color: 'var(--text-secondary)' }}>Export Data:</span>
          <Button icon={<FilePdfOutlined />} onClick={() => handleExport('pdf')}>PDF</Button>
          <Button icon={<FileExcelOutlined />} onClick={() => handleExport('excel')}>Excel</Button>
          <Button icon={<FileTextOutlined />} onClick={() => handleExport('csv')}>CSV</Button>
        </Space>
      </div>

      {/* Main Listing View */}
      {loading ? (
        <Card loading>
          <div style={{ padding: '60px', textAlign: 'center' }}>Searching Vault...</div>
        </Card>
      ) : viewMode === 'cards' ? (
        <div>
          {ideas.length > 0 ? (
            <>
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
                              {idea.favorite && <StarFilled style={{ color: '#fadb14' }} />}
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
                              Modified: {new Date(idea.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
              <div style={{ textAlign: 'right', marginTop: '24px' }}>
                <Pagination
                  current={currentPage + 1}
                  pageSize={pageSize}
                  total={totalElements}
                  onChange={(page, size) => {
                    setCurrentPage(page - 1);
                    setPageSize(size);
                  }}
                  showSizeChanger
                  pageSizeOptions={['6', '9', '18', '36']}
                />
              </div>
            </>
          ) : (
            <Empty description="No ideas match your filters." />
          )}
        </div>
      ) : (
        <Card bodyStyle={{ padding: 0 }}>
          <Table
            dataSource={ideas.map(i => ({ ...i, key: i.id }))}
            columns={columns}
            pagination={{
              current: currentPage + 1,
              pageSize: pageSize,
              total: totalElements,
              onChange: (page, size) => {
                setCurrentPage(page - 1);
                setPageSize(size);
              },
              showSizeChanger: true
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default AllIdeas;
