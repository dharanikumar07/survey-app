import React, { useState, useEffect } from 'react';
import {
    Box,
    BlockStack,
    InlineStack,
    Text,
    RadioButton,
    Card,
    Icon,
    TextField
} from '@shopify/polaris';
import {
    DiscountIcon
} from '@shopify/polaris-icons';
import { useSurveyState } from '../../hooks/useSurveyState';
import Knob from '../../components/common/Knob';

export function DiscountTab() {
    const { discountEnabled, setDiscountEnabled, discountSettings, setDiscountSettings } = useSurveyState();

    // Local state for the UI and keeping track of API values
    const [discountType, setDiscountType] = useState('generic');
    const [discountValue, setDiscountValue] = useState('percentage');
    const [discountValueAmount, setDiscountValueAmount] = useState('');

    // Initialize state from store
    useEffect(() => {
        if (discountSettings) {
            // Get values directly from API structure
            setDiscountType(discountSettings.discount_type || 'generic');
            setDiscountValue(discountSettings.discount_value || 'percentage');
            setDiscountValueAmount(discountSettings.discount_value_amount || '');
        }
    }, [discountSettings]);

    // Update API fields when UI changes
    const handleDiscountTypeChange = (type) => {
        setDiscountType(type);

        // Update API fields
        setDiscountSettings({
            ...discountSettings,
            discount_type: type,
            discount_value: discountValue,
            discount_value_amount: discountValueAmount
        });
    };

    const handleDiscountValueChange = (value) => {
        setDiscountValue(value);
        setDiscountSettings({
            ...discountSettings,
            discount_value: value,
            discount_type: discountType,
            discount_value_amount: discountValueAmount
        });
    };

    const handleDiscountValueAmountChange = (value) => {
        setDiscountValueAmount(value);
        setDiscountSettings({
            ...discountSettings,
            discount_value_amount: value,
            discount_type: discountType,
            discount_value: discountValue
        });
    };

    const toggleDiscountEnabled = () => {
        setDiscountEnabled(!discountEnabled);

        // If enabling discount, ensure the settings object is initialized with default values
        if (!discountEnabled) {
            setDiscountSettings({
                enabled: true,
                discount_type: discountType,
                discount_value: discountValue,
                discount_value_amount: discountValueAmount
            });
        }
    };

    return (
        <BlockStack gap="400">
            <Card padding={"200"}>
                <Box padding="0">
                    <InlineStack blockAlign="center" gap="800" wrap={false}>
                        <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Icon source={DiscountIcon} color={discountEnabled ? "success" : "base"} />
                            <Text variant="headingMd" as="h2">Enable Discount</Text>
                        </Box>
                        <Box>
                            <Knob
                                selected={discountEnabled}
                                onClick={toggleDiscountEnabled}
                                ariaLabel="Toggle discount"
                            />
                        </Box>
                    </InlineStack>
                </Box>

                {discountEnabled && (
                    <Box padding="400">
                        <BlockStack gap="400">
                            <Text variant="headingMd" as="h2">Choose Discount Type</Text>

                            {/* Radio buttons for discount type selection */}
                            <RadioButton
                                label="Generic Discount"
                                helpText="A discount code anyone can use, but only once the discount code is valid."
                                checked={discountType === 'generic'}
                                id="generic-discount"
                                name="discount-type"
                                onChange={() => handleDiscountTypeChange('generic')}
                            />

                            <RadioButton
                                label="Customer-Specific Discount"
                                helpText="A discount code valid for a specific customer only, usable once."
                                checked={discountType === 'customer-specific'}
                                id="customer-specific-discount"
                                name="discount-type"
                                onChange={() => handleDiscountTypeChange('customer-specific')}
                            />

                            {/* Discount Value Type Options */}
                            <Box paddingBlockStart="400">
                                <BlockStack gap="300">
                                    <Text variant="headingMd" as="h2">Discount Value Type Options</Text>

                                    <RadioButton
                                        label="Percentage Discount"
                                        checked={discountValue === 'percentage'}
                                        id="percentage-discount"
                                        name="discount-value-type"
                                        onChange={() => handleDiscountValueChange('percentage')}
                                    />

                                    <RadioButton
                                        label="Fixed Amount Discount"
                                        checked={discountValue === 'fixed'}
                                        id="fixed-discount"
                                        name="discount-value-type"
                                        onChange={() => handleDiscountValueChange('fixed')}
                                    />
                                </BlockStack>
                            </Box>

                            {/* Discount Value Amount Input */}
                            <Box paddingBlockStart="400">
                                <BlockStack gap="300">
                                    <Text variant="headingMd" as="h2">Discount Value</Text>

                                    <TextField
                                        label="Discount Amount"
                                        type="number"
                                        value={discountValueAmount}
                                        onChange={handleDiscountValueAmountChange}
                                        placeholder={discountValue === 'percentage' ? 'Enter percentage (e.g., 10)' : 'Enter amount (e.g., 5.00)'}
                                        suffix={discountValue === 'percentage' ? '%' : '$'}
                                        min="0"
                                        step={discountValue === 'percentage' ? '1' : '0.01'}
                                        helpText={discountValue === 'percentage' ? 'Enter the percentage discount (0-100)' : 'Enter the fixed amount discount'}
                                    />
                                </BlockStack>
                            </Box>
                        </BlockStack>
                    </Box>
                )}
            </Card>
        </BlockStack>
    );
}
