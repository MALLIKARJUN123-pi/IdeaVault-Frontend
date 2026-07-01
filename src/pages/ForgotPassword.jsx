import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { MailOutlined, BulbOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setEmail(values.email);
    try {
      await forgotPassword(values.email);
      setSubmitted(true);
      message.success('Password recovery requested!');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Error occurred. Please verify your email.';
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
          <Title level={2} style={{ margin: 0, fontFamily: 'var(--font-display)' }}>Recover Password</Title>
          <Text type="secondary">Receive instructions to reset your account password</Text>
        </div>

        {!submitted ? (
          <Form
            name="forgot_password_form"
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

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '45px' }}>
                Send Reset Code
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Alert
              message="Code Generated"
              description={
                <div>
                  Instructions were sent to <strong>{email}</strong>.<br />
                  <span style={{ fontSize: '13px', marginTop: '6px', display: 'block' }}>
                    💡 <strong>Demo Helper:</strong> Use the mock reset token <strong>123456</strong> in the reset page.
                  </span>
                </div>
              }
              type="success"
              showIcon
            />
            <Button type="primary" block style={{ height: '45px' }} onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}>
              Go to Reset Password
            </Button>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
