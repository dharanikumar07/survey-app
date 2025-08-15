import React from 'react';
import { Box, BlockStack, Text, Card, TextField, Select, Checkbox, Banner } from '@shopify/polaris';
import SectionRow from '../../../../components/section/SectionRow';
import CustomToggle from '../common/CustomToggle';
import { useSurveyState } from '../../hooks/useSurveyState';
import { PageAddIcon, EmailIcon } from '@shopify/polaris-icons';

export function DiscountTab() {
    const {
        discountEnabled,
        setDiscountEnabled,
        discountSettings,
        setDiscountSettings,
        discountSections,
        toggleDiscountSection,
    } = useSurveyState();

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
                                    onChange={(value) => setDiscountSettings({ code: value })}
                                    autoComplete="off"
                                />

                                <Banner title="" tone="info">
                                    We cannot control if your customers share the discount code with others
                                </Banner>

                                <Select
                                    label="Display discount code on"
                                    options={displayOptions}
                                    value={discountSettings.displayOn}
                                    onChange={(value) => setDiscountSettings({ displayOn: value })}
                                />
                                {discountSettings.displayOn === 'email' ? (
                                    <Text tone="subdued">
                                        Your customers need to enter an email to receive Discount code
                                    </Text>
                                ) : null}

                                <Checkbox
                                    label="Limit one discount code per email address"
                                    checked={discountSettings.limitPerEmail}
                                    onChange={(checked) => setDiscountSettings({ limitPerEmail: checked })}
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
