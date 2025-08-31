import React from 'react';
import {
    Page,
    Card,
    BlockStack,
    Text,
    Button,
    Layout,
} from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";

export default function AISurveyCreation() {
    const handleBack = () => {
        // Navigate back to template selection
        window.history.back();
    };

    return (
        <Page
            title="AI Survey Creation"
            subtitle="Create your custom survey with AI assistance"
            backAction={{
                content: "Back to templates",
                onAction: handleBack,
                icon: ArrowLeftIcon
            }}
        >
            <Layout>
                <Layout.Section>
                    <Card padding="600">
                        <BlockStack gap="500" align="center">
                            <div className="th-sf-ai-hello-icon">
                                <Text variant="headingLg" as="h1">
                                    ✨ Hello World! ✨
                                </Text>
                            </div>

                            <div className="th-sf-ai-content">
                                <Text variant="headingMd" as="h2">
                                    Welcome to AI Survey Creation
                                </Text>

                                <Text variant="bodyMd" as="p" color="subdued">
                                    This is where the magic happens! Our AI will help you create
                                    the perfect survey based on your needs.
                                </Text>

                                <Text variant="bodyMd" as="p" color="subdued">
                                    More features coming soon...
                                </Text>
                            </div>

                            <div className="th-sf-ai-actions">
                                <Button variant="primary" size="large">
                                    Start Creating with AI
                                </Button>
                            </div>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
