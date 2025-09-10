import React, { useState } from 'react';
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
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { getIntegrations, saveIntegration } = useIntegrationApi();

    const { data } = useQueryEvents(
        useQuery({
            queryKey: ['integrations'],
            queryFn: getIntegrations
        }),
        {
            onSuccess: (data) => {
                console.log(data);
            }
        },
        {
            onError: (error) => {
                showToast({ message: error?.data?.error || "Failed to get integrations", type: "error" });
            }
        }
    )

    const { data: saveIntegrationData } = useMutation({
        mutationFn: saveIntegration,
        onSuccess: (data) => {
            showToast({ message: data?.data?.message || "Integration saved successfully", type: "success" });
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
        // Handle API connection logic here
        console.log('Connecting with API key:', apiKey);
    };

    return (
        <Page
            title={
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Klaviyo
                    <Badge tone={apiKey ? 'success' : 'attention'}>
                        {apiKey ? 'Connected' : 'Not connected'}
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
                                <Text as="h2" variant="headingMd">Step 1: Connect to Klaviyo API</Text>

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
                                            disabled={!apiKey.trim()}
                                            icon={ExternalIcon}
                                        >
                                            Connect
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

                    {/* Step 2: Sync survey Card */}
                    <Card>
                        <div style={{ padding: '24px' }}>
                            <BlockStack gap="400">
                                <Text as="h2" variant="headingMd">Step 2: Sync survey</Text>

                                <Text as="p" variant="bodyMd">
                                    Select survey that you want to sync
                                </Text>

                                <BlockStack gap="300">
                                    <Select
                                        label="Survey"
                                        options={surveyOptions}
                                        value={selectedSurvey}
                                        onChange={handleSurveyChange}
                                        disabled={true}
                                    />
                                </BlockStack>
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