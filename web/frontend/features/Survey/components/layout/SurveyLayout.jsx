import React from 'react';
import { Box, Grid } from '@shopify/polaris';
import { QuestionList, SurveyPreview, QuestionSettings } from '../panels';

/**
 * SurveyLayout - A three-panel layout for survey builder
 * 
 * This component organizes the survey builder interface into three panels:
 * - Left panel: Question list with tabs for Content, Channel, and Discount
 * - Center panel: Survey preview showing the currently selected question
 * - Right panel: Question settings for editing the selected question
 */
function SurveyLayout() {
    return (
        <Box padding="0">
            <Grid>
                {/* Left Panel - Question List */}
                <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                    <QuestionList />
                </Grid.Cell>

                {/* Center Panel - Survey Preview */}
                <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                    <SurveyPreview />
                </Grid.Cell>

                {/* Right Panel - Question Settings */}
                <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                    <QuestionSettings />
                </Grid.Cell>
            </Grid>
        </Box>
    );
}

export default SurveyLayout;