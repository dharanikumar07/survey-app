import React, { useRef } from 'react';
import {
    Box,
    InlineStack,
    Text,
    ButtonGroup,
    Button,
    Icon,
    Tooltip,
    Select,
    Popover,
    ActionList
} from '@shopify/polaris';
import {
    DesktopIcon,
    MobileIcon,
    MaximizeIcon,
    NoteIcon,
    ArrowUpIcon,
    ChevronDownIcon,
    IdentityCardIcon,
    CartIcon,
    EmailIcon,
    ExitIcon,
    CodeIcon
} from '@shopify/polaris-icons';
import { useSurveyState } from '../../hooks/useSurveyState';
import { prepareSurveyForBackend, formatSurveyForAPI, validateSurveyForAPI } from '../../utils/surveyHelpers';
import { useSurveyApi } from '../../action/use-survey-api';
import { useToast } from '../../../../components/helper/toast-helper';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

function ModalHeader({ title, surveyPreviewRef, onClose }) {
    const {
        selectedView,
        setSelectedView,
        isActive,
        setIsActive,
        selectedTheme,
        setSelectedTheme,
        themePopoverActive,
        setThemePopoverActive,
        statusPopoverActive,
        setStatusPopoverActive,
        surveyPagePopoverActive,
        setSurveyPagePopoverActive,
        selectedSurveyPage,
        setSelectedSurveyPage,
        questions,
        channelItems,
        discountEnabled,
        discountSettings,
        surveyTitle,
        onsiteConfig
    } = useSurveyState();

    const { saveSurvey } = useSurveyApi();
    const { showToast } = useToast();
    const { uuid } = useParams();

    const { mutate: saveSurveyMutation, isPending } = useMutation({
        mutationFn: ({ surveyData, uuid }) => saveSurvey(surveyData, uuid),
        onSuccess: (response) => {
            const message = response?.data?.message || "Survey saved successfully";
            showToast({ message, type: "success" });
            onClose();
        },
        onError: () => {
            showToast({ message: "Failed to save survey", type: "error" });
        }
    });


    // Handle save functionality
    const handleSave = () => {
        // Build survey data using only what exists in store
        const surveyData = {
            name: surveyTitle,
            isActive: isActive,
            questions: questions
                .filter(q => q.id !== 'thankyou')
                .map((q, index) => ({
                    type: q.type,
                    heading: q.content,
                    description: q.description || "",
                    position: index,
                    answers: q.answerOptions?.map(opt => ({
                        content: opt.text,
                        id: opt.id
                    })) || [],
                    id: q.id
                })),
            thankYou: {
                type: "thank_you",
                heading: questions.find(q => q.id === 'thankyou')?.content || "Thank You Card",
                description: questions.find(q => q.id === 'thankyou')?.description || ""
            },
            channels: {
                // Include all enabled channels
                ...(channelItems.find(c => c.id === 'onsite')?.isEnabled && {
                    onsite: {
                        type: "onsite",
                        enabled: true,
                        config: onsiteConfig
                    }
                }),
                ...(channelItems.find(c => c.id === 'thankyou')?.isEnabled && {
                    thankyou: {
                        type: "thankyou",
                        enabled: true
                    }
                }),
                ...(channelItems.find(c => c.id === 'branded')?.isEnabled && {
                    dedicatedPageSurvey: {
                        type: "dedicatedPageSurvey",
                        enabled: true
                    }
                })
            },
            discount: {
                enabled: discountEnabled,
                discount_type: discountSettings.discount_type || "generic",
                discount_value: discountSettings.discount_value || "percentage",
                discount_value_amount: discountSettings.discount_value_amount || ""
            },
            channelTypes: channelItems
                .filter(channel => channel.isEnabled)
                .map(channel => channel.id),
            totalResponses: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Capture HTML content from the survey preview
        let htmlContent = '';

        if (surveyPreviewRef && surveyPreviewRef.current) {
            htmlContent = surveyPreviewRef.current.getBodyContent();

            // Simple debugging
            console.log('HTML Content Length:', htmlContent?.length);
        }

        // Use helper for API formatting
        const apiFormattedData = formatSurveyForAPI(surveyData);

        // Prepare complete survey data with HTML for backend storage
        const completeSurveyData = prepareSurveyForBackend(surveyData, htmlContent);

        // console.log('API Formatted Data (New Structure):', apiFormattedData);
        // console.log('Complete Survey Data with HTML (New Structure):', completeSurveyData);
        // console.log('Survey Type:', completeSurveyData.survey_type);
        // console.log('Status:', completeSurveyData.status);
        // console.log('Is Active:', completeSurveyData.is_active);
        // console.log('Survey Meta Data:', completeSurveyData.survey_meta_data);
        // console.log('Container HTML Content (th-sf-survey-container):', completeSurveyData.survey_meta_data?.htmlContent);
        console.log('Complete Survey Data:', completeSurveyData);

        // Validate the data structure before sending to API
        const validation = validateSurveyForAPI(completeSurveyData);
        if (!validation.isValid) {
            console.error('Survey data validation failed:', validation.errors);
            showToast({
                message: `Validation failed: ${validation.errors.join(', ')}`,
                type: "error"
            });
            return;
        }

        // Here you would typically send the data to your backend
        // Example: await saveSurveyToBackend(completeSurveyData);
        saveSurveyMutation({ surveyData: completeSurveyData, uuid: uuid });
    };

    const themes = [
        { label: 'Default Theme', value: 'default' },
        { label: 'Light Theme', value: 'light' },
        { label: 'Dark Theme', value: 'dark' },
        { label: 'Brand Colors', value: 'brand' },
    ];

    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
    ];

    const surveyPageOptions = [
        {
            label: 'Branded survey page',
            value: 'branded',
            icon: IdentityCardIcon,
            description: 'Custom branded survey page'
        },
        {
            label: 'On-site survey',
            value: 'onsite',
            icon: NoteIcon,
            description: 'Embedded survey on your website'
        },
        {
            label: 'Thank you page',
            value: 'thankyou',
            icon: CartIcon,
            description: 'Post-purchase thank you page'
        },
        {
            label: 'Post-purchase email',
            value: 'email',
            icon: EmailIcon,
            description: 'Survey sent via email'
        },
        {
            label: 'Exit intent',
            value: 'exit',
            icon: ExitIcon,
            description: 'Survey shown when leaving site'
        },
        {
            label: 'Embed survey',
            value: 'embed',
            icon: CodeIcon,
            description: 'Embed survey anywhere'
        }
    ];

    const handleViewChange = (view) => {
        setSelectedView(view);
    };

    const handleThemeChange = (value) => {
        setSelectedTheme(value);
        setThemePopoverActive(false);
    };

    const handleStatusChange = (value) => {
        setIsActive(value === 'active');
        setStatusPopoverActive(false);
    };

    const handleSurveyPageChange = (value) => {
        setSelectedSurveyPage(value);
        setSurveyPagePopoverActive(false);
    };

    const toggleThemePopover = () => {
        setThemePopoverActive(!themePopoverActive);
    };

    const toggleStatusPopover = () => {
        setStatusPopoverActive(!statusPopoverActive);
    };

    const toggleSurveyPagePopover = () => {
        setSurveyPagePopoverActive(!surveyPagePopoverActive);
    };

    const getSelectedSurveyPage = () => {
        return surveyPageOptions.find(option => option.value === selectedSurveyPage);
    };

    return (
        <Box
            padding="400"
            borderBlockEndWidth="1"
            borderColor="border"
            background="bg-surface"
            borderBlockStartWidth="1"
        >
            <InlineStack align="space-between" blockAlign="center">
                {/* Left Section */}
                <InlineStack gap="500" wrap={false}>
                    <ButtonGroup variant='segmented'>
                        <Button
                            pressed
                            icon={NoteIcon}
                            variant='tertiary'
                        >
                            Build Survey
                        </Button>
                        {/* <Button
                            icon={ArrowUpIcon}
                        >
                            Advanced Logic
                        </Button> */}
                    </ButtonGroup>


                </InlineStack>

                {/* Center Section - Theme Selection and Preview Switch */}
                <Box className="th-sf-modal-header-center">
                    <InlineStack>
                        {/* Branded Survey Page Popover */}
                        {/* <Popover
                            active={surveyPagePopoverActive}
                            activator={
                                <Button
                                    onClick={toggleSurveyPagePopover}
                                    icon={getSelectedSurveyPage()?.icon}
                                    iconPosition="left"
                                    variant='monochromePlain'
                                    size="slim"
                                    disclosure
                                >
                                    {getSelectedSurveyPage()?.label}
                                </Button>
                            }
                            onClose={() => setSurveyPagePopoverActive(false)}
                            preferredAlignment="left"
                        >
                            <ActionList
                                actionRole="menuitem"
                                items={surveyPageOptions.map(option => ({
                                    content: option.label,
                                    icon: option.icon,
                                    onAction: () => handleSurveyPageChange(option.value),
                                    active: selectedSurveyPage === option.value
                                }))}
                            />
                        </Popover> */}

                        {/* Device View Controls */}
                        <ButtonGroup variant='segmented'>
                            <Tooltip content="Desktop view">
                                <Button
                                    icon={DesktopIcon}
                                    pressed={selectedView === 'desktop'}
                                    onClick={() => handleViewChange('desktop')}
                                    size="slim"
                                />
                            </Tooltip>
                            <Tooltip content="Mobile view">
                                <Button
                                    icon={MobileIcon}
                                    pressed={selectedView === 'mobile'}
                                    onClick={() => handleViewChange('mobile')}
                                    size="slim"
                                />
                            </Tooltip>
                            <Tooltip content="Fullscreen view">
                                <Button
                                    icon={MaximizeIcon}
                                    pressed={selectedView === 'maximize'}
                                    onClick={() => handleViewChange('maximize')}
                                    size="slim"
                                />
                            </Tooltip>
                        </ButtonGroup>
                    </InlineStack>
                </Box>

                {/* Right Section - Buttons, Refresh and Status */}
                <InlineStack gap="200" blockAlign="center" wrap={false}>
                    {/* Generate HTML Button */}
                    {/* <Button
                        size="slim"
                        onClick={() => {
                            if (surveyPreviewRef && surveyPreviewRef.current) {
                                const htmlContent = surveyPreviewRef.current.getBodyContent();
                                console.log('Survey HTML Content:', htmlContent);
                                alert('Survey HTML generated! Check console for details.');
                            }
                        }}
                    >
                        Generate HTML
                    </Button> */}

                    {/* Refresh Button */}
                    <Button
                        variant="secondary"
                        size="slim"
                        onClick={() => surveyPreviewRef?.current?.refreshIframe()}
                    >
                        Refresh
                    </Button>
                    {/* Save/Update Button */}
                    <Button
                        variant="primary"
                        size="slim"
                        onClick={handleSave}
                        loading={isPending}
                    >
                        {uuid ? 'Update' : 'Save'}
                    </Button>

                    {/* Status Dropdown */}
                    <Popover
                        active={statusPopoverActive}
                        activator={
                            <Button
                                onClick={toggleStatusPopover}
                                icon={ChevronDownIcon}
                                iconPosition="right"
                                size="slim"
                                tone={isActive ? "success" : "attention"}
                            >
                                <InlineStack gap="200" blockAlign="center">
                                    {isActive ? 'Active' : 'Inactive'}
                                </InlineStack>
                            </Button>
                        }
                        onClose={() => setStatusPopoverActive(false)}
                        preferredAlignment="right"
                    >
                        <ActionList
                            actionRole="menuitem"
                            items={statusOptions.map(status => ({
                                content: status.label,
                                onAction: () => handleStatusChange(status.value),
                                active: (status.value === 'active' && isActive) || (status.value === 'inactive' && !isActive)
                            }))}
                        />
                    </Popover>
                </InlineStack>
            </InlineStack>
        </Box>
    );
}

export default ModalHeader;