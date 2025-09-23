import React, { useState, useEffect } from 'react';
import {
    Page,
    Card,
    Text,
    Button,
    BlockStack,
    InlineStack,
    TextField,
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

function Retainful() {
    const [apiKey, setApiKey] = useState('');
    const [appId, setAppId] = useState('');
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
                    // Find the retainful integration
                    const retainfulIntegration = response.data.data.find(integration => 
                        integration.type === 'retainful'
                    );
                    
                    // If we found it, check its status
                    if (retainfulIntegration) {
                        // Convert to lowercase for consistency
                        const status = retainfulIntegration.status.toLowerCase() === 'connected' ? 'connected' : 'disconnected';
                        setConnectionStatus(status);
                        setConnectionData(retainfulIntegration);
                        
                        // Pre-fill API key and App ID fields if available
                        if (retainfulIntegration.config) {
                            if (retainfulIntegration.config.apiKey) {
                                setApiKey(retainfulIntegration.config.apiKey);
                            }
                            if (retainfulIntegration.config.appId) {
                                setAppId(retainfulIntegration.config.appId);
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
                    // If it's an array, find the retainful integration
                    const retainfulIntegration = integrationData.find(integration => 
                        integration.type === 'retainful'
                    );
                    
                    if (retainfulIntegration) {
                        const status = retainfulIntegration.status.toLowerCase() === 'connected' ? 'connected' : 'disconnected';
                        setConnectionStatus(status);
                        setConnectionData(retainfulIntegration);
                    }
                } else if (integrationData.type === 'retainful') {
                    // If it's a single object and it's retainful
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

    const handleApiKeyChange = (value) => {
        setApiKey(value);
    };

    const handleAppIdChange = (value) => {
        setAppId(value);
    };

    const handleConnect = () => {
        // Call the API to connect with Retainful
        saveIntegrationMutation({ 
            type: 'retainful',
            apiKey: apiKey,
            appId: appId
        });
    };

    return (
        <Page
            title={
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Retainful
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
                                        • Retainful is a powerful tool for recovering abandoned carts and retaining customers.
                                    </Text>
                                    <Text as="p" variant="bodyMd">
                                        • This integration allows you to send new survey responses to Retainful, enabling targeted follow-ups based on customer feedback, improving retention and conversion rates.
                                    </Text>
                                </BlockStack>
                            </BlockStack>
                        </div>
                    </Card>

                    {/* Step 1: Connect to Retainful API Card */}
                    <Card>
                        <div style={{ padding: '24px' }}>
                            <BlockStack gap="400">
                                <Text as="h2" variant="headingMd">Connect to Retainful API</Text>

                                <Text as="p" variant="bodyMd">
                                    Follow the guide{' '}
                                    <Link url="https://www.retainful.com/docs/woocommerce/finding-the-api-credentials" external>
                                        {/* Here <ExternalIcon /> */}
                                    </Link>{' '}
                                    to get your API credentials. Then fill in the fields below and click Connect
                                </Text>

                                <BlockStack gap="300">
                                    <Text as="label" variant="bodyMd" fontWeight="medium">
                                        App ID
                                    </Text>
                                    <TextField
                                        value={appId}
                                        onChange={handleAppIdChange}
                                        placeholder="Enter your Retainful App ID"
                                        autoComplete="off"
                                    />
                                    
                                    <Text as="label" variant="bodyMd" fontWeight="medium">
                                        API Key
                                    </Text>
                                    <TextField
                                        value={apiKey}
                                        onChange={handleApiKeyChange}
                                        placeholder="Enter your Retainful API key"
                                        autoComplete="off"
                                    />
                                    
                                    <Box maxWidth='200px'>
                                        <Button
                                            variant="primary"
                                            onClick={handleConnect}
                                            disabled={!apiKey.trim() || !appId.trim() || isLoading}
                                            loading={isLoading}
                                            icon={ExternalIcon}
                                        >
                                            {isLoading ? 'Connecting...' : connectionStatus === 'connected' ? 'Reconnect' : 'Connect'}
                                        </Button>
                                    </Box>
                                </BlockStack>
                            </BlockStack>
                        </div>
                    </Card>
            
                </BlockStack>
                <Button
                    variant="primary"
                    icon={ExternalIcon}
                    url='https://www.retainful.com/'
                >
                    Go to Retainful
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

export default Retainful;
