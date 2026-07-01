import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, MailOutlined, NumberOutlined, BulbOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      form.setFieldsValue({ email: emailParam });
    }
  }, [searchParams, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await resetPassword(values.email, values.token, values.password);
      message.success('Password reset successfully! Please login.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Failed to reset password. Please check your token.';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--bg-app) 0%, rgba(79, 70, 229, 0.08) 100%)',
      padding: '24px'
    }}>
      <Card style={{ width: '100%', maxWidth: '420px', boxShadow: 'var(--shadow-lg)' }} className="animate-fade-in-up">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <BulbOutlined style={{ fontSize: '36px', color: 'var(--primary-color)', marginBottom: '12px' }} />
          <Title level={2} style={{ margin: 0, fontFamily: 'var(--font-display)' }}>Reset Password</Title>
          <Text type="secondary">Enter the reset code sent to your email</Text>
        </div>

        <Form
          form={form}
          name="reset_password_form"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'The input is not valid E-mail!' }
            ]}
          >
            <Input prefix={<MailOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="Email Address" />
          </Form.Item>

          <Form.Item
            name="token"
            rules={[{ required: true, message: 'Please input the reset token!' }]}
          >
            <Input prefix={<NumberOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="Reset Code (e.g. 123456)" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
              placeholder="New Password"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
              placeholder="Confirm New Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '45px' }}>
              Reset Password
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
