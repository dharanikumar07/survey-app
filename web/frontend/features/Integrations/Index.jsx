import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Card, Layout, Text, Button, BlockStack, InlineStack, Icon, Badge, Spinner } from "@shopify/polaris";
import { LinkIcon } from '@shopify/polaris-icons';
import klaviyoIcon from '../../assets/images/klaviyo.png';
import retainfulIcon from '../../assets/images/retainful.png';
import googleAnalyticsIcon from '../../assets/images/google-analytics.png';
import { useIntegrationApi } from './action/use-integration-api';
import { useQuery } from '@tanstack/react-query';
import { useQueryEvents } from '../../components/helper/use-query-event';

function Integrations() {
    const [klaviyoStatus, setKlaviyoStatus] = useState('disconnected');
    const [retainfulStatus, setRetainfulStatus] = useState('disconnected');
    const [googleAnalyticsStatus, setGoogleAnalyticsStatus] = useState('disconnected');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { getIntegrations } = useIntegrationApi();
    
    // Fetch integration status
    const { data: integrationData } = useQueryEvents(
        useQuery({
            queryKey: ['integrations'],
            queryFn: getIntegrations
        }),
        {
            onSuccess: (response) => {
                console.log('Integration data in index:', response);
                // Check if we have an array of integrations
                if (response?.data?.data && Array.isArray(response.data.data)) {
                    // Find the klaviyo integration
                    const klaviyoIntegration = response.data.data.find(integration => 
                        integration.type === 'klaviyo'
                    );
                    
                    // If we found it, check its status
                    if (klaviyoIntegration) {
                        const status = klaviyoIntegration.status.toLowerCase() === 'connected' ? 'connected' : 'disconnected';
                        setKlaviyoStatus(status);
                    }
                    
                    // Find the retainful integration
                    const retainfulIntegration = response.data.data.find(integration => 
                        integration.type === 'retainful'
                    );
                    
                    // If we found it, check its status
                    if (retainfulIntegration) {
                        const status = retainfulIntegration.status.toLowerCase() === 'connected' ? 'connected' : 'disconnected';
                        setRetainfulStatus(status);
                    }
                    
                    // Find the Google Analytics integration
                    const googleAnalyticsIntegration = response.data.data.find(integration => 
                        integration.type === 'google_analytics'
                    );
                    
                    // If we found it, check its status
                    if (googleAnalyticsIntegration) {
                        const status = googleAnalyticsIntegration.status.toLowerCase() === 'connected' ? 'connected' : 'disconnected';
                        setGoogleAnalyticsStatus(status);
                    }
                }
                
                // Set loading to false after data processing is complete
                setIsLoading(false);
            },
            onError: () => {
                // Set loading to false on error as well
                setIsLoading(false);
            }
        }
    );

    return (
        <Page title="Integrations">
            {isLoading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '70vh',
                    width: '100%',
                    flexDirection: 'column'
                }}>
                    <Spinner size="large" />
                    <Text as="p" variant="bodyMd" fontWeight="medium" style={{ marginTop: '1.5rem' }}>
                        Loading integrations...
                    </Text>
                </div>
            ) : (
                <Layout>

                {/* Klaviyo Integration Card */}
                <Layout.Section oneThird>
                    <Card>
                        <BlockStack gap="400">
                            <InlineStack align="space-between">
                                <InlineStack gap="300">
                                    <div className="th-sf-icon-container">
                                        <img
                                            src={klaviyoIcon}
                                            alt="Klaviyo icon"
                                            width="32"
                                            height="32"
                                        />
                                    </div>
                                    <Text as="h2" variant="headingMd">Klaviyo</Text>
                                </InlineStack>
                                <Badge tone={klaviyoStatus === 'connected' ? 'success' : 'attention'}>
                                    {klaviyoStatus === 'connected' ? 'Connected' : 'Not connected'}
                                </Badge>
                            </InlineStack>

                            <Text as="p" variant="bodyMd">
                                Klaviyo is a powerful email marketing and segmentation platform.
                                SEA Survey sends new responses to Klaviyo to trigger automations.
                            </Text>

                            <div>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/integrations/klaviyo')}
                                >
                                    {klaviyoStatus === 'connected' ? 'Manage' : 'Connect'}
                                </Button>
                            </div>
                        </BlockStack>
                    </Card>
                </Layout.Section>

                {/* Retainful Integration Card */}
                <Layout.Section oneThird>
                    <Card>
                        <BlockStack gap="400">
                            <InlineStack align="space-between">
                                <InlineStack gap="300">
                                    <div className="th-sf-icon-container">
                                        <img
                                            src={retainfulIcon}
                                            alt="Retainful icon"
                                            width="32"
                                            height="32"
                                        />
                                    </div>
                                    <Text as="h2" variant="headingMd">Retainful</Text>
                                </InlineStack>
                                <Badge tone={retainfulStatus === 'connected' ? 'success' : 'attention'}>
                                    {retainfulStatus === 'connected' ? 'Connected' : 'Not connected'}
                                </Badge>
                            </InlineStack>

                            <Text as="p" variant="bodyMd">
                                Retainful helps recover abandoned carts and retain customers with personalized emails.
                                SEA Survey sends responses to Retainful to enhance customer engagement.
                            </Text>

                            <div>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/integrations/retainful')}
                                >
                                    {retainfulStatus === 'connected' ? 'Manage' : 'Connect'}
                                </Button>
                            </div>
                        </BlockStack>
                    </Card>
                </Layout.Section>
                
                {/* Google Analytics Integration Card */}
                <Layout.Section oneThird>
                    <Card>
                        <BlockStack gap="400">
                            <InlineStack align="space-between">
                                <InlineStack gap="300">
                                    <div className="th-sf-icon-container">
                                        <img
                                            src={googleAnalyticsIcon}
                                            alt="Google Analytics icon"
                                            width="32"
                                            height="32"
                                        />
                                    </div>
                                    <Text as="h2" variant="headingMd">Google Analytics</Text>
                                </InlineStack>
                                <Badge tone={googleAnalyticsStatus === 'connected' ? 'success' : 'attention'}>
                                    {googleAnalyticsStatus === 'connected' ? 'Connected' : 'Not connected'}
                                </Badge>
                            </InlineStack>

                            <Text as="p" variant="bodyMd">
                                Google Analytics tracks and reports website traffic and user behavior.
                                SEA Survey sends response data to Google Analytics for comprehensive insights.
                            </Text>

                            <div>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/integrations/google-analytics')}
                                >
                                    {googleAnalyticsStatus === 'connected' ? 'Manage' : 'Connect'}
                                </Button>
                            </div>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
            )}
        </Page>
    );
}

export default Integrations;