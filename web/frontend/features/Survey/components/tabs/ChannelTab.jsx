import React from 'react';
import { Box, BlockStack, Text, Card } from '@shopify/polaris';
// import { ChannelAccordion } from '../../../../components/Accordion';
import useStore from '../../../../State/store';
import SurveyAccordion from '../../../../components/SurveyAccordion';

export function ChannelTab() {
    const { channelItems, toggleChannelExpand, toggleChannelEnabled } = useStore();

    return (
        <BlockStack gap="400">
            <Box padding="400">
                <BlockStack gap="300">
                    <Text variant="headingMd" as="h3">Channel Settings</Text>
                    <Text variant="bodyMd" color="text-subdued">
                        Configure where and how your survey will be displayed to customers.
                    </Text>

                    <Card padding="000">
                        {channelItems.map((item) => (
                            <SurveyAccordion
                                key={item.id}
                                item={item}
                                onToggleExpand={toggleChannelExpand}
                                onToggleEnabled={toggleChannelEnabled}
                            />
                        ))}
                    </Card>

                    <Text variant="bodySm" color="text-subdued">
                        Enable the channels you want to use for your survey and configure their settings.
                    </Text>
                </BlockStack>
            </Box>
        </BlockStack>
    );
}
