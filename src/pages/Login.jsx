import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, message, Alert } from 'antd';
import { MailOutlined, LockOutlined, BulbOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setSessionExpired(true);
    }
  }, [searchParams]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Login failed! Please check your credentials.';
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
          <Title level={2} style={{ margin: 0, fontFamily: 'var(--font-display)' }}>Welcome Back</Title>
          <Text type="secondary">Securely access and organize your ideas</Text>
        </div>

        {sessionExpired && (
          <Alert
            message="Session Expired"
            description="Your session has expired. Please login again."
            type="warning"
            showIcon
            closable
            style={{ marginBottom: '18px' }}
          />
        )}

        <Form
          name="login_form"
          initialValues={{ remember: true }}
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
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" style={{ color: 'var(--primary-color)', fontSize: '14px' }}>
                Forgot Password?
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '45px' }}>
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <Text type="secondary">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
              Sign Up
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;
