import React, { useState, useEffect } from 'react';
import { Box, BlockStack, Text, Card, Divider } from '@shopify/polaris';
import { useSurveyState } from '../../hooks/useSurveyState';
import SurveyAccordion from '../../../../components/SurveyAccordion';
import { LinkIcon } from '@shopify/polaris-icons';

export function ChannelTab() {
    const {
        channelItems,
        toggleChannelExpand,
        toggleChannelEnabled,
        questions,
        surveyTitle,
        isActive,
        brandedSurveyUrl
    } = useSurveyState();

    // Filter out the email channel
    const filteredChannelItems = channelItems.filter(item => item.id !== 'email');

    // State to track which accordion is currently open (only one at a time)
    const [openAccordionId, setOpenAccordionId] = useState(null);

    // Handle accordion toggle with single-open behavior
    const handleAccordionToggle = (itemId) => {
        // If clicking the same accordion that's open, close it
        if (openAccordionId === itemId) {
            setOpenAccordionId(null);
            toggleChannelExpand(itemId); // Close the accordion
        } else {
            // Close any previously open accordion
            if (openAccordionId) {
                toggleChannelExpand(openAccordionId);
            }
            // Open the new accordion
            setOpenAccordionId(itemId);
            toggleChannelExpand(itemId);
        }
    };

    // Sync local state with store state on mount or when channelItems change
    useEffect(() => {
        const expandedItem = filteredChannelItems.find(item => item.isExpanded);
        if (expandedItem) {
            setOpenAccordionId(expandedItem.id);
        } else {
            // Reset the openAccordionId if no items are expanded
            setOpenAccordionId(null);
        }
    }, [filteredChannelItems]);

    // Handle channel updates
    const handleChannelUpdate = (channelId, enabled) => {
        console.log(`Channel ${channelId} ${enabled ? 'enabled' : 'disabled'}`);

        // Update channel settings in store
        toggleChannelEnabled(channelId);

        // Get updated channel items after toggle
        const updatedChannelItems = channelItems.map(item =>
            item.id === channelId ? { ...item, isEnabled: enabled } : item
        );

        // Log the enabled channels for debugging
        const enabledChannels = updatedChannelItems
            .filter(item => item.isEnabled)
            .map(item => item.id);

        console.log('Enabled channels:', enabledChannels);
    };
    console.log('ChannelItems', channelItems);

    // Create a branded survey item that's always expanded with the branded survey link from global state
    const brandedSurveyItem = {
        id: 'branded',
        title: 'Branded Survey Page',
        description: 'Share a direct link to your survey',
        isEnabled: true,
        isExpanded: true,
        icon: 'document',
        config: {
            branded_survey: brandedSurveyUrl
        }
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
                        {/* Always-expanded Branded Survey Page */}
                        <SurveyAccordion
                            key="branded"
                            item={brandedSurveyItem}
                            onToggleExpand={() => {}} // No-op since it's always expanded
                            onToggleEnabled={() => {}} // No-op since it's always enabled
                        />

                        <Divider />

                        {/* Other channel items */}
                        {filteredChannelItems.map((item) => (
                            <SurveyAccordion
                                key={item.id}
                                item={{
                                    ...item,
                                    isExpanded: openAccordionId === item.id
                                }}
                                onToggleExpand={handleAccordionToggle}
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
