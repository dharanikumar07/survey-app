import React, { forwardRef } from 'react';
import { Box, Grid } from '@shopify/polaris';
import QuestionList from '../panels/QuestionList';
import SurveyPreview from '../panels/SurveyPreview';
import QuestionSettings from '../panels/QuestionSettings';
import { useSurveyState } from '../../hooks/useSurveyState';

/**
 * SurveyLayout - A three-panel layout for survey builder
 * 
 * This component organizes the survey builder interface into three panels:
 * - Left panel: Question list with tabs for Content, Channel, and Discount
 * - Center panel: Survey preview showing the currently selected question
 * - Right panel: Question settings for editing the selected question
 * 
 * View modes:
 * - Desktop: Default three-panel layout
 * - Mobile: Reduced width side panels
 * - Fullscreen: Hidden side panels, expanded preview
 */
const SurveyLayout = forwardRef((props, ref) => {
    const { selectedView } = useSurveyState();

    // Determine column spans based on view mode
    const getColumnSpans = () => {
        switch (selectedView) {
            case 'mobile':
                return {
                    left: { xs: 12, sm: 12, md: 2, lg: 2, xl: 2 },
                    center: { xs: 12, sm: 12, md: 8, lg: 8, xl: 8 },
                    right: { xs: 12, sm: 12, md: 2, lg: 2, xl: 2 }
                };
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
        <Box padding="0" height="100vh" overflow="hidden" className="th-sf-survey-layout">
            <Grid>
                {/* Left Panel - Question List */}
                {selectedView !== 'maximize' && (
                    <Grid.Cell columnSpan={columnSpans.left}>
                        <QuestionList />
                    </Grid.Cell>
                )}

                {/* Center Panel - Survey Preview */}
                <Grid.Cell columnSpan={columnSpans.center}>
                    <SurveyPreview ref={ref} />
                </Grid.Cell>

                {/* Right Panel - Question Settings */}
                {selectedView !== 'maximize' && (
                    <Grid.Cell columnSpan={columnSpans.right}>
                        <QuestionSettings />
                    </Grid.Cell>
                )}
            </Grid>
        </Box>
    );
});

export default SurveyLayout;