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

function ModalHeader({ title = "Survey #1", surveyPreviewRef }) {
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
        surveyTitle
    } = useSurveyState();

    const { saveSurvey } = useSurveyApi();
    const { showToast } = useToast();
    const { mutate: saveSurveyMutation } = useMutation({
        mutationFn: saveSurvey,
        onSuccess: () => {
            showToast({ message: "Survey saved successfully", type: "success" });
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
                // Only include channels that exist in your store
                ...(channelItems.find(c => c.id === 'branded') && {
                    dedicatedPageSurvey: {
                        type: "dedicatedPageSurvey",
                        enabled: channelItems.find(c => c.id === 'branded')?.isEnabled || false
                    }
                })
            },
            discount: {
                enabled: discountEnabled,
                code: discountSettings.code || "",
                displayOn: discountSettings.displayOn || "email",
                limitOnePerEmail: discountSettings.limitPerEmail || false
            },
            channelTypes: channelItems
                .filter(channel => channel.isEnabled)
                .map(channel => channel.id),
            totalResponses: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Capture HTML content from the survey preview using enhanced methods
        let htmlContent = '';
        let cleanHTML = '';
        let completeHTML = '';

        if (surveyPreviewRef && surveyPreviewRef.current) {
            htmlContent = surveyPreviewRef.current.getBodyContent();
            cleanHTML = surveyPreviewRef.current.getCleanHTML();
            completeHTML = surveyPreviewRef.current.getCompleteHTML();
        }

        // Use helper for API formatting
        const apiFormattedData = formatSurveyForAPI(surveyData);

        // Prepare complete survey data with HTML for backend storage
        const completeSurveyData = prepareSurveyForBackend(surveyData, htmlContent);

        console.log('API Formatted Data (New Structure):', apiFormattedData);
        console.log('Complete Survey Data with HTML (New Structure):', completeSurveyData);
        console.log('Survey Type:', completeSurveyData.survey_type);
        console.log('Status:', completeSurveyData.status);
        console.log('Is Active:', completeSurveyData.is_active);
        console.log('Survey Meta Data:', completeSurveyData.survey_meta_data);
        console.log('Container HTML Content (th-sf-survey-container):', completeSurveyData.survey_meta_data?.htmlContent);
        console.log('Clean Container HTML:', completeSurveyData.survey_meta_data?.cleanHTML);
        console.log('Complete Container HTML:', completeSurveyData.survey_meta_data?.completeHTML);

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
        saveSurveyMutation(completeSurveyData);
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
                    <InlineStack gap="400" blockAlign="center">
                        {/* Branded Survey Page Popover */}
                        <Popover
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
                        </Popover>

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

                {/* Right Section - Status, Refresh and Save Button */}
                <InlineStack gap="200" blockAlign="center" wrap={false}>
                    {/* Refresh Button */}
                    <Button
                        variant="secondary"
                        size="slim"
                        onClick={() => surveyPreviewRef?.current?.refreshIframe()}
                    >
                        Refresh
                    </Button>
                    {/* Save Button */}
                    <Button
                        variant="primary"
                        size="slim"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
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