import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space, Breadcrumb, Drawer, theme } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  PlusOutlined,
  FolderOutlined,
  StarOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  BulbOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from '../components/ThemeSwitcher';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => { navigate('/dashboard'); setMobileVisible(false); },
    },
    {
      key: '/ideas/new',
      icon: <PlusOutlined />,
      label: 'Add Idea',
      onClick: () => { navigate('/ideas/new'); setMobileVisible(false); },
    },
    {
      key: '/ideas',
      icon: <FolderOutlined />,
      label: 'All Ideas',
      onClick: () => { navigate('/ideas'); setMobileVisible(false); },
    },
    {
      key: '/favorites',
      icon: <StarOutlined />,
      label: 'Favorites',
      onClick: () => { navigate('/favorites'); setMobileVisible(false); },
    },
    {
      key: '/calendar',
      icon: <CalendarOutlined />,
      label: 'Calendar View',
      onClick: () => { navigate('/calendar'); setMobileVisible(false); },
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => { navigate('/settings'); setMobileVisible(false); },
    },
  ];

  const profileMenu = {
    items: [
      {
        key: 'profile',
        label: 'My Profile',
        icon: <UserOutlined />,
        onClick: () => navigate('/settings?tab=profile'),
      },
      {
        key: 'password',
        label: 'Change Password',
        icon: <SettingOutlined />,
        onClick: () => navigate('/settings?tab=password'),
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: 'Logout',
        icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />,
        onClick: handleLogout,
      },
    ],
  };

  // Generate breadcrumbs dynamically based on path
  const getBreadcrumbs = () => {
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const name = pathSnippets[index];
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      return {
        key: url,
        title: displayName === 'Ideas' && index === pathSnippets.length - 1 ? 'All Ideas' : displayName,
      };
    });

    return [{ key: 'home', title: 'Home' }, ...extraBreadcrumbItems];
  };

  const sidebarLogo = (
    <div style={{
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: collapsed ? 'center' : 'flex-start',
      padding: '0 24px',
      gap: '12px',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }}>
      <BulbOutlined style={{ fontSize: '24px', color: '#818cf8' }} />
      {!collapsed && (
        <span style={{
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '18px',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em',
          background: 'linear-gradient(to right, #818cf8, #c084fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          IdeaVault
        </span>
      )}
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sider */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        className="desktop-sider"
        style={{
          display: 'none',
          boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
          zIndex: 10,
        }}
      >
        {sidebarLogo}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ paddingTop: '16px' }}
        />
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        title="IdeaVault"
        placement="left"
        onClose={() => setMobileVisible(false)}
        open={mobileVisible}
        bodyStyle={{ padding: 0, background: '#0f172a' }}
        headerStyle={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        titleStyle={{ color: '#fff' }}
        width={250}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ paddingTop: '16px' }}
        />
      </Drawer>

      <Layout>
        <Header style={{
          background: 'var(--bg-card)',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          zIndex: 9,
          position: 'sticky',
          top: 0
        }}>
          <Space size="middle">
            {/* Toggle collapse for Sider */}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                setCollapsed(!collapsed);
                setMobileVisible(true); // Toggle drawer if screen is mobile size
              }}
              style={{ fontSize: '16px' }}
            />
            <Breadcrumb items={getBreadcrumbs()} />
          </Space>

          <Space size="large">
            <a
              href="https://github.com/MALLIKARJUN123-pi/IdeaVault-Frontend"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-muted)',
                fontSize: '20px',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              title="View on GitHub"
            >
              <GithubOutlined />
            </a>
            <ThemeSwitcher />
            
            <Dropdown menu={profileMenu} trigger={['click']} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#4f46e5', verticalAlign: 'middle' }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <div style={{ display: 'none', flexDirection: 'column', lineHeight: '1.2' }} className="user-profile-info">
                  <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{user?.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user?.role}</span>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{
          margin: '24px',
          minHeight: 280,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <Outlet />
        </Content>
      </Layout>

      {/* Styled Responsive CSS injected directly to manage responsive layout triggers */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-sider {
            display: block !important;
          }
          .user-profile-info {
            display: flex !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default DashboardLayout;
