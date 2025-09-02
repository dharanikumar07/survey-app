import React from 'react';
import { Box, BlockStack, Text, Card } from '@shopify/polaris';
import { useSurveyState } from '../../hooks/useSurveyState';
import SurveyAccordion from '../../../../components/SurveyAccordion';
import { formatSurveyForAPI } from '../../utils/surveyHelpers';

export function ChannelTab() {
    const {
        channelItems,
        toggleChannelExpand,
        toggleChannelEnabled,
        questions,
        surveyTitle,
        isActive
    } = useSurveyState();

    // Handle channel updates with survey formatting
    const handleChannelUpdate = (channelId, enabled) => {
        // Format survey data for specific channel
        const surveyData = {
            name: surveyTitle,
            isActive: isActive,
            questions: questions.filter(q => q.id !== 'thankyou'),
            channels: [channelId]
        };

        const channelFormattedData = formatSurveyForAPI(surveyData);
        console.log(`Channel ${channelId} ${enabled ? 'enabled' : 'disabled'}:`, channelFormattedData);

        // Update channel settings
        toggleChannelEnabled(channelId);
    };

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
                                onToggleEnabled={(channelId) => handleChannelUpdate(channelId, !item.isEnabled)}
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
