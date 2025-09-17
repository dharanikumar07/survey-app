import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Card, Layout, Text, Button, BlockStack, InlineStack, Icon, Badge } from "@shopify/polaris";
import { LinkIcon } from '@shopify/polaris-icons';
import klaviyoIcon from '../../assets/images/klaviyo.png';
import { useIntegrationApi } from './action/use-integration-api';
import { useQuery } from '@tanstack/react-query';
import { useQueryEvents } from '../../components/helper/use-query-event';

function Integrations() {
    const [klaviyoStatus, setKlaviyoStatus] = useState('disconnected');
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
                }
            }
        }
    );

    return (
        <Page title="Integrations">
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

            </Layout>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <Text as="p" variant="bodyMd" color="subdued">
                    Created by Team Hesienberg with love
                </Text>
            </div>
        </Page>
    );
}

export default Integrations;