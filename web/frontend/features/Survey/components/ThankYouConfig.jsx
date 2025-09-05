import React from 'react';
import {
    Box,
    BlockStack,
    Text,
    TextField,
    Checkbox,
    Select,
    Divider,
    ButtonGroup,
    Button
} from '@shopify/polaris';
import { useSurveyState } from '../hooks/useSurveyState';

export function ThankYouConfig() {
    const {
        thankyouConfig,
        updateThankyouConfig
    } = useSurveyState();

    const handleMessageChange = (value) => {
        updateThankyouConfig('message', value);
    };

    const handleActionChange = (value) => {
        updateThankyouConfig('action', value);
    };

    const handleSocialSharingChange = (checked) => {
        updateThankyouConfig('socialSharing', checked);
    };

    const handleEmailCollectionChange = (checked) => {
        updateThankyouConfig('emailCollection', checked);
    };

    const handleUserTargetingChange = (value) => {
        updateThankyouConfig('userTargeting', value);
    };

    const handleUserTagChange = (checked) => {
        updateThankyouConfig('userTag', checked);
    };

    const handleCustomerTypeChange = (type) => (checked) => {
        updateThankyouConfig('customerType', {
            ...thankyouConfig.customerType,
            [type]: checked
        });
    };

    const handleProductPurchasedChange = (checked) => {
        updateThankyouConfig('productPurchased', checked);
    };

    const handleReturnCustomerChange = (checked) => {
        updateThankyouConfig('returnCustomer', checked);
    };

    const handleNewCustomerChange = (checked) => {
        updateThankyouConfig('newCustomer', checked);
    };

    const thankyouOptions = [
        { label: 'Show thank you message', value: 'message' },
        { label: 'Redirect to custom page', value: 'redirect' },
        { label: 'Show discount code', value: 'discount' }
    ];

    const userTargetingOptions = [
        {
            id: 'userTag',
            label: 'User tag',
            hasButton: true,
            buttonText: 'Select user tag',
            buttonAction: () => console.log('Open user tag selection'),
        },
        {
            id: 'productPurchased',
            label: 'Product purchased',
            hasButton: true,
            buttonText: 'Select product',
            buttonAction: () => console.log('Open product selection')
        },
        {
            id: 'newCustomer',
            label: 'New customer',
            hasButton: false,
            buttonText: '',
            buttonAction: null
        },
        {
            id: 'returnCustomer',
            label: 'Return customer',
            hasButton: false,
            buttonText: '',
            buttonAction: null
        }
    ];

    return (
        <div
            className="th-sf-thankyou-config-container"
            style={{
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '16px',
                border: '1px solid #e1e3e5',
                borderRadius: '8px',
                backgroundColor: '#fafafa'
            }}
        >
            <BlockStack gap="400">
                {/* Thank you message section */}
                {/* <Box>
                    <Text variant="headingMd" as="h4">
                        Thank you message
                    </Text>
                    <Box paddingBlockStart="200">
                        <TextField
                            label="Message"
                            value={thankyouConfig?.message || "Thank you for your feedback!"}
                            onChange={handleMessageChange}
                            placeholder="Enter your thank you message"
                            multiline={3}
                        />
                    </Box>
                </Box> */}

                {/* <Divider /> */}

                {/* Action after completion section */}
                {/* <Box>
                    <Text variant="headingMd" as="h4">
                        Action after completion
                    </Text>
                    <Box paddingBlockStart="200">
                        <Select
                            label=""
                            options={thankyouOptions}
                            value={thankyouConfig?.action || "message"}
                            onChange={handleActionChange}
                        />
                    </Box>
                </Box> */}

                {/* <Divider /> */}

                {/* User targeting section */}
                <Box>
                    <Text variant="headingMd" as="h4">
                        User targeting
                    </Text>
                    <Box paddingBlockStart="200">
                        <ButtonGroup variant="segmented">
                            <Button
                                variant="tertiary"
                                pressed={thankyouConfig?.userTargeting === 'all'}
                                onClick={() => handleUserTargetingChange('all')}
                            >
                                All users
                            </Button>
                            <Button
                                variant="tertiary"
                                pressed={thankyouConfig?.userTargeting === 'segment'}
                                onClick={() => handleUserTargetingChange('segment')}
                            >
                                A segment of users
                            </Button>
                        </ButtonGroup>

                        {/* Segment-specific options */}
                        {thankyouConfig?.userTargeting === 'segment' && (
                            <Box paddingBlockStart="300">
                                <BlockStack gap="300">
                                    {userTargetingOptions.map((option) => (
                                        <Box key={option.id}>
                                            <Checkbox
                                                label={option.label}
                                                checked={
                                                    option.id === 'userTag'
                                                        ? thankyouConfig?.userTag || false
                                                        : option.id === 'productPurchased'
                                                            ? thankyouConfig?.productPurchased || false
                                                            : option.id === 'newCustomer'
                                                                ? thankyouConfig?.newCustomer || false
                                                                : thankyouConfig?.returnCustomer || false
                                                }
                                                onChange={
                                                    option.id === 'userTag'
                                                        ? handleUserTagChange
                                                        : option.id === 'productPurchased'
                                                            ? handleProductPurchasedChange
                                                            : option.id === 'newCustomer'
                                                                ? handleNewCustomerChange
                                                                : handleReturnCustomerChange
                                                }
                                            />

                                            {option.hasButton && (
                                                <Box paddingBlockStart="200">
                                                    <Button
                                                        variant="tertiary"
                                                        onClick={option.buttonAction}
                                                    >
                                                        {option.buttonText}
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                    ))}
                                </BlockStack>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* <Divider /> */}

                {/* Additional settings section */}
                {/* <Box>
                    <Text variant="headingMd" as="h4">
                        Additional settings
                    </Text>
                    <Box paddingBlockStart="200">
                        <Checkbox
                            label="Show social sharing buttons"
                            checked={thankyouConfig?.socialSharing || false}
                            onChange={handleSocialSharingChange}
                        />
                    </Box>
                    <Box paddingBlockStart="200">
                        <Checkbox
                            label="Collect email for follow-up"
                            checked={thankyouConfig?.emailCollection || false}
                            onChange={handleEmailCollectionChange}
                        />
                    </Box>
                </Box> */}
            </BlockStack>
        </div>
    );
}
