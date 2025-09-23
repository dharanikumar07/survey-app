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

function GoogleAnalytics() {
    const [trackingId, setTrackingId] = useState('');
    const [measurementId, setMeasurementId] = useState('');
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
                    // Find the google_analytics integration
                    const gaIntegration = response.data.data.find(integration => 
                        integration.type === 'google_analytics'
                    );
                    
                    // If we found it, check its status
                    if (gaIntegration) {
                        // Convert to lowercase for consistency
                        const status = gaIntegration.status.toLowerCase() === 'connected' ? 'connected' : 'disconnected';
                        setConnectionStatus(status);
                        setConnectionData(gaIntegration);
                        
                        // Pre-fill fields if available
                        if (gaIntegration.config) {
                            if (gaIntegration.config.trackingId) {
                                setTrackingId(gaIntegration.config.trackingId);
                            }
                            if (gaIntegration.config.measurementId) {
                                setMeasurementId(gaIntegration.config.measurementId);
                            }
                        }
                    }
                }
            },
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
                    // If it's an array, find the google_analytics integration
                    const gaIntegration = integrationData.find(integration => 
                        integration.type === 'google_analytics'
                    );
                    
                    if (gaIntegration) {
                        const status = gaIntegration.status.toLowerCase() === 'connected' ? 'connected' : 'disconnected';
                        setConnectionStatus(status);
                        setConnectionData(gaIntegration);
                    }
                } else if (integrationData.type === 'google_analytics') {
                    // If it's a single object and it's google_analytics
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

    const handleTrackingIdChange = (value) => {
        setTrackingId(value);
    };

    const handleMeasurementIdChange = (value) => {
        setMeasurementId(value);
    };

    const handleConnect = () => {
        // Call the API to connect with Google Analytics
        saveIntegrationMutation({ 
            type: 'google_analytics',
            trackingId: trackingId,
            measurementId: measurementId
        });
    };

    return (
        <Page
            title={
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Google Analytics
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
            <InlineStack gap="400">
                <BlockStack gap="400">
                    <Card padding={"0"}>
                        <div style={{ padding: '24px' }}>
                            <BlockStack gap="400">
                                <Text as="h2" variant="headingMd">Introduction</Text>
                                <BlockStack gap="200">
                                    <Text as="p" variant="bodyMd">
                                        • Google Analytics is a web analytics service that tracks and reports website traffic.
                                    </Text>
                                    <Text as="p" variant="bodyMd">
                                        • This integration allows you to track survey responses and user interactions, providing valuable insights into customer behavior and feedback patterns.
                                    </Text>
                                </BlockStack>
                            </BlockStack>
                        </div>
                    </Card>

                    {/* Step 1: Connect to Google Analytics Card */}
                    <Card>
                        <div style={{ padding: '24px' }}>
                            <BlockStack gap="400">
                                <Text as="h2" variant="headingMd">Connect to Google Analytics</Text>

                                <Text as="p" variant="bodyMd">
                                    Follow the guide{' '}
                                    <Link url="https://support.google.com/analytics/answer/9304153" external>
                                        here
                                    </Link>{' '}
                                    to get your Google Analytics IDs. Then fill in the fields below and click Connect.
                                </Text>

                                <BlockStack gap="300">
                                    <Text as="label" variant="bodyMd" fontWeight="medium">
                                        Tracking ID (UA-XXXXXXXX-X or G-XXXXXXXXXX)
                                    </Text>
                                    <TextField
                                        value={trackingId}
                                        onChange={handleTrackingIdChange}
                                        placeholder="Enter your Google Analytics Tracking ID"
                                        autoComplete="off"
                                        helpText="For Universal Analytics use UA-XXXXXXXX-X format"
                                    />
                                    
                                    <Text as="label" variant="bodyMd" fontWeight="medium">
                                        Measurement ID (G-XXXXXXXXXX)
                                    </Text>
                                    <TextField
                                        value={measurementId}
                                        onChange={handleMeasurementIdChange}
                                        placeholder="Enter your Google Analytics 4 Measurement ID"
                                        autoComplete="off"
                                        helpText="For Google Analytics 4 use G-XXXXXXXXXX format"
                                    />
                                    
                                    <Box maxWidth='200px'>
                                        <Button
                                            variant="primary"
                                            onClick={handleConnect}
                                            disabled={!trackingId.trim() || isLoading}
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
                    url='https://analytics.google.com/'
                    external
                >
                    Go to Google Analytics
                </Button>
            </InlineStack>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <Text as="p" variant="bodyMd" color="subdued">
                    Created by Team Hesienberg with love
                </Text>
            </div>
        </Page>
    );
}

export default GoogleAnalytics;
