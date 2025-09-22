import React from 'react';
import { Box, BlockStack, Text, Card, Scrollable } from '@shopify/polaris';
import { useSurveyState } from '../../hooks/useSurveyState';
import { BrandedSurveyConfig } from '../BrandedSurveyConfig';

export function PreferencesTab() {
    const {
        brandedConfig,
        updateBrandedConfig
    } = useSurveyState();

    return (
        <BlockStack gap="400">
            <Box padding="400">
                <BlockStack gap="300">
                    <Text variant="headingMd" as="h3">Preferences</Text>
                    <Text variant="bodyMd" color="text-subdued">
                        Customize the appearance and branding of your survey to match your brand identity.
                    </Text>

                    <Card padding="400">
                        <Scrollable style={{ height: '600px' }}>
                            <BrandedSurveyConfig
                                item={{
                                    id: 'preferences',
                                    title: 'Survey Preferences',
                                    isEnabled: true
                                }}
                            />
                        </Scrollable>
                    </Card>

                    <Text variant="bodySm" color="text-subdued">
                        Configure your survey's visual appearance, colors, fonts, and branding elements.
                    </Text>
                </BlockStack>
            </Box>
        </BlockStack>
    );
}
