import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Button, Descriptions, Space, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined, CalendarOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Settings = () => {
  const { getProfile, changePassword } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    // Sync tab selection from query params
    const tabParam = searchParams.get('tab');
    if (tabParam === 'password') {
      setActiveTab('password');
    } else {
      setActiveTab('profile');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (e) {
      console.error(e);
      message.error('Failed to load profile.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordChange = async (values) => {
    setUpdatingPassword(true);
    try {
      await changePassword(values.oldPassword, values.newPassword);
      message.success('Password changed successfully!');
      passwordForm.resetFields();
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Failed to change password. Make sure current password is correct.';
      message.error(errMsg);
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'profile',
              label: (
                <span>
                  <UserOutlined />
                  Profile Details
                </span>
              ),
              children: (
                <div style={{ paddingTop: '12px' }}>
                  <Title level={4} style={{ marginBottom: '16px' }}>Account Information</Title>
                  {loadingProfile ? (
                    <div>Loading Profile...</div>
                  ) : profile ? (
                    <Descriptions bordered column={1} layout="horizontal">
                      <Descriptions.Item label="User ID">{profile.id}</Descriptions.Item>
                      <Descriptions.Item label="Full Name">{profile.name}</Descriptions.Item>
                      <Descriptions.Item label="Email Address">{profile.email}</Descriptions.Item>
                      <Descriptions.Item label="Account Role">{profile.role}</Descriptions.Item>
                      <Descriptions.Item label="Joined Date">
                        <Space>
                          <CalendarOutlined />
                          {new Date(profile.createdAt).toLocaleDateString()}
                        </Space>
                      </Descriptions.Item>
                    </Descriptions>
                  ) : (
                    <div>Error loading profile data.</div>
                  )}
                </div>
              ),
            },
            {
              key: 'password',
              label: (
                <span>
                  <LockOutlined />
                  Change Password
                </span>
              ),
              children: (
                <div style={{ paddingTop: '12px', maxWidth: '450px' }}>
                  <Title level={4} style={{ marginBottom: '8px' }}>Security Settings</Title>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                    Ensure your account is using a long, random password to stay secure.
                  </Text>
                  
                  <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordChange}
                  >
                    <Form.Item
                      name="oldPassword"
                      label="Current Password"
                      rules={[{ required: true, message: 'Please enter your current password!' }]}
                    >
                      <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Divider />

                    <Form.Item
                      name="newPassword"
                      label="New Password"
                      rules={[
                        { required: true, message: 'Please enter a new password!' },
                        { min: 6, message: 'Password must be at least 6 characters!' }
                      ]}
                      hasFeedback
                    >
                      <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item
                      name="confirm"
                      label="Confirm New Password"
                      dependencies={['newPassword']}
                      hasFeedback
                      rules={[
                        { required: true, message: 'Please confirm your new password!' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords do not match!'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password prefix={<SafetyCertificateOutlined />} />
                    </Form.Item>

                    <Form.Item style={{ marginTop: '24px' }}>
                      <Button type="primary" htmlType="submit" loading={updatingPassword}>
                        Update Password
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Settings;
