import React, { useState, useEffect } from 'react';
import {
    Box,
    BlockStack,
    InlineStack,
    Text,
    RadioButton,
    Card,
    Icon,
    TextField,
    Spinner,
    Badge,
    Divider
} from '@shopify/polaris';
import {
    DiscountIcon,
    EmailIcon,
    IncentiveIcon
} from '@shopify/polaris-icons';
import { useSurveyState } from '../../hooks/useSurveyState';
import { useIntegrationApi } from '../../api/integration-api';
import { useToast } from '../../../../components/helper/toast-helper';
import { useQuery } from '@tanstack/react-query';
import Knob from '../../components/common/Knob';
import { useQueryEvents } from '../../../../components/helper/use-query-event';

export function AdvancedTab() {
    const {
        discountEnabled,
        setDiscountEnabled,
        discountSettings,
        setDiscountSettings,
        integrations,
        setIntegrationsEnabled,
        setKlaviyoEnabled,
        setKlaviyoListId,
        setRetainfulEnabled,
        setRetainfulListId,
        setIntegrations
    } = useSurveyState();
    
    // Create local state for survey integrations since the hook doesn't provide it
    const [surveyIntegrations, setSurveyIntegrationsState] = useState({
        enabled: false,
        klaviyo: { enabled: false, listId: '' },
        retainful: { enabled: false, listId: '' }
    });
    const { getIntegrationData } = useIntegrationApi();
    const { showToast } = useToast();

    // Local state for the UI and keeping track of API values
    const [discountType, setDiscountType] = useState('generic');
    const [discountValue, setDiscountValue] = useState('percentage');
    const [discountValueAmount, setDiscountValueAmount] = useState('');

    // Integration states
    const [integrationEnabled, setIntegrationEnabledLocal] = useState(false);
    const [klaviyoEnabled, setKlaviyoEnabledLocal] = useState(false);
    const [retainfulEnabled, setRetainfulEnabledLocal] = useState(false);
    const [klaviyoStatus, setKlaviyoStatus] = useState('disconnected');
    const [retainfulStatus, setRetainfulStatus] = useState('disconnected');
    const [selectedKlaviyoList, setSelectedKlaviyoList] = useState('');
    const [selectedRetainfulList, setSelectedRetainfulList] = useState('');
    const [klaviyoLists, setKlaviyoLists] = useState({});
    const [retainfulLists, setRetainfulLists] = useState({});

    // Fetch integrations data
    const { data: integrationData, isLoading: isLoadingIntegrations } = useQueryEvents(
        useQuery({
            queryKey: ['integration-data'],
            queryFn: getIntegrationData,
        }),
        {
            onSuccess: (response) => {
                if (response?.data?.data && Array.isArray(response.data.data)) {
                    response.data.data.forEach(integration => {
                        if (integration.type === 'klaviyo') {
                            const status = integration.status.toLowerCase() === 'connected' ? 'connected' : 'disconnected';
                            setKlaviyoStatus(status);
                            if (status === 'connected' && integration.lists) {
                                setKlaviyoLists(integration.lists);
                            } else if (status === 'connected' && integration.config && integration.config.lists) {
                                setKlaviyoLists(integration.config.lists);
                            }
                        } else if (integration.type === 'retainful') {
                            const status = integration.status.toLowerCase() === 'connected' ? 'connected' : 'disconnected';
                            setRetainfulStatus(status);
                            if (status === 'connected' && integration.lists) {
                                setRetainfulLists(integration.lists);
                            } else if (status === 'connected' && integration.config && integration.config.lists) {
                                setRetainfulLists(integration.config.lists);
                            }
                        }
                    });
                }
            },
            onError: (error) => {
                console.log('Error:', error);
                showToast({ message: "Failed to load integrations", type: "error" });
            }
        }
    )

    // Initialize state from store
    useEffect(() => {
        if (discountSettings) {
            // Get values directly from API structure
            setDiscountType(discountSettings.discount_type || 'generic');
            setDiscountValue(discountSettings.discount_value || 'percentage');
            setDiscountValueAmount(discountSettings.discount_value_amount || '');
        }
    }, [discountSettings]);

    // Initialize local state from global store
    useEffect(() => {
        if (integrations) {
            // Set local state based on the global store
            setIntegrationEnabledLocal(!!integrations.enabled);
            setKlaviyoEnabledLocal(!!integrations.klaviyo?.enabled);
            setRetainfulEnabledLocal(!!integrations.retainful?.enabled);
            
            if (integrations.klaviyo?.listId) {
                setSelectedKlaviyoList(integrations.klaviyo.listId);
            }
            
            if (integrations.retainful?.listId) {
                setSelectedRetainfulList(integrations.retainful.listId);
            }
            
            // Update local surveyIntegrations to match global state
            setSurveyIntegrationsState({
                enabled: !!integrations.enabled,
                klaviyo: { 
                    enabled: !!integrations.klaviyo?.enabled, 
                    listId: integrations.klaviyo?.listId || '' 
                },
                retainful: { 
                    enabled: !!integrations.retainful?.enabled, 
                    listId: integrations.retainful?.listId || '' 
                }
            });
        }
    }, [integrations]);
    
    // Keep global store in sync with API data if needed
    useEffect(() => {
        // Sync our UI state with the integration state
        setIntegrationEnabledLocal(!!surveyIntegrations.enabled);
        setKlaviyoEnabledLocal(!!surveyIntegrations.klaviyo?.enabled);
        setRetainfulEnabledLocal(!!surveyIntegrations.retainful?.enabled);
        
        if (surveyIntegrations.klaviyo?.listId) {
            setSelectedKlaviyoList(surveyIntegrations.klaviyo.listId);
        }
        
        if (surveyIntegrations.retainful?.listId) {
            setSelectedRetainfulList(surveyIntegrations.retainful.listId);
        }
    }, [surveyIntegrations]);

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

    // Handle integration toggle
    const toggleIntegrationEnabled = () => {
        const newState = !integrationEnabled;
        setIntegrationEnabledLocal(newState);

        // Update the global store
        setIntegrationsEnabled(newState);
        
        // Also update local state for UI
        setSurveyIntegrationsState(prev => ({
            ...prev,
            enabled: newState
        }));
    };

    // Handle Klaviyo toggle
    const toggleKlaviyoEnabled = () => {
        // Only allow enabling if Klaviyo is connected
        if (klaviyoStatus !== 'connected' && !klaviyoEnabled) {
            showToast({ message: "Klaviyo is not connected. Please connect it first.", type: "warning" });
            return;
        }

        const newState = !klaviyoEnabled;
        setKlaviyoEnabledLocal(newState);

        // Update the global store
        setKlaviyoEnabled(newState);
        
        // Also update local state for UI
        setSurveyIntegrationsState(prev => ({
            ...prev,
            klaviyo: {
                ...(prev?.klaviyo || {}),
                enabled: newState,
                listId: selectedKlaviyoList
            }
        }));
    };

    // Handle Retainful toggle
    const toggleRetainfulEnabled = () => {
        // Only allow enabling if Retainful is connected
        if (retainfulStatus !== 'connected' && !retainfulEnabled) {
            showToast({ message: "Retainful is not connected. Please connect it first.", type: "warning" });
            return;
        }

        const newState = !retainfulEnabled;
        setRetainfulEnabledLocal(newState);

        // Update the global store
        setRetainfulEnabled(newState);
        
        // Also update local state for UI
        setSurveyIntegrationsState(prev => ({
            ...prev,
            retainful: {
                ...(prev?.retainful || {}),
                enabled: newState,
                listId: selectedRetainfulList
            }
        }));
    };

    // Handle Klaviyo list selection
    const handleKlaviyoListChange = (listId) => {
        setSelectedKlaviyoList(listId);

        // Update the global store
        setKlaviyoListId(listId);
        
        // Also update local state for UI
        setSurveyIntegrationsState(prev => ({
            ...prev,
            klaviyo: {
                ...(prev?.klaviyo || {}),
                enabled: klaviyoEnabled,
                listId
            }
        }));
    };

    // Handle Retainful list selection
    const handleRetainfulListChange = (listId) => {
        setSelectedRetainfulList(listId);

        // Update the global store
        setRetainfulListId(listId);
        
        // Also update local state for UI
        setSurveyIntegrationsState(prev => ({
            ...prev,
            retainful: {
                ...(prev?.retainful || {}),
                enabled: retainfulEnabled,
                listId
            }
        }));
    };

    return (
        <BlockStack gap="400">
            {/* Discount Card */}
            <Card padding={"200"}>
                <Box padding="0">
                    <InlineStack blockAlign="center" wrap={false} align="space-between">
                        <InlineStack gap="200" blockAlign="center">
                            <Icon source={DiscountIcon} color={discountEnabled ? "success" : "base"} />
                            <Text variant="headingMd" as="h2">Enable Discount</Text>
                        </InlineStack>
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
                                        checked={discountValue === 'fixed_amount'}
                                        id="fixed-discount"
                                        name="discount-value-type"
                                        onChange={() => handleDiscountValueChange('fixed_amount')}
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

            {/* Integration Card */}
            <Card padding={"200"}>
                <Box padding="0">
                    <InlineStack blockAlign="center" wrap={false} align="space-between">
                        <InlineStack gap="200" blockAlign="center">
                            <Icon source={IncentiveIcon} color={integrationEnabled ? "success" : "base"} />
                            <Text variant="headingMd" as="h2">Enable Integrations</Text>
                        </InlineStack>
                        <Box>
                            <Knob
                                selected={integrationEnabled}
                                onClick={toggleIntegrationEnabled}
                                ariaLabel="Toggle integrations"
                            />
                        </Box>
                    </InlineStack>
                </Box>

                {integrationEnabled && (
                    <Box padding="400">
                        <BlockStack gap="400">
                            {isLoadingIntegrations ? (
                                <InlineStack align="center" gap="200">
                                    <Spinner size="small" />
                                    <Text variant="bodyMd">Loading integrations...</Text>
                                </InlineStack>
                            ) : (
                                <>
                                    {/* Klaviyo Integration */}
                                    <BlockStack gap="300">
                                        <Box>
                                            <InlineStack blockAlign="center" wrap={false} align="space-between">
                                                <InlineStack gap="200" blockAlign="center">
                                                    <Icon source={EmailIcon} color={klaviyoEnabled ? "success" : "base"} />
                                                    <Text variant="headingMd" as="h3">Klaviyo</Text>
                                                </InlineStack>
                                                
                                                <InlineStack gap="300" blockAlign="center">
                                                    {klaviyoStatus === 'disconnected' && (
                                                        <Badge tone="warning" size="small">Need to connect</Badge>
                                                    )}
                                                    <Box>
                                                        <Knob
                                                            selected={klaviyoEnabled}
                                                            onClick={toggleKlaviyoEnabled}
                                                            ariaLabel="Toggle Klaviyo"
                                                        />
                                                    </Box>
                                                </InlineStack>
                                            </InlineStack>
                                        </Box>

                                        {klaviyoEnabled && klaviyoStatus === 'connected' && (
                                            <Box padding="400">
                                                <BlockStack gap="400">
                                                    <Box paddingBlockEnd="350">
                                                        <Text variant="bodyMd" as="p" fontWeight="medium">Select an option:</Text>
                                                        <Box paddingBlockStart="200">
                                                            <RadioButton
                                                                key="klaviyo-list-none"
                                                                label="Just create the profile"
                                                                checked={selectedKlaviyoList === 'just_create_profile'}
                                                                id="klaviyo-list-none"
                                                                name="klaviyo-list"
                                                                onChange={() => handleKlaviyoListChange('just_create_profile')}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    
                                                    <BlockStack gap="200">
                                                        <Text variant="bodyMd" as="p" fontWeight="medium">Select a list to create profile to:</Text>
                                                        <BlockStack gap="100">
                                                            {Object.keys(klaviyoLists).length > 0 ? (
                                                                Object.entries(klaviyoLists).map(([listId, listName]) => (
                                                                    <RadioButton
                                                                        key={`klaviyo-list-${listId}`}
                                                                        label={listName}
                                                                        checked={selectedKlaviyoList === listId}
                                                                        id={`klaviyo-list-${listId}`}
                                                                        name="klaviyo-list"
                                                                        onChange={() => handleKlaviyoListChange(listId)}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <Text variant="bodyMd" color="subdued">No lists available. Please check your Klaviyo integration.</Text>
                                                            )}
                                                        </BlockStack>
                                                    </BlockStack>
                                                </BlockStack>
                                            </Box>
                                        )}
                                    </BlockStack>

                                    <Divider />

                                    {/* Retainful Integration */}
                                    <BlockStack gap="300">
                                        <Box>
                                            <InlineStack blockAlign="center" wrap={false} align="space-between">
                                                <InlineStack gap="200" blockAlign="center">
                                                    <Icon source={EmailIcon} color={retainfulEnabled ? "success" : "base"} />
                                                    <Text variant="headingMd" as="h3">Retainful</Text>
                                                </InlineStack>
                                                
                                                <InlineStack gap="300" blockAlign="center">
                                                    {retainfulStatus === 'disconnected' && (
                                                        <Badge tone="warning" size="small">Need to connect</Badge>
                                                    )}
                                                    <Box>
                                                        <Knob
                                                            selected={retainfulEnabled}
                                                            onClick={toggleRetainfulEnabled}
                                                            ariaLabel="Toggle Retainful"
                                                        />
                                                    </Box>
                                                </InlineStack>
                                            </InlineStack>
                                        </Box>

                                        {retainfulEnabled && retainfulStatus === 'connected' && (
                                            <Box padding="400">
                                                <BlockStack gap="400">
                                                    <Box paddingBlockEnd="400">
                                                        <Text variant="bodyMd" as="p" fontWeight="medium">Select an option:</Text>
                                                        <Box paddingBlockStart="200">
                                                            <RadioButton
                                                                key="retainful-list-none"
                                                                label="Just create the profile"
                                                                checked={selectedRetainfulList === 'just_create_profile'}
                                                                id="retainful-list-none"
                                                                name="retainful-list"
                                                                onChange={() => handleRetainfulListChange('just_create_profile')}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    
                                                    <Box>
                                                        <Text variant="bodyMd" as="p" fontWeight="medium">Select a list to add customers to:</Text>
                                                        <BlockStack gap="300" paddingBlockStart="200">
                                                            {Object.keys(retainfulLists).length > 0 ? (
                                                                Object.entries(retainfulLists).map(([listId, listName]) => (
                                                                    <RadioButton
                                                                        key={`retainful-list-${listId}`}
                                                                        label={listName}
                                                                        checked={selectedRetainfulList === listId}
                                                                        id={`retainful-list-${listId}`}
                                                                        name="retainful-list"
                                                                        onChange={() => handleRetainfulListChange(listId)}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <Text variant="bodyMd" color="subdued">No lists available. Please check your Retainful integration.</Text>
                                                            )}
                                                        </BlockStack>
                                                    </Box>
                                                </BlockStack>
                                            </Box>
                                        )}
                                    </BlockStack>
                                </>
                            )}
                        </BlockStack>
                    </Box>
                )}
            </Card>
        </BlockStack>
    );
}

export default AdvancedTab;
