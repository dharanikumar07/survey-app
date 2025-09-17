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
const SurveyModalContent = forwardRef(({ templateKey, uuid, onClose, ...props }, ref) => {
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
        // Always reset to empty state first
        resetSurveyToDefault();

        // Case 1: Editing an existing survey - load from API
        if (uuid) {
            // API call will be handled by SurveyLoader component
            return;
        }

        // Case 2: Creating from template - load template data for initial state only
        if (templateKey) {

            // Get AI data if available (for ai_creation template)
            let aiOverrides = {};
            if (templateKey === 'ai_creation') {
                try {
                    const storedAIData = localStorage.getItem('aiSurveyData');
                    if (storedAIData) {
                        aiOverrides = JSON.parse(storedAIData);
                        // Clear the data after use
                        localStorage.removeItem('aiSurveyData');
                    }
                } catch (error) {
                    console.error('Error loading AI data:', error);
                }
            }

            // Load template data with AI overrides for initial state only
            const templateData = loadTemplateData(templateKey, aiOverrides);
            if (templateData) {
                // Update store with template data (including AI overrides)
                setSurveyTitle(templateData.surveyTitle);
                setQuestions(templateData.questions);
                setChannelItems?.(templateData.channelItems);
                setDiscountEnabled(templateData.discountEnabled);
                setDiscountSettings(templateData.discountSettings);
                setDiscountSections?.(templateData.discountSections);
                setSelectedTheme(templateData.selectedTheme);
                setIsActive(templateData.isActive);
            }
            return;
        }

        // Case 3: Creating new survey without template - start with empty state
    }, [templateKey, uuid]);

    return <SurveyLayout ref={ref} surveyId={uuid} onClose={onClose} />;
});

export default SurveyModalContent;