import React from 'react';
import { Box, BlockStack, Button, ButtonGroup, Divider } from '@shopify/polaris';
import { ContentTab } from '../tabs/ContentTab';
import { ChannelTab } from '../tabs/ChannelTab';
import { PreferencesTab } from '../tabs/PreferencesTab';
import { useSurveyState } from '../../hooks/useSurveyState';
import AdvancedTab from '../tabs/AdvancedTab';

function TabsContent({ surveyPreviewRef }) {
    const { selectedTab, setSelectedTab } = useSurveyState();

    const handleTabChange = (selectedTabIndex) => {
        setSelectedTab(selectedTabIndex);
    };

    const renderTabContent = () => {
        switch (selectedTab) {
            case 0:
                return <ContentTab surveyPreviewRef={surveyPreviewRef} />;
            case 1:
                return <ChannelTab />;
            case 2:
                return <AdvancedTab />;
            case 3:
                return <PreferencesTab />;
            default:
                return <ContentTab surveyPreviewRef={surveyPreviewRef} />;
        }
    };

    return (
        <Box>
            <ButtonGroup variant="segmented" fullWidth>
                <Button
                    pressed={selectedTab === 0}
                    onClick={() => handleTabChange(0)}
                    variant='tertiary'
                >
                    Content
                </Button>
                <Button
                    pressed={selectedTab === 1}
                    onClick={() => handleTabChange(1)}
                    variant='tertiary'
                >
                    Channel
                </Button>
                <Button
                    pressed={selectedTab === 2}
                    onClick={() => handleTabChange(2)}
                    variant='tertiary'
                >
                    Advance
                </Button>
                <Button
                    pressed={selectedTab === 3}
                    onClick={() => handleTabChange(3)}
                    variant='tertiary'
                >
                    Preferences
                </Button>
            </ButtonGroup>
            <Box paddingBlockStart="200">
                <Divider />
                <div style={{ marginTop: '10px' }}>
                    {renderTabContent()}
                </div>
            </Box>
        </Box>
    );
}

export default TabsContent;