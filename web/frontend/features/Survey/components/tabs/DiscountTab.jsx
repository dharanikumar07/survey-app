import React from 'react';
import { Box, BlockStack, Text } from '@shopify/polaris';

export function DiscountTab() {
    return (
        <BlockStack gap="400">
            <Box padding="400">
                <BlockStack gap="300">
                    <Text variant="headingMd" as="h3">Discount & Rewards</Text>
                    <Text variant="bodyMd" color="text-subdued">
                        Set up discount codes and rewards for survey completion.
                    </Text>

                    <Box padding="400" background="bg-surface-secondary" borderRadius="100">
                        <BlockStack gap="200">
                            <Text variant="bodyMd" fontWeight="semibold">Reward Options:</Text>
                            <Text variant="bodySm">• Percentage discount (e.g., 10% off)</Text>
                            <Text variant="bodySm">• Fixed amount discount (e.g., $5 off)</Text>
                            <Text variant="bodySm">• Free shipping</Text>
                            <Text variant="bodySm">• Product rewards</Text>
                            <Text variant="bodySm">• Loyalty points</Text>
                        </BlockStack>
                    </Box>

                    <Text variant="bodySm" color="text-subdued">
                        Discount and reward configuration will be implemented here.
                    </Text>
                </BlockStack>
            </Box>
        </BlockStack>
    );
}
