import React, { useState, useEffect } from 'react';
import {
    Page,
    Card,
    Text,
    Button,
    BlockStack,
    InlineStack,
    TextField,
    Select,
    Badge,
    Link,
    Box
} from "@shopify/polaris";
import { ArrowLeftIcon, ExternalIcon } from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';
import { useIntegrationApi } from '../action/use-integration-api';
import { useQueryEvents } from '../../../components/helper/use-query-event';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '../../../components/helper/toast-helper';

function Klaviyo() {
    const [apiKey, setApiKey] = useState('');
    const [selectedSurvey, setSelectedSurvey] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [connectionData, setConnectionData] = useState(null);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { getIntegrations, saveIntegration } = useIntegrationApi();

    // Query to fetch integration status when component loads
    const { data: integrationData, isLoading: isLoadingIntegration } = useQueryEvents(
        useQuery({
            queryKey: ['integrations'],
            queryFn: getIntegrations
        }),
        {
            onSuccess: (response) => {
                console.log('Integration data:', response);
                
                // Check if we have an array of integrations
                if (response?.data?.data && Array.isArray(response.data.data)) {
                    // Find the klaviyo integration
                    const klaviyoIntegration = response.data.data.find(integration => 
                        integration.type === 'klaviyo'
                    );
                    
                    // If we found it, check its status
                    if (klaviyoIntegration) {
                        // Convert to lowercase for consistency
                        const status = klaviyoIntegration.status.toLowerCase() === 'connected' ? 'connected' : 'disconnected';
                        setConnectionStatus(status);
                        setConnectionData(klaviyoIntegration);
                        
                        // Pre-fill API key field if available
                        if (klaviyoIntegration.config) {
                            // Handle both array and object format for config
                            if (Array.isArray(klaviyoIntegration.config) && klaviyoIntegration.config.length > 0) {
                                setApiKey(klaviyoIntegration.config[0].apiKey || '');
                            } else if (klaviyoIntegration.config.apiKey) {
                                setApiKey(klaviyoIntegration.config.apiKey);
                            }
                        }
                    }
                }
            }
        },
        {
            onError: (error) => {
                showToast({ message: error?.data?.error || "Failed to get integrations", type: "error" });
            }
        }
    )

    const { mutate: saveIntegrationMutation, isLoading } = useMutation({
        mutationFn: saveIntegration,
        onSuccess: (response) => {
            showToast({ message: response?.data?.message || "Integration saved successfully", type: "success" });
            
            // Update connection status based on response
            if (response?.data?.data) {
                const integrationData = response.data.data;
                
                // Check if we received a single integration object or an array
                if (Array.isArray(integrationData)) {
                    // If it's an array, find the klaviyo integration
                    const klaviyoIntegration = integrationData.find(integration => 
                        integration.type === 'klaviyo'
                    );
                    
                    if (klaviyoIntegration) {
                        const status = klaviyoIntegration.status.toLowerCase() === 'connected' ? 'connected' : 'disconnected';
                        setConnectionStatus(status);
                        setConnectionData(klaviyoIntegration);
                        
                        // Update API key field
                        if (klaviyoIntegration.config) {
                            if (Array.isArray(klaviyoIntegration.config) && klaviyoIntegration.config.length > 0) {
                                setApiKey(klaviyoIntegration.config[0].apiKey || '');
                            } else if (klaviyoIntegration.config.apiKey) {
                                setApiKey(klaviyoIntegration.config.apiKey);
                            }
                        }
                    }
                } else if (integrationData.type === 'klaviyo') {
                    // If it's a single object and it's klaviyo
                    const status = integrationData.status.toLowerCase() === 'connected' ? 'connected' : 'disconnected';
                    setConnectionStatus(status);
                    setConnectionData(integrationData);
                }
            }
        },
        onError: (error) => {
            showToast({ message: error?.data?.error || "Failed to save integration", type: "error" });
        }
    })

    const surveyOptions = [
        { label: 'Loading...', value: 'loading' }
    ];

    const handleApiKeyChange = (value) => {
        setApiKey(value);
    };

    const handleSurveyChange = (value) => {
        setSelectedSurvey(value);
    };

    const handleConnect = () => {
        // Call the API to connect with Klaviyo
        saveIntegrationMutation({ 
            type: 'klaviyo',
            apiKey: apiKey
        });
    };

    return (
        <Page
            title={
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Klaviyo
                    <Badge tone={connectionStatus === 'connected' ? 'success' : 'attention'}>
                        {connectionStatus === 'connected' ? 'Connected' : 'Not connected'}
                    </Badge>
                </span>
            }
            backAction={{
                content: 'Back to integrations',
                onAction: () => navigate('/integrations')
            }}
        >
            <InlineStack gap="400" >

                <BlockStack gap="400">

                    <Card padding={"0"} >
                        <div style={{ padding: '24px' }}>
                            <BlockStack gap="400">
                                <Text as="h2" variant="headingMd">Introduction</Text>
                                <BlockStack gap="200">
                                    <Text as="p" variant="bodyMd">
                                        • Klaviyo is a leading platform for email marketing, segmentation, and reporting.
                                    </Text>
                                    <Text as="p" variant="bodyMd">
                                        • This integration allows you to send new survey responses to Klaviyo, enabling you to trigger targeted workflows and automations. This helps drive smarter marketing decisions based on real-time feedback.
                                    </Text>
                                </BlockStack>
                            </BlockStack>
                        </div>
                    </Card>

                    {/* Step 1: Connect to Klaviyo API Card */}
                    <Card>
                        <div style={{ padding: '24px' }}>
                            <BlockStack gap="400">
                                <Text as="h2" variant="headingMd"> Connect to Klaviyo API</Text>

                                <Text as="p" variant="bodyMd">
                                    Follow the guide{' '}
                                    <Link url="https://help.klaviyo.com/hc/en-us/articles/115005062267-How-to-Manage-Your-API-Keys" external >
                                        {/* Here <ExternalIcon /> */}
                                    </Link>{' '}
                                    to get API key. Then fill in the field below and click Connect
                                </Text>

                                <BlockStack gap="300">
                                    <Text as="label" variant="bodyMd" fontWeight="medium">
                                        API Key
                                    </Text>
                                    <TextField
                                        value={apiKey}
                                        onChange={handleApiKeyChange}
                                        placeholder="Enter your Klaviyo API key"
                                        autoComplete="off"
                                    />
                                    <Box maxWidth='200px'>
                                        <Button
                                            variant="primary"
                                            onClick={handleConnect}
                                            disabled={!apiKey.trim() || isLoading}
                                            loading={isLoading}
                                            icon={ExternalIcon}
                                        >
                                            {isLoading ? 'Connecting...' : connectionStatus === 'connected' ? 'Reconnect' : 'Connect'}
                                        </Button>
                                    </Box>
                                </BlockStack>

                                {/* <Text as="p" variant="bodyMd" color="subdued">
                                    Having trouble syncing with Klaviyo?{' '}
                                    <Link url="#" onClick={() => console.log('Let us sync clicked')}>
                                        Let us sync
                                    </Link>
                                </Text> */}
                            </BlockStack>
                        </div>
                    </Card>
            
                </BlockStack>
                <Button
                    variant="primary"
                    icon={ExternalIcon}
                    url='https://apps.shopify.com/klaviyo-email-marketing'
                >
                    Go to Klaviyo
                </Button>
            </InlineStack>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <Text as="p" variant="bodyMd" color="subdued">
                    Created by Team Hesienberg with love
                </Text>
            </div>
        </Page >
    );
}

export default Klaviyo;