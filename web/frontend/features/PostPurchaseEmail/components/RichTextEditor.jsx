import React from 'react';
import { Box, Text, InlineError } from '@shopify/polaris';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';

/**
 * Rich Text Editor Component
 * A reusable component for rich text editing
 */
export function RichTextEditor({
  label,
  value,
  onChange,
  error,
  placeholder = 'Enter text...',
  disabled = false
}) {
  // Define modules with history module for undo/redo
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'align': ['', 'center', 'right'] }],
      ['clean']
    ],
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true
    }
  };

  const formats = [
    'bold', 'italic', 'underline',
    'align'
  ];

  return (
    <div className="rich-text-editor">
      {label && (
        <Box paddingBlockEnd="200">
          <Text as="p" fontWeight="semibold">{label}</Text>
        </Box>
      )}
      
      <div className={`quill-container ${disabled ? 'disabled' : ''} ${error ? 'error' : ''}`}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          readOnly={disabled}
        />
      </div>
      
      {error && (
        <Box paddingBlockStart="200">
          <InlineError message={error} />
        </Box>
      )}
    </div>
  );
}