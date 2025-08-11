import React from 'react';
import { Box, BlockStack, Text } from '@shopify/polaris';

export function ChannelTab() {
    return (
        <BlockStack gap="400">
            <Box padding="400">
                <BlockStack gap="300">
                    <Text variant="headingMd" as="h3">Channel Settings</Text>
                    <Text variant="bodyMd" color="text-subdued">
                        Configure where and how your survey will be displayed to customers.
                    </Text>

                    <Box padding="400" background="bg-surface-secondary" borderRadius="100">
                        <BlockStack gap="200">
                            <Text variant="bodyMd" fontWeight="semibold">Available Channels:</Text>
                            <Text variant="bodySm">• Branded survey page</Text>
                            <Text variant="bodySm">• On-site survey widget</Text>
                            <Text variant="bodySm">• Post-purchase page</Text>
                            <Text variant="bodySm">• Email campaigns</Text>
                            <Text variant="bodySm">• Exit intent popup</Text>
                        </BlockStack>
                    </Box>

                    <Text variant="bodySm" color="text-subdued">
                        Channel configuration options will be available here.
                    </Text>
                </BlockStack>
            </Box>
        </BlockStack>
    );
}
