import React, { forwardRef, useEffect } from 'react';
import SurveyLayout from '../layout/SurveyLayout';
import useStore from '../../../../State/store';
import { loadTemplateData } from '../../utils/templateHelpers';

/**
 * SurveyModalContent - Main container for the survey builder interface
 * 
 * This component serves as the entry point for the survey builder interface.
 * It uses a three-panel layout organized by SurveyLayout component:
 * - Left: Question list with tabs (Content, Channel, Discount)
 * - Center: Survey preview showing the current question
 * - Right: Question settings panel for editing the selected question
 * 
 * All state management is handled by Zustand store, allowing seamless
 * communication between the panels.
 * 
 * @param {Object} props Component props
 * @param {string} props.templateKey Optional template key to load from surveyData.json
 * @param {string} props.uuid Optional survey ID for editing existing surveys
 */
const SurveyModalContent = forwardRef(({ templateKey, uuid, ...props }, ref) => {
    // Get store setters to load template data
    const resetSurveyToDefault = useStore((state) => state.resetSurveyToDefault);
    const setSurveyTitle = useStore((state) => state.setSurveyTitle);
    const setQuestions = useStore((state) => state.setQuestions);
    const setChannelItems = useStore((state) => state.setChannelItems);
    const setDiscountEnabled = useStore((state) => state.setDiscountEnabled);
    const setDiscountSettings = useStore((state) => state.setDiscountSettings);
    const setDiscountSections = useStore((state) => state.setDiscountSections);
    const setSelectedTheme = useStore((state) => state.setSelectedTheme);
    const setIsActive = useStore((state) => state.setIsActive);

    // Load survey data when the component mounts
    useEffect(() => {
        // Case 1: Editing an existing survey
        if (uuid) {
            // In a real app, we would fetch the survey data from the API
            // For now, we'll use mock data or reset to default
            console.log(`Loading survey data for UUID: ${uuid}`);

            // TODO: Replace with API call to fetch survey data
            // For now, just reset to default
            resetSurveyToDefault();

            return;
        }

        // Case 2: Creating from template
        if (templateKey) {
            // Load template data
            const templateData = loadTemplateData(templateKey);
            if (templateData) {
                // Update store with template data
                setSurveyTitle(templateData.surveyTitle);
                setQuestions(templateData.questions);
                setChannelItems?.(templateData.channelItems);
                setDiscountEnabled(templateData.discountEnabled);
                setDiscountSettings(templateData.discountSettings);
                setDiscountSections?.(templateData.discountSections);
                setSelectedTheme(templateData.selectedTheme);
                setIsActive(templateData.isActive);
            } else {
                // Fallback to default data if template couldn't be loaded
                resetSurveyToDefault();
            }
            return;
        }

        // Case 3: No template or UUID, use default data
        resetSurveyToDefault();
    }, [templateKey, uuid]);

    return <SurveyLayout ref={ref} />;
});

export default SurveyModalContent;