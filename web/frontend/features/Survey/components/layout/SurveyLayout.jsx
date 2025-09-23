import React, { forwardRef, useRef } from 'react';
import { Box, Grid, Text } from '@shopify/polaris';
import QuestionList from '../panels/QuestionList';
import QuestionSettings from '../panels/QuestionSettings';
import ModalHeader from '../common/ModalHeader';
import SurveyLoader from '../SurveyLoader';
import { useSurveyState } from '../../hooks/useSurveyState';
import SurveyIframeProduction from '../panels/SurveyIframeProduction';

/**
 * SurveyLayout - A complete survey editor interface
 * 
 * This component provides a full survey editing experience with:
 * - Data loading via SurveyLoader
 * - Header controls via ModalHeader
 * - Three-panel layout for editing:
 *   - Left panel: Question list with tabs for Content, Channel, and Discount
 *   - Center panel: Survey preview showing the currently selected question
 *   - Right panel: Question settings for editing the selected question
 * 
 * View modes:
 * - Desktop: Default three-panel layout
 * - Mobile: Reduced width side panels
 * - Fullscreen: Hidden side panels, expanded preview
 */
const SurveyLayout = forwardRef(({ surveyId, onClose }, ref) => {
    const surveyPreviewRef = ref || useRef(null);
    const { selectedView } = useSurveyState();
    
    // Determine column spans based on view mode
    const getColumnSpans = () => {
        switch (selectedView) {
            case 'maximize':
                return {
                    left: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 },
                    center: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
                    right: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 }
                };
            default: // desktop
                return {
                    left: { xs: 12, sm: 12, md: 3, lg: 3, xl: 3 },
                    center: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
                    right: { xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }
                };
        }
    };

    const columnSpans = getColumnSpans();

    return (
        <SurveyLoader surveyId={surveyId}>
            <div className="th-sf-survey-editor">
                <ModalHeader surveyPreviewRef={surveyPreviewRef} onClose={onClose} />

                <div style={{ overflow: 'hidden' }}>
                    <Box padding="0" height="100%" overflow="hidden" className="th-sf-survey-layout">
                        <Grid>
                            {/* Left Panel - Question List */}
                            {selectedView !== 'maximize' && (
                                <Grid.Cell columnSpan={columnSpans.left}>
                                    <QuestionList surveyPreviewRef={surveyPreviewRef} />
                                </Grid.Cell>
                            )}

                            {/* Center Panel - Survey Preview */}
                            <Grid.Cell columnSpan={columnSpans.center}>
                                <SurveyIframeProduction ref={surveyPreviewRef} />
                            </Grid.Cell>

                            {/* Right Panel - Question Settings */}
                            {selectedView !== 'maximize' && (
                                <Grid.Cell columnSpan={columnSpans.right}>
                                    <QuestionSettings surveyPreviewRef={surveyPreviewRef} />
                                </Grid.Cell>
                            )}
                        </Grid>
                    </Box>
                </div>
            </div>
        </SurveyLoader>
    );
});

export default SurveyLayout;