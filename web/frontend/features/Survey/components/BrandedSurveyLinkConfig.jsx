import React, { useState, useEffect } from 'react';
import {
    Box,
    BlockStack,
    Text,
    TextField,
    Button,
    InlineStack
} from '@shopify/polaris';
import { ClipboardIcon } from '@shopify/polaris-icons';
import { useSurveyState } from '../hooks/useSurveyState';

export function BrandedSurveyLinkConfig({ item }) {
    const { surveyId, brandedSurveyUrl: storeBrandedSurveyUrl, setBrandedSurveyUrl } = useSurveyState();
    const [isCopied, setIsCopied] = useState(false);

    // Get branded survey URL from either the store or item props
    let brandedSurveyUrl = storeBrandedSurveyUrl;

    // If there's no URL in the store but there is one in the item props, update the store
    if (!brandedSurveyUrl && item && item.config && item.config.branded_survey) {
        brandedSurveyUrl = item.config.branded_survey;
        setBrandedSurveyUrl(brandedSurveyUrl);
    }
    
    // If we still don't have a URL, construct a default one based on survey ID
    if (!brandedSurveyUrl && surveyId) {
        brandedSurveyUrl = `dharani-store07.myshopify.com/?45673=${surveyId}&6789=29b0d0e8-df44-44be-8737-d5d961e54252&is_branded=1`;
        setBrandedSurveyUrl(brandedSurveyUrl);
    }
    
    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);
    
    const handleCopyToClipboard = () => {
        // Create a fallback method using a hidden textarea element
        try {
            // Try the modern clipboard API first
            navigator.clipboard.writeText(brandedSurveyUrl)
                .then(() => {
                    setIsCopied(true);
                })
                .catch(err => {
                    console.log('Falling back to alternate clipboard method');
                    // Create a temporary textarea element
                    const textArea = document.createElement('textarea');
                    textArea.value = brandedSurveyUrl;
                    
                    // Make it non-visible
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    
                    // Select and copy
                    textArea.focus();
                    textArea.select();
                    
                    let success = false;
                    try {
                        success = document.execCommand('copy');
                        if (success) {
                            setIsCopied(true);
                        } else {
                            console.error('Failed to copy with execCommand');
                        }
                    } catch (e) {
                        console.error('Error during execCommand copy', e);
                    }
                    
                    // Cleanup
                    document.body.removeChild(textArea);
                });
        } catch (err) {
            console.error('Clipboard error:', err);
        }
    };
    
    return (
        <BlockStack gap="400">
            <Text variant="bodyMd">
                Your survey is available at a branded, standalone page. Share this link directly with your customers.
            </Text>
            
            <Box paddingBlockStart="200">
                <Text as="p" fontWeight="medium">Survey URL (click to copy)</Text>
                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flex: 1 }} onClick={handleCopyToClipboard}>
                            <TextField
                                value={brandedSurveyUrl}
                                readOnly
                                autoComplete="off"
                                label=""
                                labelHidden
                                onFocus={(e) => e.target.select()}
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                        <Button 
                            icon={ClipboardIcon}
                            onClick={handleCopyToClipboard}
                            accessibilityLabel="Copy to clipboard"
                        />
                    </div>
                    
                    {/* Absolute positioned "Copied" notification */}
                    {isCopied && (
                        <div style={{ 
                            position: 'absolute',
                            right: '0px',
                            bottom: '-40px',
                            backgroundColor: '#121212', 
                            color: 'white', 
                            padding: '6px 16px', 
                            borderRadius: '4px',
                            fontSize: '14px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                            zIndex: 10,
                            fontWeight: '500'
                        }}>
                            Copied
                        </div>
                    )}
                </div>
                <Text as="p" variant="bodySm" color="text-subdued">This is your survey's public URL</Text>
            </Box>
        </BlockStack>
    );
}
