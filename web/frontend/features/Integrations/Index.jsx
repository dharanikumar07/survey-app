import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Card, Layout, Text, Button, BlockStack, InlineStack, Icon, Badge } from "@shopify/polaris";
import { LinkIcon } from '@shopify/polaris-icons';
import klaviyoIcon from '../../assets/images/klaviyo.png';

function Integrations() {
    const navigate = useNavigate();

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
                                <Badge tone='success'>Connected</Badge>
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
                                    Try now
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