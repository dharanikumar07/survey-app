import React from 'react';
import {
    Box,
    BlockStack,
    Text,
    ButtonGroup,
    Button,
    TextField,
    Checkbox,
    Select,
    Divider
} from '@shopify/polaris';
import { useSurveyState } from '../hooks/useSurveyState';

export function OnsiteSurveyConfig() {
    const {
        onsiteConfig,
        updateOnsiteConfig
    } = useSurveyState();

    const handlePageTargetingChange = (value) => {
        updateOnsiteConfig('pageTargeting', value);
    };

    const handleSpecificPagesChange = (value) => {
        updateOnsiteConfig('specificPages', value);
    };

    const handleExcludePagesChange = (checked) => {
        updateOnsiteConfig('excludePages', checked);
    };


    const handleExcludePageTypeChange = (pageType, checked) => {
        const currentExcludedPages = onsiteConfig.excludedPageTypes || [];
        let newExcludedPages;

        if (checked) {
            // Add page type to excluded list
            newExcludedPages = [...currentExcludedPages, pageType];
        } else {
            // Remove page type from excluded list
            newExcludedPages = currentExcludedPages.filter(type => type !== pageType);
        }

        updateOnsiteConfig('excludedPageTypes', newExcludedPages);
    };

    // TODO: Timing feature - commented out for now, can be re-enabled in future
    // const handleTimingDelayChange = (value) => {
    //     updateOnsiteConfig('timing', {
    //         ...onsiteConfig.timing,
    //         delay: parseInt(value) || 10
    //     });
    // };

    // const handleTimingUnitChange = (value) => {
    //     updateOnsiteConfig('timing', {
    //         ...onsiteConfig.timing,
    //         unit: value
    //     });
    // };

    const handleUserTargetingChange = (value) => {
        updateOnsiteConfig('userTargeting', value);
    };

    const handleWidgetRecurrenceChange = (value) => {
        updateOnsiteConfig('widgetRecurrence', value);
    };

    const handleUserTagChange = (checked) => {
        updateOnsiteConfig('userTag', checked);
    };

    const handleCustomerTypeChange = (type) => (checked) => {
        updateOnsiteConfig('customerType', {
            ...onsiteConfig.customerType,
            [type]: checked
        });
    };

    const handleProductPurchasedChange = (checked) => {
        updateOnsiteConfig('productPurchased', checked);
    };

    // TODO: Timing feature - commented out for now, can be re-enabled in future
    // const timingUnitOptions = [
    //     { label: 'seconds', value: 'seconds' },
    //     { label: 'minutes', value: 'minutes' },
    //     { label: 'hours', value: 'hours' }
    // ];

    const widgetRecurrenceOptions = [
        { label: 'Every time if the survey is not completed', value: 'every_time' },
        { label: 'Once per session', value: 'once_per_session' },
        // { label: 'Once per user', value: 'once_per_user' },
        // { label: 'Daily', value: 'daily' },
        // { label: 'Weekly', value: 'weekly' },
        // { label: 'Monthly', value: 'monthly' }
    ];

    const pageTypes = [
        { id: 'home', label: 'Home page' },
        { id: 'products', label: 'Product pages' },
        { id: 'collections', label: 'Collection pages' },
        { id: 'cart', label: 'Cart page' },
        { id: 'blog', label: 'Blog pages' }
    ];

    return (
        <div
            className="th-sf-onsite-config-container"
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
                {/* Page targeting section */}
                <Box>
                    <Text variant="headingMd" as="h4">
                        Page targeting
                    </Text>
                    <Box paddingBlockStart="200">
                        <ButtonGroup variant="segmented">
                            <Button
                                variant="tertiary"
                                pressed={onsiteConfig.pageTargeting === 'all'}
                                onClick={() => handlePageTargetingChange('all')}
                            >
                                All pages
                            </Button>
                            <Button
                                variant="tertiary"
                                pressed={onsiteConfig.pageTargeting === 'specific'}
                                onClick={() => handlePageTargetingChange('specific')}
                            >
                                Specific page
                            </Button>
                        </ButtonGroup>
                    </Box>

                    {onsiteConfig.pageTargeting === 'specific' && (
                        null
                    )}

                    <Box paddingBlockStart="300">
                        {/* Show checkbox only for "All pages" option */}
                        {onsiteConfig.pageTargeting === 'all' && (
                            <Checkbox
                                label="Exclude pages"
                                checked={onsiteConfig.excludePages || false}
                                onChange={handleExcludePagesChange}
                            />
                        )}

                        {/* Show page list based on conditions */}
                        {((onsiteConfig.pageTargeting === 'all' && onsiteConfig.excludePages) ||
                            onsiteConfig.pageTargeting === 'specific') && (
                                <Box
                                    paddingBlockStart="200"
                                    style={{
                                        backgroundColor: '#f6f6f7',
                                        padding: '16px',
                                        borderRadius: '6px',
                                        marginTop: onsiteConfig.pageTargeting === 'all' ? '8px' : '0px'
                                    }}
                                >
                                    <BlockStack gap="200">
                                        {pageTypes.map((pageType) => (
                                            <Checkbox
                                                key={pageType.id}
                                                label={pageType.label}
                                                checked={onsiteConfig.excludedPageTypes?.includes(pageType.id) || false}
                                                onChange={(checked) => handleExcludePageTypeChange(pageType.id, checked)}
                                            />
                                        ))}
                                    </BlockStack>
                                </Box>
                            )}
                    </Box>
                </Box>

                <Divider />

                {/* User targeting section */}
                <Box>
                    <Text variant="headingMd" as="h4">
                        User targeting
                    </Text>
                    <Box paddingBlockStart="200">
                        <ButtonGroup variant="segmented">
                            <Button
                                variant="tertiary"
                                pressed={onsiteConfig.userTargeting === 'all'}
                                onClick={() => handleUserTargetingChange('all')}
                            >
                                All users
                            </Button>
                            <Button
                                variant="tertiary"
                                pressed={onsiteConfig.userTargeting === 'segment'}
                                onClick={() => handleUserTargetingChange('segment')}
                            >
                                A segment of users
                            </Button>
                        </ButtonGroup>

                        {/* Segment-specific options */}
                        {onsiteConfig.userTargeting === 'segment' && (
                            <Box paddingBlockStart="300">
                                <Checkbox
                                    label="User tag"
                                    checked={onsiteConfig.userTag || false}
                                    onChange={handleUserTagChange}
                                />

                                {onsiteConfig.userTag && (
                                    <Box paddingBlockStart="200">
                                        <Button
                                            variant="tertiary"
                                            onClick={() => {
                                                // TODO: Implement user tag selection modal
                                                console.log('Open user tag selection');
                                            }}
                                        >
                                            Select user tag(s)
                                        </Button>

                                        <Box paddingBlockStart="200" paddingInlineStart="400">
                                            <Checkbox
                                                label="New customer"
                                                checked={onsiteConfig.customerType?.newCustomer || false}
                                                onChange={handleCustomerTypeChange('newCustomer')}
                                            />
                                            <Box paddingBlockStart="100">
                                                <Checkbox
                                                    label="Return customer"
                                                    checked={onsiteConfig.customerType?.returnCustomer || false}
                                                    onChange={handleCustomerTypeChange('returnCustomer')}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                )}

                                <Box paddingBlockStart="200">
                                    <Checkbox
                                        label="Product purchased"
                                        checked={onsiteConfig.productPurchased || false}
                                        onChange={handleProductPurchasedChange}
                                    />

                                    {onsiteConfig.productPurchased && (
                                        <Box paddingBlockStart="200">
                                            <Button
                                                variant="tertiary"
                                                onClick={() => {
                                                    // TODO: Implement product selection modal
                                                    console.log('Open product selection');
                                                }}
                                            >
                                                Select product
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* <Divider /> */}

                {/* Widget recurrence section */}
                {/* <Box>
                    <Text variant="headingMd" as="h4">
                        Widget recurrence
                    </Text>
                    <Box paddingBlockStart="200">
                        <Select
                            label=""
                            options={widgetRecurrenceOptions}
                            value={onsiteConfig.widgetRecurrence}
                            onChange={handleWidgetRecurrenceChange}
                        />
                    </Box>
                </Box> */}
            </BlockStack>
        </div>
    );
}
