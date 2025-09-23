import React, { useState, useCallback } from 'react';
import { 
  Card, 
  Tabs, 
  Box, 
  Text,
  BlockStack,
  Collapsible,
  Button,
  Icon,
  TextField,
  Divider,
  InlineStack,
  Tooltip
} from '@shopify/polaris';
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  ClipboardIcon
} from '@shopify/polaris-icons';
import { useToast } from '../../../components/helper/toast-helper';
import { RichTextEditor } from './RichTextEditor';
import './EmailEditor.css';

/**
 * Email Editor Component
 * Provides tabs for editing email content and viewing available shortcodes
 */
export default function EmailEditor({ 
  emailSubject, 
  setEmailSubject, 
  messageContent, 
  setMessageContent, 
  footerContent, 
  setFooterContent 
}) {
  // State for selected tab
  const [selectedTab, setSelectedTab] = useState(0);
  
  // State for section collapse
  const [openSections, setOpenSections] = useState({
    subject: true,
    message: true,
    footer: false
  });

  // State for shortcode target
  const [shortcodeTarget, setShortcodeTarget] = useState('message');
  
  // Access toast functionality
  const { showToast } = useToast();

  // Toggle section collapse
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle tab change
  const handleTabChange = (selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
  };

  // Shortcodes organized by category
  const shortcodeCategories = [
    {
      name: 'customer',
      shortcodes: [
        { code: '{{customer_name}}', description: 'Customer\'s full name' },
        { code: '{{customer_first_name}}', description: 'Customer\'s first name' },
        { code: '{{customer_last_name}}', description: 'Customer\'s last name' }
      ]
    },
    {
      name: 'order',
      shortcodes: [
        { code: '{{order_id}}', description: 'Order ID' },
        { code: '{{order_name}}', description: 'Order name/number' }
      ]
    },
    {
      name: 'dynamic',
      shortcodes: [
        { code: '{{survey_link}}', description: 'Survey link' }
      ]
    },
    {
      name: 'store',
      shortcodes: [
        { code: '{{store_name}}', description: 'Store name' },
        { code: '{{store_url}}', description: 'Store url' },
      ]
    }
  ];

  // Insert shortcode into editor based on target
  const insertShortcode = (shortcode) => {
    switch(shortcodeTarget) {
      case 'subject':
        setEmailSubject(prev => prev + ' ' + shortcode + ' ');
        break;
      case 'message':
        setMessageContent(prev => prev + ' ' + shortcode + ' ');
        break;
      case 'footer':
        setFooterContent(prev => prev + ' ' + shortcode + ' ');
        break;
      default:
        setMessageContent(prev => prev + ' ' + shortcode + ' ');
    }
  };

  // Copy shortcode to clipboard
  const copyToClipboard = (shortcode) => {
    navigator.clipboard.writeText(shortcode)
      .then(() => {
        console.log('Copied to clipboard:', shortcode);
        // Use the toast helper to show the notification
        showToast({
          message: "Copied to clipboard",
          duration: 2000,
          type: "success"
        });
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        showToast({
          message: "Failed to copy to clipboard",
          duration: 2000,
          type: "error"
        });
      });
  };

  // Tabs definition
  const tabs = [
    {
      id: 'editor',
      content: 'Editor',
      accessibilityLabel: 'Email editor',
      panelID: 'email-editor-panel',
    },
    {
      id: 'shortcodes',
      content: 'Shortcodes',
      accessibilityLabel: 'Available shortcodes',
      panelID: 'shortcodes-panel',
    }
  ];

  return (
    <div className="email-editor-wrapper">
      <div className="tabs-container">
        <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange} />
      </div>
      
      <div className="tab-content-container">
        {selectedTab === 0 && (
          <div className="editor-tab-content">
            <BlockStack>
              {/* Subject Section */}
              <div className="email-section">
                <div className="section-header" onClick={() => toggleSection('subject')}>
                  <Text variant="headingMd">Subject</Text>
                  <Button plain icon={openSections.subject ? <Icon source={ChevronUpIcon} /> : <Icon source={ChevronDownIcon} />} />
                </div>
                <Collapsible open={openSections.subject} id="subject-section">
                  <div className="section-content">
                  <RichTextEditor
                      label="Email Subject"
                      value={emailSubject}
                      onChange={setEmailSubject}
                      placeholder="Enter email subject..."
                    />
                  </div>
                </Collapsible>
              </div>

              {/* Message Section */}
              <div className="email-section">
                <div 
                  className="section-header"
                  onClick={() => toggleSection('message')}
                >
                  <Text variant="headingMd">Message</Text>
                  <Button plain icon={openSections.message ? <Icon source={ChevronUpIcon} /> : <Icon source={ChevronDownIcon} />} />
                </div>
                <Collapsible open={openSections.message} id="message-section">
                  <div className="section-content">
                    <RichTextEditor
                      label="Email Message"
                      value={messageContent}
                      onChange={setMessageContent}
                      placeholder="Enter email message..."
                    />
                  </div>
                </Collapsible>
              </div>

              {/* Footer Section */}
              <div className="email-section">
                <div 
                  className="section-header"
                  onClick={() => toggleSection('footer')}
                >
                  <Text variant="headingMd">Footer</Text>
                  <Button plain icon={openSections.footer ? <Icon source={ChevronUpIcon} /> : <Icon source={ChevronDownIcon} />} />
                </div>
                <Collapsible open={openSections.footer} id="footer-section">
                  <div className="section-content">
                    <RichTextEditor
                      label="Email Footer"
                      value={footerContent}
                      onChange={setFooterContent}
                      placeholder="Enter email footer..."
                    />
                  </div>
                </Collapsible>
              </div>
            </BlockStack>
          </div>
        )}

        {selectedTab === 1 && (
          <div className="shortcodes-container">
            <Text variant="headingLg">Available Shortcodes</Text>
            
            <div className="shortcodes-categories">
              {shortcodeCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="shortcode-category">
                  <Text variant="headingMd" as="h3" className="category-name">{category.name}</Text>
                  <Divider />
                  <div className="shortcode-items">
                    {category.shortcodes.map((shortcode, index) => (
                      <div key={index} className="shortcode-item-row">
                        <div className="shortcode-code" onClick={() => insertShortcode(shortcode.code)}>
                          {shortcode.code}
                        </div>
                        <Tooltip content="Copy to clipboard">
                          <Button 
                            plain 
                            icon={<Icon source={ClipboardIcon} />}
                            onClick={() => copyToClipboard(shortcode.code)}
                            accessibilityLabel="Copy shortcode"
                            className="copy-button"
                          />
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}