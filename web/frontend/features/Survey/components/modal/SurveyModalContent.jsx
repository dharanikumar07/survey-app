import React, { forwardRef } from 'react';
import SurveyLayout from '../layout/SurveyLayout';

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
 */
const SurveyModalContent = forwardRef((props, ref) => {
    return <SurveyLayout ref={ref} />;
});

export default SurveyModalContent;