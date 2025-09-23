import React from 'react';
import { Card, Text, Box, ButtonGroup, Button, Icon } from '@shopify/polaris';
import { MobileIcon, DesktopIcon, MaximizeIcon } from '@shopify/polaris-icons';
import './EmailPreview.css';

/**
 * Email Preview Component
 * Displays a preview of the email with responsive mobile/desktop views
 */
export default function EmailPreview({ emailContent, emailSubject, viewMode, onViewModeChange }) {
  // Replace shortcodes with sample data
  const processContent = (content) => {
    if (!content) return '';
    
    return content
      .replace(/\{\{\s*customer_first_name\s*\}\}/g, 'John')
      .replace(/\{\{\s*customer_name\s*\}\}/g, 'John Doe')
      .replace(/\{\{\s*order_id\s*\}\}/g, '12345')
      .replace(/\{\{\s*order_name\s*\}\}/g, '#1001')
      .replace(/\{\{\s*shop_name\s*\}\}/g, 'Your Store')
      .replace(/\{\{\s*shop_email\s*\}\}/g, 'store@example.com')
      .replace(/\{\{\s*store_title\s*\}\}/g, 'Your Awesome Store')
      .replace(/\{\{\s*product_reviews_block\s*\}\}/g, `
        <div class="product-review-block">
          <div class="product-item">
            <img src="https://via.placeholder.com/60" alt="Product" />
            <div class="product-details">
              <p class="product-name">Premium T-Shirt</p>
              <p class="product-price">$29.99</p>
            </div>
          </div>
          <div class="product-item">
            <img src="https://via.placeholder.com/60" alt="Product" />
            <div class="product-details">
              <p class="product-name">Classic Jeans</p>
              <p class="product-price">$49.99</p>
            </div>
          </div>
        </div>
      `);
  };

  // Process additional shortcode formats (for non-standard formats)
  const processAdditionalShortcodes = (content) => {
    if (!content) return '';
    
    return content
      // Handle alternative shortcode formats like #{{ order_name }}
      .replace(/#\{\{\s*order_name\s*\}\}/g, '#1001')
      // Handle other non-standard formats
      .replace(/\#\{\{\s*([a-z_]+)\s*\}\}/g, (match, p1) => {
        switch(p1) {
          case 'order_id': return '12345';
          case 'customer_name': return 'John Doe';
          default: return match;
        }
      });
  };

  // Process email content and subject
  const processedContent = processContent(emailContent);
  
  // For subject, process shortcodes but preserve HTML formatting
  const processedSubject = processAdditionalShortcodes(processContent(emailSubject));

  return (
    <Card>
      <Box padding="100">
        <div className="preview-header">
          <Text variant="headingMd">Email Preview</Text>
          <ButtonGroup segmented>
            <Button 
              icon={<Icon source={MobileIcon} />}
              pressed={viewMode === 'mobile'}
              onClick={() => onViewModeChange('mobile')}
              accessibilityLabel="Mobile view"
            />
            <Button 
              icon={<Icon source={DesktopIcon} />}
              pressed={viewMode === 'desktop'}
              onClick={() => onViewModeChange('desktop')}
              accessibilityLabel="Desktop view"
            />
            <Button 
              icon={<Icon source={MaximizeIcon} />}
              pressed={viewMode === 'fullscreen'}
              onClick={() => onViewModeChange('fullscreen')}
              accessibilityLabel="Full screen view"
            />
          </ButtonGroup>
        </div>

        <Box paddingBlockStart="400">
          <div className={`email-preview-container ${viewMode === 'mobile' ? 'mobile-view' : 'desktop-view'}`}>
            <div className="email-preview-header">
              <div className="email-preview-subject">
                <Text variant="headingSm">Subject:</Text>
                <div 
                  className="formatted-subject"
                  dangerouslySetInnerHTML={{ __html: processedSubject }}
                />
              </div>
            </div>
            
            <div className="email-preview-body">
              <div 
                className="email-content"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>
          </div>
        </Box>
      </Box>
    </Card>
  );
}