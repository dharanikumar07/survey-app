import React from 'react';
import { Box, BlockStack, Text, Card, TextField, Select, Checkbox, Banner } from '@shopify/polaris';
import SectionRow from '../../../../components/section/SectionRow';
import CustomToggle from '../common/CustomToggle';
import { useSurveyState } from '../../hooks/useSurveyState';
import { PageAddIcon, EmailIcon } from '@shopify/polaris-icons';
import { formatSurveyForAPI } from '../../utils/surveyHelpers';

export function DiscountTab() {
    const {
        discountEnabled,
        setDiscountEnabled,
        discountSettings,
        setDiscountSettings,
        discountSections,
        toggleDiscountSection,
        questions,
        surveyTitle,
        isActive
    } = useSurveyState();

    // Handle discount settings update with survey formatting
    const handleDiscountUpdate = (updates) => {
        const newSettings = { ...discountSettings, ...updates };
        setDiscountSettings(newSettings);

        // Format survey data for discount configuration
        const surveyData = {
            name: surveyTitle,
            isActive: isActive,
            questions: questions.filter(q => q.id !== 'thankyou'),
            discount: {
                enabled: discountEnabled,
                ...newSettings
            }
        };

        const discountFormattedData = formatSurveyForAPI(surveyData);
        console.log('Discount settings updated:', newSettings);
        console.log('Survey data for discount:', discountFormattedData);
    };

    const displayOptions = [
        { label: 'Email', value: 'email' },
        { label: 'Thank you page', value: 'thankyou' },
        { label: 'Discount banner', value: 'banner' },
    ];

    return (
        <BlockStack gap="400">
            <Box padding="400">
                <BlockStack gap="300">
                    <Box>
                        <BlockStack gap="150">
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Text variant="headingMd" as="h3">Discount</Text>
                                <CustomToggle
                                    checked={discountEnabled}
                                    onChange={(val) => setDiscountEnabled(val)}
                                />
                            </Box>
                            <Text variant="bodyMd" tone="subdued">
                                We recommend offering discounts to boost survey responses.
                            </Text>
                        </BlockStack>
                    </Box>

                    {discountEnabled ? (
                        <Card padding="400">
                            <BlockStack gap="400">
                                <TextField
                                    label="Discount code"
                                    value={discountSettings.code}
                                    onChange={(value) => handleDiscountUpdate({ code: value })}
                                    autoComplete="off"
                                />

                                <Banner title="" tone="info">
                                    We cannot control if your customers share the discount code with others
                                </Banner>

                                <Select
                                    label="Display discount code on"
                                    options={displayOptions}
                                    value={discountSettings.displayOn}
                                    onChange={(value) => handleDiscountUpdate({ displayOn: value })}
                                />
                                {discountSettings.displayOn === 'email' ? (
                                    <Text tone="subdued">
                                        Your customers need to enter an email to receive Discount code
                                    </Text>
                                ) : null}

                                <Checkbox
                                    label="Limit one discount code per email address"
                                    checked={discountSettings.limitPerEmail}
                                    onChange={(checked) => handleDiscountUpdate({ limitPerEmail: checked })}
                                />

                                <Card padding="000">
                                    {discountSections.map((sec) => (
                                        <SectionRow
                                            key={sec.id}
                                            title={sec.title}
                                            icon={sec.icon === 'page' ? PageAddIcon : EmailIcon}
                                            isExpanded={sec.isExpanded}
                                            onToggle={() => toggleDiscountSection(sec.id)}
                                        >
                                            <Text>Settings for {sec.title}</Text>
                                        </SectionRow>
                                    ))}
                                </Card>
                            </BlockStack>
                        </Card>
                    ) : null}
                </BlockStack>
            </Box>
        </BlockStack>
    );
}
