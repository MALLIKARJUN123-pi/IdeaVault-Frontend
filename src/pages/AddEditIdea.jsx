import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Select, Switch, Space, Row, Col, Alert, Tooltip, message } from 'antd';
import { SaveOutlined, CloseOutlined, UndoOutlined, BulbOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import ideaService from '../services/ideaService';
import RichTextEditor from '../components/RichTextEditor';

const { Option } = Select;

const colors = [
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Blue', value: '#1890ff' },
  { name: 'Green', value: '#52c41a' },
  { name: 'Orange', value: '#fa8c16' },
  { name: 'Red', value: '#ff4d4f' },
  { name: 'Pink', value: '#eb2f96' },
  { name: 'Grey', value: '#8c8c8c' }
];

const AddEditIdea = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [description, setDescription] = useState('');
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchIdea();
    } else {
      // Check for unsaved drafts in localStorage
      const savedDraft = localStorage.getItem('ideavault_draft');
      if (savedDraft) {
        setHasDraft(true);
        setShowDraftPrompt(true);
      }
    }
  }, [id]);

  // Set up periodic auto-save to LocalStorage while typing (every 3 seconds)
  useEffect(() => {
    if (isEditMode) return; // Do not auto-save draft if editing an existing idea

    const interval = setInterval(() => {
      const formValues = form.getFieldsValue();
      const hasContent = formValues.title || description || formValues.category || formValues.notes;
      if (hasContent) {
        const draftData = {
          ...formValues,
          description,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem('ideavault_draft', JSON.stringify(draftData));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [description, form]);

  const fetchIdea = async () => {
    try {
      const data = await ideaService.get(id);
      form.setFieldsValue({
        title: data.title,
        category: data.category,
        tags: data.tags,
        status: data.status,
        priority: data.priority,
        notes: data.notes,
        favorite: data.favorite,
        pinned: data.pinned,
        color: data.color
      });
      setDescription(data.description);
    } catch (error) {
      console.error(error);
      message.error('Failed to load idea details.');
      navigate('/dashboard');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleRestoreDraft = () => {
    try {
      const savedDraft = localStorage.getItem('ideavault_draft');
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        form.setFieldsValue(draft);
        setDescription(draft.description || '');
        message.success('Draft restored successfully!');
      }
    } catch (e) {
      message.error('Failed to restore draft.');
    } finally {
      setShowDraftPrompt(false);
    }
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem('ideavault_draft');
    setHasDraft(false);
    setShowDraftPrompt(false);
    message.info('Draft discarded.');
  };

  const onFinish = async (values) => {
    setLoading(true);
    const payload = {
      ...values,
      description
    };

    try {
      if (isEditMode) {
        await ideaService.update(id, payload);
        message.success('Idea updated successfully!');
      } else {
        await ideaService.create(payload);
        message.success('Idea created successfully!');
        localStorage.removeItem('ideavault_draft'); // Clear draft on successful creation
      }
      navigate(isEditMode ? `/ideas/${id}` : '/ideas');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Error saving idea.';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setDescription('');
    if (!isEditMode) {
      localStorage.removeItem('ideavault_draft');
      setHasDraft(false);
    }
  };

  if (initialLoading) {
    return (
      <Card>
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading Idea Editor...</div>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {showDraftPrompt && (
        <Alert
          message="Unsaved Draft Found"
          description="It looks like you have a previously unsaved draft for a new idea."
          type="info"
          showIcon
          action={
            <Space direction="horizontal">
              <Button size="small" type="primary" onClick={handleRestoreDraft}>
                Restore
              </Button>
              <Button size="small" danger onClick={handleDiscardDraft}>
                Discard
              </Button>
            </Space>
          }
          style={{ marginBottom: '16px' }}
          closable
          onClose={() => setShowDraftPrompt(false)}
        />
      )}

      <Card
        title={
          <Space>
            <BulbOutlined style={{ color: 'var(--primary-color)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>
              {isEditMode ? 'Edit Idea' : 'Add New Idea'}
            </span>
          </Space>
        }
        extra={
          !isEditMode && description && (
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              <InfoCircleOutlined /> Auto-saved draft
            </span>
          )
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'New',
            priority: 'Medium',
            favorite: false,
            pinned: false,
            color: '#4f46e5'
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={16}>
              <Form.Item
                name="title"
                label="Idea Title"
                rules={[
                  { required: true, message: 'Title is required' },
                  { max: 200, message: 'Title cannot exceed 200 characters' }
                ]}
              >
                <Input placeholder="Enter a descriptive and unique title" maxLength={200} />
              </Form.Item>

              <Form.Item
                label="Description"
                required
                tooltip="Detail your idea using rich formatting. Markdown supported."
              >
                <RichTextEditor value={description} onChange={setDescription} />
                {!description && <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>Description is required</div>}
              </Form.Item>

              <Form.Item
                name="notes"
                label="Additional Notes / Thoughts"
              >
                <Input.TextArea placeholder="Jot down rough thoughts, resources, links, etc." rows={4} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="category"
                label="Category"
              >
                <Input placeholder="e.g., SaaS, Mobile App, AI" />
              </Form.Item>

              <Form.Item
                name="tags"
                label="Tags"
                tooltip="Separate tags with commas (e.g. AI, SaaS, Productivity)"
              >
                <Input placeholder="e.g., productivity, database, react" />
              </Form.Item>

              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="New">New</Option>
                      <Option value="In Progress">In Progress</Option>
                      <Option value="Completed">Completed</Option>
                      <Option value="Archived">Archived</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="priority"
                    label="Priority"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="Low">Low</Option>
                      <Option value="Medium">Medium</Option>
                      <Option value="High">High</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="color"
                label="Color Label"
              >
                <Select>
                  {colors.map(c => (
                    <Option key={c.value} value={c.value}>
                      <Space>
                        <span className="color-dot" style={{ backgroundColor: c.value }} />
                        {c.name}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="favorite"
                    label="Mark Favorite"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="pinned"
                    label="Pin Idea"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: 0 }}>
            <Space style={{ float: 'right' }}>
              <Button icon={<CloseOutlined />} onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button icon={<UndoOutlined />} onClick={handleReset}>
                Reset
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                disabled={!description}
              >
                {isEditMode ? 'Update Idea' : 'Save Idea'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddEditIdea;
