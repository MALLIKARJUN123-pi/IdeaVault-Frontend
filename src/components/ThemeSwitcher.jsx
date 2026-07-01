import React from 'react';
import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}>
      <Button
        type="text"
        shape="circle"
        icon={isDarkMode ? <SunOutlined style={{ color: '#fadb14', fontSize: '18px' }} /> : <MoonOutlined style={{ color: '#4f46e5', fontSize: '18px' }} />}
        onClick={toggleTheme}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      />
    </Tooltip>
  );
};

export default ThemeSwitcher;
