import React, { useState, useRef } from 'react';
import { Button, Space, Tabs, Card } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  LinkOutlined,
  UnorderedListOutlined,
  CodeOutlined,
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const RichTextEditor = ({ value, onChange, placeholder = 'Write your idea details here (Markdown supported)...' }) => {
  const [activeTab, setActiveTab] = useState('write');
  const textareaRef = useRef(null);

  const insertMarkdown = (syntax, offset = 0) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    
    let replacement = '';
    if (syntax === 'bold') replacement = `**${selected || 'bold text'}**`;
    else if (syntax === 'italic') replacement = `*${selected || 'italic text'}*`;
    else if (syntax === 'link') replacement = `[${selected || 'link text'}](url)`;
    else if (syntax === 'code') replacement = `\`\`\`\n${selected || 'code block'}\n\`\`\``;
    else if (syntax === 'list') replacement = `\n- ${selected || 'list item'}`;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length - offset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ background: 'var(--border-color)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button size="small" type="text" icon={<BoldOutlined />} onClick={() => insertMarkdown('bold', 2)} title="Bold" />
          <Button size="small" type="text" icon={<ItalicOutlined />} onClick={() => insertMarkdown('italic', 1)} title="Italic" />
          <Button size="small" type="text" icon={<LinkOutlined />} onClick={() => insertMarkdown('link', 5)} title="Link" />
          <Button size="small" type="text" icon={<CodeOutlined />} onClick={() => insertMarkdown('code', 4)} title="Code Block" />
          <Button size="small" type="text" icon={<UnorderedListOutlined />} onClick={() => insertMarkdown('list', 0)} title="Bullet List" />
        </Space>
        
        <Space compact>
          <Button
            size="small"
            type={activeTab === 'write' ? 'primary' : 'default'}
            icon={<EditOutlined />}
            onClick={() => setActiveTab('write')}
          >
            Write
          </Button>
          <Button
            size="small"
            type={activeTab === 'preview' ? 'primary' : 'default'}
            icon={<EyeOutlined />}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </Button>
        </Space>
      </div>

      {activeTab === 'write' ? (
        <div style={{ padding: '12px', background: 'var(--bg-card)' }}>
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={10}
          />
        </div>
      ) : (
        <Card
          bordered={false}
          style={{
            minHeight: '264px',
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '12px',
            background: 'var(--bg-card)',
          }}
          bodyStyle={{ padding: 0 }}
        >
          {value ? (
            <div className="markdown-preview" style={{ color: 'var(--text-main)', lineHeight: '1.6' }}>
              <ReactMarkdown>{value}</ReactMarkdown>
            </div>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Nothing to preview...</span>
          )}
        </Card>
      )}
    </div>
  );
};

export default RichTextEditor;
