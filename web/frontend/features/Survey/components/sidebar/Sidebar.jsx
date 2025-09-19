import React from 'react';
import {
    Box,
    Text,
    BlockStack,
    InlineStack,
    Button,
    ButtonGroup,
    Divider,
    Modal,
    TextField
} from '@shopify/polaris';
import { EditIcon } from '@shopify/polaris-icons';
import { ContentTab } from '../tabs/ContentTab';
import { ChannelTab } from '../tabs/ChannelTab';
import { AdvancedTab } from '../tabs/AdvancedTab';
import { useSurveyState } from '../../hooks/useSurveyState';

function Sidebar({ items = [], onSelectItem = () => { } }) {
    const {
        selectedTab,
        setSelectedTab,
        editModalOpen,
        setEditModalOpen,
        surveyTitle,
        setSurveyTitle
    } = useSurveyState();

    const handleTabChange = (selectedTabIndex) => {
        setSelectedTab(selectedTabIndex);
    };

    const tabs = [
        {
            id: 'content',
            content: 'Content',
            accessibilityLabel: 'Content tab',
            panelID: 'content-panel',
        },
        {
            id: 'channel',
            content: 'Channel',
            accessibilityLabel: 'Channel tab',
            panelID: 'channel-panel',
        },
        {
            id: 'advanced',
            content: 'Advanced',
            accessibilityLabel: 'Advanced tab',
            panelID: 'advanced-panel',
        },
    ];

    const renderTabContent = () => {
        switch (selectedTab) {
            case 0:
                return <ContentTab items={items} onSelectItem={onSelectItem} />;
            case 1:
                return <ChannelTab />;
            case 2:
                return <AdvancedTab />;
            default:
                return <ContentTab items={items} onSelectItem={onSelectItem} />;
        }
    };

    const handleSave = () => {
        setEditModalOpen(false);
    };

    return (
        <Box
            background="bg-surface"
            borderInlineEndWidth="1"
            borderColor="border"
            padding="400"
            minHeight="calc(100vh - 100px)"
            overflow="auto"
        >
            <BlockStack gap="400">
                {/* Header Section */}
                <InlineStack align="space-between" blockAlign="center">
                    <Text variant="headingLg" as="h2">{surveyTitle}</Text>
                    <Button size="slim" variant="plain" icon={EditIcon} accessibilityLabel="Edit survey" onClick={() => setEditModalOpen(true)} />
                </InlineStack>
                <Divider />
                {/* Tabs Section */}
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
                            Advanced
                        </Button>
                    </ButtonGroup>
                    <Box paddingBlockStart="400">
                        <Divider />
                        {renderTabContent()}
                    </Box>
                </Box>
            </BlockStack>

            {/* Edit Survey Modal (Polaris) */}
            <Modal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit survey"
                primaryAction={{ content: 'Save', onAction: handleSave }}
                secondaryActions={[{ content: 'Cancel', onAction: () => setEditModalOpen(false) }]}
            >
                <Box padding="400">
                    <BlockStack gap="300">
                        <TextField label="Survey title" value={surveyTitle} onChange={setSurveyTitle} autoComplete="off" />
                    </BlockStack>
                </Box>
            </Modal>
        </Box>
    );
}

export default Sidebar;